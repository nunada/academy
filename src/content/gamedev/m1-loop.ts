import type { Module } from '../types'

/** Module 1 — the loop itself: three functions, elapsed time, and the keyboard. */

export const module1: Module = {
  id: 'gd-m1',
  title: { en: 'Frame by Frame', id: 'Bingkai demi Bingkai' },
  summary: {
    en: 'A game is a loop over state. Learn the three functions it needs, and why time is a number you are given.',
    id: 'Game adalah loop atas keadaan. Pelajari tiga fungsi yang ia butuhkan, dan mengapa waktu adalah angka yang diberikan kepadamu.',
  },
  submodules: [
    {
      id: 'gd-m1-s1',
      title: { en: 'The Game Loop', id: 'Loop Permainan' },
      summary: {
        en: 'State in, state out, and a picture of it — sixty times a second.',
        id: 'Keadaan masuk, keadaan keluar, dan gambarnya — enam puluh kali sedetik.',
      },
      lessons: [
        {
          id: 'gd-m1-s1-l1',
          title: { en: 'Three functions', id: 'Tiga fungsi' },
          goal: { en: 'Put something on the screen.', id: 'Menaruh sesuatu di layar.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A game is a loop over state', id: 'Game adalah loop atas keadaan' },
              body: {
                en: 'Underneath the graphics, every game is the same three steps repeated: work out the new situation, draw it, wait for the next frame. The situation is just data — where everything is, what the score is — and it is called the **state**. Nothing else is remembered between frames.',
                id: 'Di balik grafiknya, tiap game adalah tiga langkah yang sama diulang-ulang: hitung situasi barunya, gambar, tunggu bingkai berikutnya. Situasinya sekadar data — di mana segalanya berada, berapa skornya — dan itu disebut **keadaan**. Tidak ada hal lain yang diingat di antara bingkai.',
              },
              code:
                'keadaan = awal()\n' +
                'while True:\n' +
                '    keadaan = perbarui(keadaan, tombol, dt)\n' +
                '    gambar(keadaan)',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'You write the three; the loop is ours', id: 'Kamu menulis yang tiga; loop-nya milik kami' },
              body: {
                en: '`awal()` gives the starting state. `perbarui(keadaan, tombol, dt)` gives the next one. `gambar(keadaan)` says what to draw. You never write the loop, never clear the screen, never read the keyboard yourself — you are handed the keys that are down and the time that passed, and you return data.',
                id: '`awal()` memberi keadaan awalnya. `perbarui(keadaan, tombol, dt)` memberi keadaan berikutnya. `gambar(keadaan)` menyatakan apa yang digambar. Kamu tak pernah menulis loop-nya, tak pernah membersihkan layar, tak pernah membaca papan ketik sendiri — kamu diberi tombol yang sedang ditekan dan waktu yang berlalu, lalu kamu mengembalikan data.',
              },
              code:
                'def awal():\n' +
                '    return {"x": 40, "y": 100}\n\n' +
                'def perbarui(keadaan, tombol, dt):\n' +
                '    return keadaan\n\n' +
                'def gambar(keadaan):\n' +
                '    return [{"bentuk": "kotak", "x": keadaan["x"], "y": keadaan["y"], "l": 30, "t": 30, "warna": "#ef8f70"}]',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'gambar returns data, it does not paint', id: 'gambar mengembalikan data, ia tidak melukis' },
              body: {
                en: '`gambar` hands back a **list of drawing commands** — plain dictionaries. It does not touch a screen. That is what lets a check call it with a made-up state and look at what came back, and it is why the same function would work just as well drawing to a window, a file, or nothing at all.',
                id: '`gambar` mengembalikan **daftar perintah gambar** — dictionary biasa. Ia tak menyentuh layar. Itulah yang membuat sebuah pemeriksaan bisa memanggilnya dengan keadaan karangan lalu melihat apa yang kembali, dan itulah sebabnya fungsi yang sama akan sama baiknya menggambar ke jendela, ke berkas, atau ke mana pun.',
              },
              code:
                '{"bentuk": "kotak", "x": 10, "y": 20, "l": 30, "t": 40, "warna": "#ef8f70"}\n' +
                '{"bentuk": "lingkaran", "x": 60, "y": 60, "r": 8, "warna": "#24463d"}\n' +
                '{"bentuk": "garis", "x1": 0, "y1": 0, "x2": 320, "y2": 240, "tebal": 2, "warna": "#7eaa71"}\n' +
                '{"bentuk": "teks", "x": 8, "y": 8, "isi": "Skor: 3", "ukuran": 12, "warna": "#24463d"}',
            },
            {
              kind: 'concept',
              id: 'c4',
              title: { en: 'The field, and which way is down', id: 'Lapangannya, dan arah mana yang bawah' },
              body: {
                en: 'The field is 320 across and 240 down, with `(0, 0)` at the **top left**. So `y` grows downwards — a smaller `y` is higher on the screen. Every graphics system does this, and it catches everybody once.',
                id: 'Lapangannya 320 melintang dan 240 menurun, dengan `(0, 0)` di **kiri atas**. Jadi `y` bertambah ke bawah — `y` yang lebih kecil berarti lebih tinggi di layar. Tiap sistem grafis melakukan ini, dan ia menjebak semua orang sekali.',
              },
              code:
                '(0, 0) ---------------- (320, 0)\n' +
                '  |                        |\n' +
                '  |        320 x 240       |\n' +
                '  |                        |\n' +
                '(0, 240) ------------ (320, 240)',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'You want something to appear higher up the screen. What do you change?',
                id: 'Kamu ingin sesuatu tampak lebih tinggi di layar. Apa yang kamu ubah?',
              },
              options: [
                { en: 'Make `y` smaller', id: 'Buat `y` lebih kecil' },
                { en: 'Make `y` bigger', id: 'Buat `y` lebih besar' },
                { en: 'Make `x` smaller', id: 'Buat `x` lebih kecil' },
                { en: 'Nothing — the drawing order decides', id: 'Tidak ada — urutan menggambarnya yang menentukan' },
              ],
              answer: 0,
              explain: {
                en: '(0, 0) is the top left corner, so y counts downwards from there.',
                id: '(0, 0) adalah sudut kiri atas, jadi y menghitung ke bawah dari sana.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete a command that draws a circle of radius 10 at the centre of the field.',
                id: 'Lengkapi perintah yang menggambar lingkaran berjari-jari 10 di tengah lapangan.',
              },
              template: '{"bentuk": "lingkaran", "x": ___, "y": ___, "r": 10, "warna": "#ef8f70"}',
              blanks: ['160', '120'],
              explain: {
                en: 'Half of 320 across, half of 240 down.',
                id: 'Separuh dari 320 melintang, separuh dari 240 menurun.',
              },
            },
            {
              kind: 'game',
              id: 'g1',
              prompt: {
                en: 'Make a still picture: the state holds `x` and `y`, and `gambar` draws one 30 by 30 square in `#ef8f70` at that spot. Start at x 40, y 100.',
                id: 'Buat gambar diam: keadaannya menyimpan `x` dan `y`, dan `gambar` menggambar satu kotak 30 kali 30 berwarna `#ef8f70` di titik itu. Mulai di x 40, y 100.',
              },
              starter:
                'def awal():\n' +
                '    return {}\n\n' +
                'def perbarui(keadaan, tombol, dt):\n' +
                '    return keadaan\n\n' +
                'def gambar(keadaan):\n' +
                '    return []\n',
              tests: [
                {
                  name: { en: 'The starting state has a position', id: 'Keadaan awalnya punya posisi' },
                  assert:
                    'k = awal()\n' +
                    'assert isinstance(k, dict), f"awal() harus mengembalikan dict, sekarang: {type(k).__name__}"\n' +
                    'assert k.get("x") == 40, f\'awal()["x"] harus 40, sekarang: {k.get("x")}\'\n' +
                    'assert k.get("y") == 100, f\'awal()["y"] harus 100, sekarang: {k.get("y")}\'',
                },
                {
                  name: { en: 'It draws exactly one square', id: 'Ia menggambar tepat satu kotak' },
                  assert:
                    'a = gambar({"x": 40, "y": 100})\n' +
                    'assert isinstance(a, list), f"gambar() harus mengembalikan list, sekarang: {type(a).__name__}"\n' +
                    'assert len(a) == 1, f"harus tepat satu perintah, sekarang: {len(a)}"\n' +
                    'assert a[0].get("bentuk") == "kotak", f\'bentuknya harus "kotak", sekarang: {a[0].get("bentuk")}\'\n' +
                    'assert a[0].get("l") == 30 and a[0].get("t") == 30, f"ukurannya harus 30 kali 30, sekarang: {a[0].get(\'l\')} kali {a[0].get(\'t\')}"\n' +
                    'assert a[0].get("warna") == "#ef8f70", f\'warnanya harus "#ef8f70", sekarang: {a[0].get("warna")}\'',
                },
                {
                  name: { en: 'The square follows the state', id: 'Kotaknya mengikuti keadaannya' },
                  assert:
                    'a = gambar({"x": 100, "y": 50})\n' +
                    'assert a[0].get("x") == 100 and a[0].get("y") == 50, f"kotaknya harus di (100, 50), sekarang: ({a[0].get(\'x\')}, {a[0].get(\'y\')})"\n' +
                    'b = gambar({"x": 7, "y": 9})\n' +
                    'assert b[0].get("x") == 7 and b[0].get("y") == 9, "gambar harus membaca keadaannya, bukan memakai angka tetap"',
                },
                {
                  name: { en: 'Nothing moves yet', id: 'Belum ada yang bergerak' },
                  assert:
                    'k = perbarui({"x": 40, "y": 100}, set(), 0.5)\n' +
                    'assert k["x"] == 40 and k["y"] == 100, f"belum ada gerakan di pelajaran ini, sekarang: {k}"',
                },
              ],
              hints: [
                { en: 'The state is a dictionary. `awal()` returns it with the two keys already filled in.', id: 'Keadaannya sebuah dictionary. `awal()` mengembalikannya dengan kedua kuncinya sudah terisi.' },
                { en: '`gambar` returns a list with one dictionary in it, not the dictionary on its own.', id: '`gambar` mengembalikan list berisi satu dictionary, bukan dictionary-nya sendirian.' },
                { en: 'Read the position out of the state: `"x": keadaan["x"]`.', id: 'Baca posisinya dari keadaannya: `"x": keadaan["x"]`.' },
              ],
              solution:
                'def awal():\n' +
                '    return {"x": 40, "y": 100}\n\n' +
                'def perbarui(keadaan, tombol, dt):\n' +
                '    return keadaan\n\n' +
                'def gambar(keadaan):\n' +
                '    return [\n' +
                '        {"bentuk": "kotak", "x": keadaan["x"], "y": keadaan["y"], "l": 30, "t": 30, "warna": "#ef8f70"}\n' +
                '    ]\n',
            },
          ],
        },
        {
          id: 'gd-m1-s1-l2',
          title: { en: 'Time is a number you are given', id: 'Waktu adalah angka yang diberikan kepadamu' },
          goal: { en: 'Move something at a speed, not at a rate per frame.', id: 'Menggerakkan sesuatu pada sebuah kecepatan, bukan sekian per bingkai.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Frames are not evenly spaced', id: 'Bingkai tidak berjarak sama' },
              body: {
                en: 'It is tempting to write `x = x + 2` and call it movement. But frames arrive when the machine can manage them — sixty a second on a good day, thirty on a busy one. Add a fixed amount per frame and your game runs at half speed on a slower computer, which is exactly the bug that made old PC games unplayable on new hardware.',
                id: 'Menggoda sekali menulis `x = x + 2` lalu menyebutnya gerakan. Tapi bingkai datang saat mesinnya sanggup — enam puluh sedetik di hari baik, tiga puluh di hari sibuk. Tambahkan jumlah tetap tiap bingkai dan gamemu berjalan setengah kecepatan di komputer yang lebih lambat, dan persis itulah kutu yang membuat game PC lama tak bisa dimainkan di perangkat keras baru.',
              },
              code: {
                en: '# depends on the machine\nx = x + 2\n\n# depends on time\nx = x + 80 * dt',
                id: '# tergantung mesin\nx = x + 2\n\n# tergantung waktu\nx = x + 80 * dt',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'dt is seconds since the last frame', id: 'dt adalah detik sejak bingkai terakhir' },
              body: {
                en: '`dt` is a small fraction — about `0.016` at sixty frames a second. Multiply a **speed** by it and you get how far to move this frame. Now "80 pixels per second" means 80 pixels per second on every machine, and the number in your code is a quantity you can reason about instead of a magic constant.',
                id: '`dt` adalah pecahan kecil — sekitar `0.016` pada enam puluh bingkai sedetik. Kalikan sebuah **kecepatan** dengannya dan kamu mendapat sejauh apa bergerak di bingkai ini. Sekarang "80 piksel per detik" berarti 80 piksel per detik di tiap mesin, dan angka di kodemu jadi besaran yang bisa kamu nalar alih-alih konstanta ajaib.',
              },
              code: {
                en:
                  'KECEPATAN = 80   # pixels per second\n\n' +
                  'def perbarui(keadaan, tombol, dt):\n' +
                  '    return {"x": keadaan["x"] + KECEPATAN * dt, "y": keadaan["y"]}',
                id:
                  'KECEPATAN = 80   # piksel per detik\n\n' +
                  'def perbarui(keadaan, tombol, dt):\n' +
                  '    return {"x": keadaan["x"] + KECEPATAN * dt, "y": keadaan["y"]}',
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Return a new state; do not edit the old one', id: 'Kembalikan keadaan baru; jangan sunting yang lama' },
              body: {
                en: '`perbarui` is handed a state and returns the next one. Build a new dictionary rather than changing the one you were given. It costs nothing here, and it buys a great deal: a function that only reads its arguments can be called with a made-up state at any time — which is exactly what every check in this course does.',
                id: '`perbarui` diberi sebuah keadaan dan mengembalikan keadaan berikutnya. Bangun dictionary baru alih-alih mengubah yang diberikan padamu. Di sini itu tak berbiaya, dan hasilnya banyak: fungsi yang hanya membaca argumennya bisa dipanggil dengan keadaan karangan kapan saja — dan persis itulah yang dilakukan tiap pemeriksaan di kursus ini.',
              },
              code: {
                en:
                  '# don\'t\ndef perbarui(keadaan, tombol, dt):\n' +
                  '    keadaan["x"] += 80 * dt\n' +
                  '    return keadaan\n\n' +
                  '# like this\ndef perbarui(keadaan, tombol, dt):\n' +
                  '    return {"x": keadaan["x"] + 80 * dt, "y": keadaan["y"]}',
                id:
                  '# jangan\ndef perbarui(keadaan, tombol, dt):\n' +
                  '    keadaan["x"] += 80 * dt\n' +
                  '    return keadaan\n\n' +
                  '# begini\ndef perbarui(keadaan, tombol, dt):\n' +
                  '    return {"x": keadaan["x"] + 80 * dt, "y": keadaan["y"]}',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A game runs at 30 frames a second instead of 60. What happens to `x = x + 80 * dt`?',
                id: 'Sebuah game berjalan 30 bingkai sedetik alih-alih 60. Apa yang terjadi pada `x = x + 80 * dt`?',
              },
              options: [
                { en: 'Nothing — half as many frames, each moving twice as far', id: 'Tidak apa-apa — separuh jumlah bingkainya, tiap bingkai bergerak dua kali lebih jauh' },
                { en: 'It moves at half speed', id: 'Ia bergerak setengah kecepatan' },
                { en: 'It moves at double speed', id: 'Ia bergerak dua kali kecepatan' },
                { en: 'It stops', id: 'Ia berhenti' },
              ],
              answer: 0,
              explain: {
                en: 'That is the whole point of dt: fewer frames means a bigger dt each time, and the distance per second stays the same.',
                id: 'Itulah seluruh gunanya dt: bingkai yang lebih sedikit berarti dt yang lebih besar tiap kali, dan jarak per detiknya tetap sama.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble an update that moves at a speed and leaves the old state alone.',
                id: 'Susun pembaruan yang bergerak pada sebuah kecepatan dan membiarkan keadaan lamanya.',
              },
              lines: [
                'def perbarui(keadaan, tombol, dt):',
                '    x = keadaan["x"] + 80 * dt',
                '    y = keadaan["y"]',
                '    return {"x": x, "y": y}',
              ],
              explain: {
                en: 'Read out of the old state, work out the new numbers, then build the new dictionary.',
                id: 'Baca dari keadaan lamanya, hitung angka barunya, lalu bangun dictionary barunya.',
              },
            },
            {
              kind: 'game',
              id: 'g1',
              prompt: {
                en: 'The square slides right at **80 pixels per second**. It starts at x 20, y 100, and is 20 by 20 in `#24463d`. It may run off the edge for now.',
                id: 'Kotaknya meluncur ke kanan dengan **80 piksel per detik**. Ia mulai di x 20, y 100, berukuran 20 kali 20 berwarna `#24463d`. Untuk sekarang ia boleh keluar dari tepi.',
              },
              starter:
                'def awal():\n' +
                '    return {"x": 20.0, "y": 100.0}\n\n' +
                'def perbarui(keadaan, tombol, dt):\n' +
                '    return {"x": keadaan["x"] + 2, "y": keadaan["y"]}\n\n' +
                'def gambar(keadaan):\n' +
                '    return [\n' +
                '        {"bentuk": "kotak", "x": keadaan["x"], "y": keadaan["y"], "l": 20, "t": 20, "warna": "#24463d"}\n' +
                '    ]\n',
              tests: [
                {
                  name: { en: 'One second moves it 80 pixels', id: 'Satu detik menggesernya 80 piksel' },
                  assert:
                    'k = perbarui({"x": 0.0, "y": 100.0}, set(), 1.0)\n' +
                    'assert abs(k["x"] - 80) < 1e-9, f"setelah 1 detik x harus 80, sekarang: {k[\'x\']}"',
                },
                {
                  name: { en: 'Half a second moves it 40', id: 'Setengah detik menggesernya 40' },
                  assert:
                    'k = perbarui({"x": 10.0, "y": 100.0}, set(), 0.5)\n' +
                    'assert abs(k["x"] - 50) < 1e-9, f"10 + 40 harus 50, sekarang: {k[\'x\']}"',
                },
                {
                  name: { en: 'Ten small steps match one big one', id: 'Sepuluh langkah kecil sama dengan satu langkah besar' },
                  assert:
                    'k = {"x": 0.0, "y": 100.0}\n' +
                    'for _ in range(10):\n' +
                    '    k = perbarui(k, set(), 0.1)\n' +
                    'assert abs(k["x"] - 80) < 1e-6, f"sepuluh kali 0.1 detik juga harus 80, sekarang: {k[\'x\']}"',
                },
                {
                  name: { en: 'It does not drift up or down', id: 'Ia tidak melayang naik atau turun' },
                  assert:
                    'k = perbarui({"x": 0.0, "y": 100.0}, set(), 0.3)\n' +
                    'assert abs(k["y"] - 100) < 1e-9, f"y harus tetap 100, sekarang: {k[\'y\']}"',
                },
                {
                  name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
                  assert:
                    'k = {"x": 5.0, "y": 100.0}\n' +
                    'salinan = dict(k)\n' +
                    'perbarui(k, set(), 0.25)\n' +
                    'assert k == salinan, f"perbarui tidak boleh mengubah keadaan yang diberikan, sekarang jadi: {k}"',
                },
                {
                  name: { en: 'It still starts where it should', id: 'Ia tetap mulai di tempat yang seharusnya' },
                  assert:
                    'k = awal()\n' +
                    'assert k["x"] == 20 and k["y"] == 100, f"awal harus (20, 100), sekarang: ({k[\'x\']}, {k[\'y\']})"',
                },
              ],
              hints: [
                { en: 'The starter adds 2 every frame. That is a distance, not a speed.', id: 'Kode awalnya menambah 2 tiap bingkai. Itu jarak, bukan kecepatan.' },
                { en: 'Multiply the speed by `dt` — the seconds that passed since the last frame.', id: 'Kalikan kecepatannya dengan `dt` — detik yang berlalu sejak bingkai terakhir.' },
                { en: 'keadaan["x"] + 80 * dt', id: 'keadaan["x"] + 80 * dt' },
              ],
              solution:
                'KECEPATAN = 80\n\n' +
                'def awal():\n' +
                '    return {"x": 20.0, "y": 100.0}\n\n' +
                'def perbarui(keadaan, tombol, dt):\n' +
                '    return {"x": keadaan["x"] + KECEPATAN * dt, "y": keadaan["y"]}\n\n' +
                'def gambar(keadaan):\n' +
                '    return [\n' +
                '        {"bentuk": "kotak", "x": keadaan["x"], "y": keadaan["y"], "l": 20, "t": 20, "warna": "#24463d"}\n' +
                '    ]\n',
            },
          ],
        },
      ],
      project: {
        id: 'gd-m1-s1-p1',
        runtime: 'game',
        title: { en: 'The Bouncing Ball', id: 'Bola Pantul' },
        brief: {
          en: 'A ball that never leaves the field. Simple to describe, and it contains the bug that every first bouncing ball has.',
          id: 'Bola yang tak pernah meninggalkan lapangan. Mudah dijelaskan, dan di dalamnya ada kutu yang dimiliki tiap bola pantul pertama.',
        },
        requirements: [
          { en: '`awal()` returns `{"x": 60.0, "y": 60.0, "vx": 90.0, "vy": 70.0}` — a position and a velocity in pixels per second.', id: '`awal()` mengembalikan `{"x": 60.0, "y": 60.0, "vx": 90.0, "vy": 70.0}` — sebuah posisi dan kecepatan dalam piksel per detik.' },
          { en: 'Each frame the ball moves by its velocity times `dt`.', id: 'Tiap bingkai bolanya bergerak sebesar kecepatannya dikali `dt`.' },
          { en: 'The ball has a radius of 8. When its edge would pass a wall, put it exactly against the wall and send it the other way.', id: 'Bolanya berjari-jari 8. Ketika tepinya akan melewati dinding, taruh ia tepat menempel dindingnya dan kirim ke arah sebaliknya.' },
          { en: 'The field is 320 by 240, so the centre stays between 8 and 312 across, and 8 and 232 down.', id: 'Lapangannya 320 kali 240, jadi pusatnya tetap antara 8 dan 312 melintang, serta 8 dan 232 menurun.' },
          { en: '`gambar` draws one circle of radius 8 in `#ef8f70` at the ball.', id: '`gambar` menggambar satu lingkaran berjari-jari 8 berwarna `#ef8f70` di posisi bolanya.' },
          { en: '`perbarui` must not change the state it was given.', id: '`perbarui` tidak boleh mengubah keadaan yang diberikan padanya.' },
        ],
        starter:
          'JARI = 8\n\n' +
          'def awal():\n' +
          '    return {"x": 60.0, "y": 60.0, "vx": 90.0, "vy": 70.0}\n\n' +
          'def perbarui(keadaan, tombol, dt):\n' +
          '    x = keadaan["x"] + keadaan["vx"] * dt\n' +
          '    y = keadaan["y"] + keadaan["vy"] * dt\n' +
          '    return {"x": x, "y": y, "vx": keadaan["vx"], "vy": keadaan["vy"]}\n\n' +
          'def gambar(keadaan):\n' +
          '    return [\n' +
          '        {"bentuk": "lingkaran", "x": keadaan["x"], "y": keadaan["y"], "r": JARI, "warna": "#ef8f70"}\n' +
          '    ]\n',
        tests: [
          {
            name: { en: 'It starts where it should', id: 'Ia mulai di tempat yang seharusnya' },
            assert:
              'k = awal()\n' +
              'assert k["x"] == 60 and k["y"] == 60, f"posisi awal harus (60, 60), sekarang: ({k[\'x\']}, {k[\'y\']})"\n' +
              'assert k["vx"] == 90 and k["vy"] == 70, f"kecepatan awal harus (90, 70), sekarang: ({k[\'vx\']}, {k[\'vy\']})"',
          },
          {
            name: { en: 'In open space it just drifts', id: 'Di ruang terbuka ia sekadar melayang' },
            assert:
              'k = perbarui({"x": 100.0, "y": 100.0, "vx": 90.0, "vy": 70.0}, set(), 0.5)\n' +
              'assert abs(k["x"] - 145) < 1e-9, f"x harus 100 + 45 = 145, sekarang: {k[\'x\']}"\n' +
              'assert abs(k["y"] - 135) < 1e-9, f"y harus 100 + 35 = 135, sekarang: {k[\'y\']}"\n' +
              'assert k["vx"] == 90 and k["vy"] == 70, "jauh dari dinding, kecepatannya tidak berubah"',
          },
          {
            name: { en: 'The left wall turns it around', id: 'Dinding kiri memutarnya balik' },
            assert:
              'k = perbarui({"x": 10.0, "y": 100.0, "vx": -90.0, "vy": 0.0}, set(), 0.1)\n' +
              'assert abs(k["x"] - 8) < 1e-9, f"harus berhenti tepat di 8, sekarang: {k[\'x\']}"\n' +
              'assert k["vx"] > 0, f"vx harus jadi positif, sekarang: {k[\'vx\']}"\n' +
              'assert abs(abs(k["vx"]) - 90) < 1e-9, f"lajunya tidak boleh berubah, sekarang: {k[\'vx\']}"',
          },
          {
            name: { en: 'And so does the right one', id: 'Begitu juga dinding kanan' },
            assert:
              'k = perbarui({"x": 310.0, "y": 100.0, "vx": 90.0, "vy": 0.0}, set(), 0.1)\n' +
              'assert abs(k["x"] - 312) < 1e-9, f"harus berhenti tepat di 312, sekarang: {k[\'x\']}"\n' +
              'assert k["vx"] < 0, f"vx harus jadi negatif, sekarang: {k[\'vx\']}"',
          },
          {
            name: { en: 'The top and the bottom too', id: 'Atas dan bawahnya juga' },
            assert:
              'k = perbarui({"x": 100.0, "y": 10.0, "vx": 0.0, "vy": -70.0}, set(), 0.1)\n' +
              'assert abs(k["y"] - 8) < 1e-9, f"atas: harus 8, sekarang: {k[\'y\']}"\n' +
              'assert k["vy"] > 0, f"vy harus jadi positif, sekarang: {k[\'vy\']}"\n' +
              'b = perbarui({"x": 100.0, "y": 230.0, "vx": 0.0, "vy": 70.0}, set(), 0.1)\n' +
              'assert abs(b["y"] - 232) < 1e-9, f"bawah: harus 232, sekarang: {b[\'y\']}"\n' +
              'assert b["vy"] < 0, f"vy harus jadi negatif, sekarang: {b[\'vy\']}"',
          },
          {
            name: { en: 'It does not get stuck shivering in a wall', id: 'Ia tidak tersangkut menggigil di dinding' },
            assert:
              '# sudah menembus dinding, tetapi bergerak keluar: jangan dibalik lagi\n' +
              'k = perbarui({"x": 5.0, "y": 100.0, "vx": 90.0, "vy": 0.0}, set(), 0.01)\n' +
              'assert k["vx"] > 0, f"sudah menjauh dari dinding, vx harus tetap positif, sekarang: {k[\'vx\']}"\n' +
              'b = perbarui({"x": 316.0, "y": 100.0, "vx": -90.0, "vy": 0.0}, set(), 0.01)\n' +
              'assert b["vx"] < 0, f"sisi kanan, hal yang sama: vx harus tetap negatif, sekarang: {b[\'vx\']}"',
          },
          {
            name: { en: 'A long run never leaves the field', id: 'Perjalanan panjang tak pernah keluar lapangan' },
            assert:
              'k = awal()\n' +
              'for _ in range(2000):\n' +
              '    k = perbarui(k, set(), 1 / 60)\n' +
              '    assert 8 - 1e-6 <= k["x"] <= 312 + 1e-6, f"x keluar lapangan: {k[\'x\']}"\n' +
              '    assert 8 - 1e-6 <= k["y"] <= 232 + 1e-6, f"y keluar lapangan: {k[\'y\']}"',
          },
          {
            name: { en: 'It draws one ball, where the state says', id: 'Ia menggambar satu bola, di tempat yang disebut keadaannya' },
            assert:
              'a = gambar({"x": 123.0, "y": 45.0, "vx": 0.0, "vy": 0.0})\n' +
              'assert len(a) == 1, f"harus satu perintah, sekarang: {len(a)}"\n' +
              'assert a[0]["bentuk"] == "lingkaran", f\'harus "lingkaran", sekarang: {a[0].get("bentuk")}\'\n' +
              'assert a[0]["x"] == 123 and a[0]["y"] == 45, "lingkarannya harus mengikuti keadaannya"\n' +
              'assert a[0]["r"] == 8, f"jari-jarinya harus 8, sekarang: {a[0].get(\'r\')}"\n' +
              'assert a[0]["warna"] == "#ef8f70", f\'warnanya harus "#ef8f70", sekarang: {a[0].get("warna")}\'',
          },
          {
            name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
            assert:
              'k = {"x": 10.0, "y": 100.0, "vx": -90.0, "vy": 0.0}\n' +
              'salinan = dict(k)\n' +
              'perbarui(k, set(), 0.1)\n' +
              'assert k == salinan, f"perbarui tidak boleh mengubah keadaan yang diberikan, sekarang jadi: {k}"',
          },
        ],
        hints: [
          { en: 'The starter already moves. All that is missing is what happens at the edges.', id: 'Kode awalnya sudah bergerak. Yang kurang hanya apa yang terjadi di tepinya.' },
          { en: 'Move first, then look at where you ended up. Four checks, one per wall.', id: 'Bergerak dulu, lalu lihat kamu berakhir di mana. Empat pemeriksaan, satu per dinding.' },
          { en: 'Put the ball back against the wall as well as turning it: `x = JARI` when it went past the left.', id: 'Kembalikan bolanya menempel dinding sekalian membaliknya: `x = JARI` ketika ia melewati kiri.' },
          { en: 'Do not write `vx = -vx`. A ball that is still overlapping flips every frame and shivers. Choose the direction instead: `vx = abs(vx)` on the left, `vx = -abs(vx)` on the right.', id: 'Jangan menulis `vx = -vx`. Bola yang masih bertindihan akan membalik tiap bingkai dan menggigil. Pilih arahnya saja: `vx = abs(vx)` di kiri, `vx = -abs(vx)` di kanan.' },
        ],
        solution:
          'JARI = 8\n' +
          'LEBAR = 320\n' +
          'TINGGI = 240\n\n' +
          'def awal():\n' +
          '    return {"x": 60.0, "y": 60.0, "vx": 90.0, "vy": 70.0}\n\n' +
          'def perbarui(keadaan, tombol, dt):\n' +
          '    x = keadaan["x"] + keadaan["vx"] * dt\n' +
          '    y = keadaan["y"] + keadaan["vy"] * dt\n' +
          '    vx = keadaan["vx"]\n' +
          '    vy = keadaan["vy"]\n\n' +
          '    if x < JARI:\n' +
          '        x = JARI\n' +
          '        vx = abs(vx)\n' +
          '    if x > LEBAR - JARI:\n' +
          '        x = LEBAR - JARI\n' +
          '        vx = -abs(vx)\n' +
          '    if y < JARI:\n' +
          '        y = JARI\n' +
          '        vy = abs(vy)\n' +
          '    if y > TINGGI - JARI:\n' +
          '        y = TINGGI - JARI\n' +
          '        vy = -abs(vy)\n\n' +
          '    return {"x": x, "y": y, "vx": vx, "vy": vy}\n\n' +
          'def gambar(keadaan):\n' +
          '    return [\n' +
          '        {"bentuk": "lingkaran", "x": keadaan["x"], "y": keadaan["y"], "r": JARI, "warna": "#ef8f70"}\n' +
          '    ]\n',
        xp: 50,
      },
    },
    {
      id: 'gd-m1-s2',
      title: { en: 'Controls', id: 'Kendali' },
      summary: {
        en: 'Read the keyboard, and keep the player on the field.',
        id: 'Membaca papan ketik, dan menjaga pemain tetap di lapangan.',
      },
      lessons: [
        {
          id: 'gd-m1-s2-l1',
          title: { en: 'Reading the keys', id: 'Membaca tombolnya' },
          goal: { en: 'Move something with the arrow keys.', id: 'Menggerakkan sesuatu dengan tombol panah.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'tombol is the set of keys held down', id: 'tombol adalah himpunan tombol yang sedang ditekan' },
              body: {
                en: '`tombol` is a Python set containing the names of the keys held down **right now**: `"kiri"`, `"kanan"`, `"atas"`, `"bawah"`, `"spasi"`. It is not an event and not a queue — it is a snapshot. Ask it whatever you want, as many times as you want.',
                id: '`tombol` adalah set Python berisi nama tombol yang sedang ditekan **saat ini**: `"kiri"`, `"kanan"`, `"atas"`, `"bawah"`, `"spasi"`. Ia bukan peristiwa dan bukan antrean — ia potret sesaat. Tanyai ia apa pun yang kamu mau, sebanyak yang kamu mau.',
              },
              code:
                'def perbarui(keadaan, tombol, dt):\n' +
                '    x = keadaan["x"]\n' +
                '    if "kanan" in tombol:\n' +
                '        x = x + 120 * dt\n' +
                '    return {"x": x, "y": keadaan["y"]}',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Separate ifs, not elif', id: 'if terpisah, bukan elif' },
              body: {
                en: 'Two keys can be down at once — that is how you move diagonally. Write each direction as its own `if`, and pressing left and right together simply cancels out, which is what a player expects. An `elif` chain would silently pick a favourite.',
                id: 'Dua tombol bisa ditekan sekaligus — begitulah kamu bergerak menyerong. Tulis tiap arah sebagai `if`-nya sendiri, dan menekan kiri dan kanan bersamaan akan saling meniadakan, dan itulah yang diharapkan pemain. Rantai `elif` akan diam-diam memilih favorit.',
              },
              code:
                'if "kiri" in tombol:\n' +
                '    x = x - LAJU * dt\n' +
                'if "kanan" in tombol:\n' +
                '    x = x + LAJU * dt',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Up means smaller y', id: 'Atas berarti y lebih kecil' },
              body: {
                en: 'It is worth saying twice, because it will catch you anyway: `"atas"` **subtracts** from `y`. If your player runs the wrong way vertically and the right way horizontally, this is why.',
                id: 'Ini layak dikatakan dua kali, karena ia akan tetap menjebakmu: `"atas"` **mengurangi** `y`. Kalau pemainmu berlari ke arah yang salah secara tegak dan benar secara mendatar, inilah sebabnya.',
              },
              code:
                'if "atas" in tombol:\n' +
                '    y = y - LAJU * dt\n' +
                'if "bawah" in tombol:\n' +
                '    y = y + LAJU * dt',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Left and right are both held down. Where does the player go?',
                id: 'Kiri dan kanan sama-sama ditekan. Ke mana pemainnya pergi?',
              },
              code: 'if "kiri" in tombol:\n    x = x - 120 * dt\nif "kanan" in tombol:\n    x = x + 120 * dt',
              options: [
                { en: 'Nowhere — the two cancel out', id: 'Tidak ke mana-mana — keduanya saling meniadakan' },
                { en: 'Left, because that is checked first', id: 'Ke kiri, karena itu yang diperiksa duluan' },
                { en: 'Right, because that is checked last', id: 'Ke kanan, karena itu yang diperiksa terakhir' },
                { en: 'It is an error', id: 'Itu galat' },
              ],
              answer: 0,
              explain: {
                en: 'Both ifs run, so the two amounts are added and subtracted from the same number.',
                id: 'Kedua if-nya berjalan, jadi kedua jumlahnya ditambahkan dan dikurangkan dari angka yang sama.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the check for a key being held.',
                id: 'Lengkapi pemeriksaan tombol yang sedang ditekan.',
              },
              template: 'if "spasi" ___ tombol:\n    tembak = ___',
              blanks: ['in', 'True'],
              explain: {
                en: '`tombol` is a set, so `in` is how you ask whether something is in it.',
                id: '`tombol` adalah sebuah set, jadi `in` adalah cara menanyakan apakah sesuatu ada di dalamnya.',
              },
            },
            {
              kind: 'game',
              id: 'g1',
              prompt: {
                en: 'A 20 by 20 player in `#24463d`, starting at the centre of the field, moving at **120 pixels per second** in whichever directions are held. It may leave the field for now.',
                id: 'Pemain 20 kali 20 berwarna `#24463d`, mulai di tengah lapangan, bergerak **120 piksel per detik** ke arah mana pun yang sedang ditekan. Untuk sekarang ia boleh keluar lapangan.',
              },
              starter:
                'LAJU = 120\n\n' +
                'def awal():\n' +
                '    return {"x": 160.0, "y": 120.0}\n\n' +
                'def perbarui(keadaan, tombol, dt):\n' +
                '    return keadaan\n\n' +
                'def gambar(keadaan):\n' +
                '    return [\n' +
                '        {"bentuk": "kotak", "x": keadaan["x"], "y": keadaan["y"], "l": 20, "t": 20, "warna": "#24463d"}\n' +
                '    ]\n',
              tests: [
                {
                  name: { en: 'Right and left', id: 'Kanan dan kiri' },
                  assert:
                    'k = perbarui({"x": 100.0, "y": 100.0}, {"kanan"}, 0.5)\n' +
                    'assert abs(k["x"] - 160) < 1e-9, f"kanan setengah detik harus 160, sekarang: {k[\'x\']}"\n' +
                    'b = perbarui({"x": 100.0, "y": 100.0}, {"kiri"}, 0.5)\n' +
                    'assert abs(b["x"] - 40) < 1e-9, f"kiri setengah detik harus 40, sekarang: {b[\'x\']}"',
                },
                {
                  name: { en: 'Up is smaller y, down is bigger', id: 'Atas itu y lebih kecil, bawah lebih besar' },
                  assert:
                    'k = perbarui({"x": 100.0, "y": 100.0}, {"atas"}, 0.5)\n' +
                    'assert abs(k["y"] - 40) < 1e-9, f"atas harus mengurangi y menjadi 40, sekarang: {k[\'y\']}"\n' +
                    'b = perbarui({"x": 100.0, "y": 100.0}, {"bawah"}, 0.5)\n' +
                    'assert abs(b["y"] - 160) < 1e-9, f"bawah harus menambah y menjadi 160, sekarang: {b[\'y\']}"',
                },
                {
                  name: { en: 'No keys, no movement', id: 'Tanpa tombol, tanpa gerakan' },
                  assert:
                    'k = perbarui({"x": 100.0, "y": 100.0}, set(), 1.0)\n' +
                    'assert abs(k["x"] - 100) < 1e-9 and abs(k["y"] - 100) < 1e-9, f"tanpa tombol tidak boleh bergerak, sekarang: {k}"',
                },
                {
                  name: { en: 'Two keys move it diagonally', id: 'Dua tombol menggerakkannya menyerong' },
                  assert:
                    'k = perbarui({"x": 100.0, "y": 100.0}, {"kanan", "bawah"}, 0.5)\n' +
                    'assert abs(k["x"] - 160) < 1e-9 and abs(k["y"] - 160) < 1e-9, f"kanan dan bawah bersamaan harus (160, 160), sekarang: ({k[\'x\']}, {k[\'y\']})"',
                },
                {
                  name: { en: 'Opposite keys cancel', id: 'Tombol berlawanan saling meniadakan' },
                  assert:
                    'k = perbarui({"x": 100.0, "y": 100.0}, {"kiri", "kanan"}, 0.5)\n' +
                    'assert abs(k["x"] - 100) < 1e-9, f"kiri dan kanan bersamaan harus diam, sekarang: {k[\'x\']}"\n' +
                    'b = perbarui({"x": 100.0, "y": 100.0}, {"atas", "bawah"}, 0.5)\n' +
                    'assert abs(b["y"] - 100) < 1e-9, f"atas dan bawah bersamaan harus diam, sekarang: {b[\'y\']}"',
                },
                {
                  name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
                  assert:
                    'k = {"x": 100.0, "y": 100.0}\n' +
                    'salinan = dict(k)\n' +
                    'perbarui(k, {"kanan"}, 0.25)\n' +
                    'assert k == salinan, f"perbarui tidak boleh mengubah keadaan yang diberikan, sekarang jadi: {k}"',
                },
              ],
              hints: [
                { en: 'Read `x` and `y` out first, change them, then build the new dictionary at the end.', id: 'Baca `x` dan `y` dulu, ubah keduanya, lalu bangun dictionary barunya di akhir.' },
                { en: 'Four separate `if` statements, one per direction.', id: 'Empat pernyataan `if` terpisah, satu per arah.' },
                { en: 'Each one moves `LAJU * dt`, and `"atas"` subtracts.', id: 'Masing-masing bergerak `LAJU * dt`, dan `"atas"` mengurangi.' },
              ],
              solution:
                'LAJU = 120\n\n' +
                'def awal():\n' +
                '    return {"x": 160.0, "y": 120.0}\n\n' +
                'def perbarui(keadaan, tombol, dt):\n' +
                '    x = keadaan["x"]\n' +
                '    y = keadaan["y"]\n\n' +
                '    if "kiri" in tombol:\n' +
                '        x = x - LAJU * dt\n' +
                '    if "kanan" in tombol:\n' +
                '        x = x + LAJU * dt\n' +
                '    if "atas" in tombol:\n' +
                '        y = y - LAJU * dt\n' +
                '    if "bawah" in tombol:\n' +
                '        y = y + LAJU * dt\n\n' +
                '    return {"x": x, "y": y}\n\n' +
                'def gambar(keadaan):\n' +
                '    return [\n' +
                '        {"bentuk": "kotak", "x": keadaan["x"], "y": keadaan["y"], "l": 20, "t": 20, "warna": "#24463d"}\n' +
                '    ]\n',
            },
          ],
        },
        {
          id: 'gd-m1-s2-l2',
          title: { en: 'Staying on the field', id: 'Tetap di lapangan' },
          goal: { en: 'Clamp a position between two limits.', id: 'Menjepit posisi di antara dua batas.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'min and max, together, are a clamp', id: 'min dan max, bersamaan, adalah penjepit' },
              body: {
                en: '`max(0, x)` refuses to go below zero. `min(300, x)` refuses to go above three hundred. Put them together and the value is pinned inside a range: `max(0, min(300, x))`. Two built-in functions and no `if` in sight.',
                id: '`max(0, x)` menolak turun di bawah nol. `min(300, x)` menolak naik di atas tiga ratus. Satukan keduanya dan nilainya terpaku di dalam sebuah rentang: `max(0, min(300, x))`. Dua fungsi bawaan dan tanpa `if` sama sekali.',
              },
              code: {
                en: 'x = max(0, min(300, x))\n\n# the same thing, written out long\nif x < 0:\n    x = 0\nif x > 300:\n    x = 300',
                id: 'x = max(0, min(300, x))\n\n# yang sama, ditulis panjang\nif x < 0:\n    x = 0\nif x > 300:\n    x = 300',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The limit depends on the size', id: 'Batasnya bergantung pada ukurannya' },
              body: {
                en: 'A square 20 wide drawn at `x` covers from `x` to `x + 20`. So the rightmost place it fits is `320 - 20`, not `320`. Getting this wrong is why a player can half-disappear off the edge — a very common bug, and a very obvious one once you know to look.',
                id: 'Kotak selebar 20 yang digambar di `x` menutupi dari `x` sampai `x + 20`. Jadi tempat paling kanan ia masih muat adalah `320 - 20`, bukan `320`. Salah di sini adalah sebabnya pemain bisa separuh lenyap di tepi — kutu yang sangat umum, dan sangat kentara begitu kamu tahu harus mencarinya.',
              },
              code:
                'SISI = 20\n' +
                'x = max(0, min(320 - SISI, x))\n' +
                'y = max(0, min(240 - SISI, y))',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Clamp last', id: 'Jepit paling akhir' },
              body: {
                en: 'Move first, then clamp. Clamping before the move would let the very next line push the player straight back out again, and the limit would do nothing at all. The order inside an update is not decoration.',
                id: 'Bergerak dulu, baru jepit. Menjepit sebelum bergerak akan membiarkan baris berikutnya mendorong pemainnya keluar lagi, dan batasnya jadi tak berguna sama sekali. Urutan di dalam sebuah pembaruan bukan hiasan.',
              },
              code: {
                en:
                  'if "kanan" in tombol:\n' +
                  '    x = x + LAJU * dt\n' +
                  '# ...all movement happens first...\n' +
                  'x = max(0, min(320 - SISI, x))',
                id:
                  'if "kanan" in tombol:\n' +
                  '    x = x + LAJU * dt\n' +
                  '# ...semua gerakan lebih dulu...\n' +
                  'x = max(0, min(320 - SISI, x))',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A 20-wide square is clamped with `min(320, x)`. What goes wrong?',
                id: 'Kotak selebar 20 dijepit dengan `min(320, x)`. Apa yang keliru?',
              },
              options: [
                { en: 'It can sit at x = 320, entirely off the right edge', id: 'Ia bisa berada di x = 320, sepenuhnya di luar tepi kanan' },
                { en: 'Nothing — 320 is the width', id: 'Tidak apa-apa — 320 adalah lebarnya' },
                { en: 'It can never reach the right edge', id: 'Ia tak akan pernah mencapai tepi kanan' },
                { en: 'min cannot take two arguments', id: 'min tak bisa menerima dua argumen' },
              ],
              answer: 0,
              explain: {
                en: 'The position is the left edge of the square, so the last place it fits is 320 minus its width.',
                id: 'Posisinya adalah tepi kiri kotaknya, jadi tempat terakhir ia muat adalah 320 dikurangi lebarnya.',
              },
            },
            {
              kind: 'game',
              id: 'g1',
              prompt: {
                en: 'The same player as before — 20 by 20, 120 pixels per second — but now it cannot leave the field. Nothing of it may go past any edge.',
                id: 'Pemain yang sama seperti tadi — 20 kali 20, 120 piksel per detik — tetapi kini ia tak bisa keluar lapangan. Tak ada bagiannya yang boleh melewati tepi mana pun.',
              },
              starter:
                'LAJU = 120\n' +
                'SISI = 20\n\n' +
                'def awal():\n' +
                '    return {"x": 160.0, "y": 120.0}\n\n' +
                'def perbarui(keadaan, tombol, dt):\n' +
                '    x = keadaan["x"]\n' +
                '    y = keadaan["y"]\n\n' +
                '    if "kiri" in tombol:\n' +
                '        x = x - LAJU * dt\n' +
                '    if "kanan" in tombol:\n' +
                '        x = x + LAJU * dt\n' +
                '    if "atas" in tombol:\n' +
                '        y = y - LAJU * dt\n' +
                '    if "bawah" in tombol:\n' +
                '        y = y + LAJU * dt\n\n' +
                '    return {"x": x, "y": y}\n\n' +
                'def gambar(keadaan):\n' +
                '    return [\n' +
                '        {"bentuk": "kotak", "x": keadaan["x"], "y": keadaan["y"], "l": SISI, "t": SISI, "warna": "#24463d"}\n' +
                '    ]\n',
              tests: [
                {
                  name: { en: 'It stops at the left edge, exactly', id: 'Ia berhenti tepat di tepi kiri' },
                  assert:
                    'k = perbarui({"x": 5.0, "y": 100.0}, {"kiri"}, 1.0)\n' +
                    'assert abs(k["x"] - 0) < 1e-9, f"harus berhenti tepat di 0, sekarang: {k[\'x\']}"',
                },
                {
                  name: { en: 'And at the right, allowing for its width', id: 'Dan di kanan, dengan memperhitungkan lebarnya' },
                  assert:
                    'k = perbarui({"x": 290.0, "y": 100.0}, {"kanan"}, 1.0)\n' +
                    'assert abs(k["x"] - 300) < 1e-9, f"harus berhenti di 320 - 20 = 300, sekarang: {k[\'x\']}"',
                },
                {
                  name: { en: 'Top and bottom as well', id: 'Atas dan bawah juga' },
                  assert:
                    'k = perbarui({"x": 100.0, "y": 5.0}, {"atas"}, 1.0)\n' +
                    'assert abs(k["y"] - 0) < 1e-9, f"atas harus berhenti di 0, sekarang: {k[\'y\']}"\n' +
                    'b = perbarui({"x": 100.0, "y": 210.0}, {"bawah"}, 1.0)\n' +
                    'assert abs(b["y"] - 220) < 1e-9, f"bawah harus berhenti di 240 - 20 = 220, sekarang: {b[\'y\']}"',
                },
                {
                  name: { en: 'In open field it still moves normally', id: 'Di lapangan terbuka ia tetap bergerak biasa' },
                  assert:
                    'k = perbarui({"x": 100.0, "y": 100.0}, {"kanan"}, 0.5)\n' +
                    'assert abs(k["x"] - 160) < 1e-9, f"jauh dari tepi harus bergerak penuh, sekarang: {k[\'x\']}"',
                },
                {
                  name: { en: 'Held against a wall it stays put', id: 'Ditahan di dinding ia tetap diam' },
                  assert:
                    'k = {"x": 0.0, "y": 0.0}\n' +
                    'for _ in range(30):\n' +
                    '    k = perbarui(k, {"kiri", "atas"}, 1 / 60)\n' +
                    'assert abs(k["x"]) < 1e-9 and abs(k["y"]) < 1e-9, f"menekan ke sudut harus tetap di (0, 0), sekarang: {k}"',
                },
                {
                  name: { en: 'It never escapes, whatever is pressed', id: 'Ia tak pernah lolos, apa pun yang ditekan' },
                  assert:
                    'import random\n' +
                    'random.seed(7)\n' +
                    'arah = ["kiri", "kanan", "atas", "bawah"]\n' +
                    'k = awal()\n' +
                    'for _ in range(500):\n' +
                    '    ditekan = set(random.sample(arah, random.randint(0, 3)))\n' +
                    '    k = perbarui(k, ditekan, 0.2)\n' +
                    '    assert -1e-6 <= k["x"] <= 300 + 1e-6, f"x keluar lapangan: {k[\'x\']}"\n' +
                    '    assert -1e-6 <= k["y"] <= 220 + 1e-6, f"y keluar lapangan: {k[\'y\']}"',
                },
              ],
              hints: [
                { en: 'Two lines, added after all the movement and before the return.', id: 'Dua baris, ditambahkan setelah semua gerakannya dan sebelum return.' },
                { en: 'The upper limit is the field minus the player: `320 - SISI`.', id: 'Batas atasnya adalah lapangan dikurangi pemainnya: `320 - SISI`.' },
                { en: 'x = max(0, min(320 - SISI, x))', id: 'x = max(0, min(320 - SISI, x))' },
              ],
              solution:
                'LAJU = 120\n' +
                'SISI = 20\n' +
                'LEBAR = 320\n' +
                'TINGGI = 240\n\n' +
                'def awal():\n' +
                '    return {"x": 160.0, "y": 120.0}\n\n' +
                'def perbarui(keadaan, tombol, dt):\n' +
                '    x = keadaan["x"]\n' +
                '    y = keadaan["y"]\n\n' +
                '    if "kiri" in tombol:\n' +
                '        x = x - LAJU * dt\n' +
                '    if "kanan" in tombol:\n' +
                '        x = x + LAJU * dt\n' +
                '    if "atas" in tombol:\n' +
                '        y = y - LAJU * dt\n' +
                '    if "bawah" in tombol:\n' +
                '        y = y + LAJU * dt\n\n' +
                '    x = max(0, min(LEBAR - SISI, x))\n' +
                '    y = max(0, min(TINGGI - SISI, y))\n\n' +
                '    return {"x": x, "y": y}\n\n' +
                'def gambar(keadaan):\n' +
                '    return [\n' +
                '        {"bentuk": "kotak", "x": keadaan["x"], "y": keadaan["y"], "l": SISI, "t": SISI, "warna": "#24463d"}\n' +
                '    ]\n',
            },
          ],
        },
      ],
      project: {
        id: 'gd-m1-s2-p1',
        runtime: 'game',
        title: { en: 'The Drifting Ship', id: 'Kapal Melayang' },
        brief: {
          en: 'A ship that does not stop the moment you let go. Momentum turns four `if` statements into something that feels like flying.',
          id: 'Kapal yang tidak berhenti begitu kamu melepas tombolnya. Momentum mengubah empat pernyataan `if` menjadi sesuatu yang terasa seperti terbang.',
        },
        requirements: [
          { en: '`awal()` returns `{"x": 160.0, "y": 120.0, "vx": 0.0, "vy": 0.0}`.', id: '`awal()` mengembalikan `{"x": 160.0, "y": 120.0, "vx": 0.0, "vy": 0.0}`.' },
          { en: 'Do these four things **in this order**: accelerate, apply drag, move, clamp.', id: 'Lakukan keempat hal ini **dalam urutan ini**: percepat, terapkan hambatan, gerakkan, jepit.' },
          { en: 'A held key adds `400 * dt` to that velocity — left and up are negative.', id: 'Tombol yang ditekan menambahkan `400 * dt` pada kecepatan itu — kiri dan atas bernilai negatif.' },
          { en: 'Drag: each velocity loses `v * 4 * dt` — that is `v = v - v * 4 * dt`.', id: 'Hambatan: tiap kecepatan kehilangan `v * 4 * dt` — yaitu `v = v - v * 4 * dt`.' },
          { en: 'The ship is 16 by 16 and stays inside the 320 by 240 field.', id: 'Kapalnya 16 kali 16 dan tetap di dalam lapangan 320 kali 240.' },
          { en: 'When it hits a wall the matching velocity becomes 0, so it stops rather than pressing on.', id: 'Ketika ia menabrak dinding, kecepatan yang bersangkutan menjadi 0, jadi ia berhenti alih-alih terus mendesak.' },
          { en: '`gambar` draws the ship in `#7eaa71`.', id: '`gambar` menggambar kapalnya berwarna `#7eaa71`.' },
        ],
        starter:
          'DORONG = 400\n' +
          'HAMBAT = 4\n' +
          'SISI = 16\n' +
          'LEBAR = 320\n' +
          'TINGGI = 240\n\n' +
          'def awal():\n' +
          '    return {"x": 160.0, "y": 120.0, "vx": 0.0, "vy": 0.0}\n\n' +
          'def perbarui(keadaan, tombol, dt):\n' +
          '    x = keadaan["x"]\n' +
          '    y = keadaan["y"]\n' +
          '    if "kiri" in tombol:\n' +
          '        x = x - 120 * dt\n' +
          '    if "kanan" in tombol:\n' +
          '        x = x + 120 * dt\n' +
          '    return {"x": x, "y": y, "vx": 0.0, "vy": 0.0}\n\n' +
          'def gambar(keadaan):\n' +
          '    return [\n' +
          '        {"bentuk": "kotak", "x": keadaan["x"], "y": keadaan["y"], "l": SISI, "t": SISI, "warna": "#7eaa71"}\n' +
          '    ]\n',
        tests: [
          {
            name: { en: 'It starts still, in the middle', id: 'Ia mulai diam, di tengah' },
            assert:
              'k = awal()\n' +
              'assert k["x"] == 160 and k["y"] == 120, f"harus mulai di (160, 120), sekarang: ({k[\'x\']}, {k[\'y\']})"\n' +
              'assert k["vx"] == 0 and k["vy"] == 0, f"harus mulai diam, sekarang: ({k[\'vx\']}, {k[\'vy\']})"',
          },
          {
            name: { en: 'A held key builds up speed, in order', id: 'Tombol yang ditekan membangun laju, sesuai urutan' },
            assert:
              'k = perbarui({"x": 160.0, "y": 120.0, "vx": 0.0, "vy": 0.0}, {"kanan"}, 0.1)\n' +
              '# percepat: 0 + 400*0.1 = 40; hambat: 40 - 40*4*0.1 = 24; gerak: 160 + 24*0.1 = 162.4\n' +
              'assert abs(k["vx"] - 24) < 1e-9, f"vx harus 24, sekarang: {k[\'vx\']}"\n' +
              'assert abs(k["x"] - 162.4) < 1e-9, f"x harus 162.4, sekarang: {k[\'x\']}"',
          },
          {
            name: { en: 'Up is negative here too', id: 'Atas juga bernilai negatif di sini' },
            assert:
              'k = perbarui({"x": 160.0, "y": 120.0, "vx": 0.0, "vy": 0.0}, {"atas"}, 0.1)\n' +
              'assert abs(k["vy"] + 24) < 1e-9, f"vy harus -24, sekarang: {k[\'vy\']}"\n' +
              'assert abs(k["y"] - 117.6) < 1e-9, f"y harus 117.6, sekarang: {k[\'y\']}"',
          },
          {
            name: { en: 'Letting go coasts, and slows down', id: 'Melepas tombol membuatnya meluncur, lalu melambat' },
            assert:
              'k = perbarui({"x": 100.0, "y": 100.0, "vx": 100.0, "vy": 0.0}, set(), 0.1)\n' +
              '# tanpa dorongan: 100 - 100*4*0.1 = 60; gerak: 100 + 60*0.1 = 106\n' +
              'assert abs(k["vx"] - 60) < 1e-9, f"vx harus turun ke 60, sekarang: {k[\'vx\']}"\n' +
              'assert abs(k["x"] - 106) < 1e-9, f"x harus 106, sekarang: {k[\'x\']}"',
          },
          {
            name: { en: 'It coasts to a stop rather than stopping dead', id: 'Ia meluncur sampai berhenti, bukan berhenti mendadak' },
            assert:
              'k = {"x": 100.0, "y": 100.0, "vx": 100.0, "vy": 0.0}\n' +
              'k = perbarui(k, set(), 1 / 60)\n' +
              'assert k["vx"] > 0, f"satu bingkai setelah melepas, masih harus bergerak, sekarang: {k[\'vx\']}"\n' +
              'for _ in range(600):\n' +
              '    k = perbarui(k, set(), 1 / 60)\n' +
              'assert abs(k["vx"]) < 0.01, f"setelah sepuluh detik harus praktis berhenti, sekarang: {k[\'vx\']}"',
          },
          {
            name: { en: 'Opposite keys cancel', id: 'Tombol berlawanan saling meniadakan' },
            assert:
              'k = perbarui({"x": 160.0, "y": 120.0, "vx": 0.0, "vy": 0.0}, {"kiri", "kanan"}, 0.1)\n' +
              'assert abs(k["vx"]) < 1e-9, f"kiri dan kanan bersamaan harus tetap diam, sekarang: {k[\'vx\']}"',
          },
          {
            name: { en: 'A wall stops it dead', id: 'Dinding menghentikannya' },
            assert:
              'k = perbarui({"x": 2.0, "y": 100.0, "vx": -200.0, "vy": 0.0}, set(), 0.1)\n' +
              'assert abs(k["x"]) < 1e-9, f"harus terjepit di 0, sekarang: {k[\'x\']}"\n' +
              'assert k["vx"] == 0, f"menabrak dinding harus menolkan vx, sekarang: {k[\'vx\']}"\n' +
              'b = perbarui({"x": 300.0, "y": 100.0, "vx": 200.0, "vy": 0.0}, set(), 0.1)\n' +
              'assert abs(b["x"] - 304) < 1e-9, f"harus terjepit di 320 - 16 = 304, sekarang: {b[\'x\']}"\n' +
              'assert b["vx"] == 0, f"sisi kanan juga harus menolkan vx, sekarang: {b[\'vx\']}"',
          },
          {
            name: { en: 'The other axis is untouched by that', id: 'Sumbu satunya tak tersentuh olehnya' },
            assert:
              'k = perbarui({"x": 2.0, "y": 100.0, "vx": -200.0, "vy": 50.0}, set(), 0.1)\n' +
              'assert k["vy"] != 0, f"menabrak dinding kiri tidak boleh menolkan vy, sekarang: {k[\'vy\']}"',
          },
          {
            name: { en: 'It never leaves the field', id: 'Ia tak pernah meninggalkan lapangan' },
            assert:
              'import random\n' +
              'random.seed(11)\n' +
              'arah = ["kiri", "kanan", "atas", "bawah"]\n' +
              'k = awal()\n' +
              'for _ in range(1200):\n' +
              '    ditekan = set(random.sample(arah, random.randint(0, 2)))\n' +
              '    k = perbarui(k, ditekan, 1 / 60)\n' +
              '    assert -1e-6 <= k["x"] <= 304 + 1e-6, f"x keluar lapangan: {k[\'x\']}"\n' +
              '    assert -1e-6 <= k["y"] <= 224 + 1e-6, f"y keluar lapangan: {k[\'y\']}"',
          },
          {
            name: { en: 'It draws one ship, where the state says', id: 'Ia menggambar satu kapal, di tempat yang disebut keadaannya' },
            assert:
              'a = gambar({"x": 12.0, "y": 34.0, "vx": 0.0, "vy": 0.0})\n' +
              'assert len(a) == 1, f"harus satu perintah, sekarang: {len(a)}"\n' +
              'assert a[0]["bentuk"] == "kotak" and a[0]["x"] == 12 and a[0]["y"] == 34, "kotaknya harus mengikuti keadaannya"\n' +
              'assert a[0]["l"] == 16 and a[0]["t"] == 16, f"ukurannya harus 16 kali 16, sekarang: {a[0].get(\'l\')} kali {a[0].get(\'t\')}"\n' +
              'assert a[0]["warna"] == "#7eaa71", f\'warnanya harus "#7eaa71", sekarang: {a[0].get("warna")}\'',
          },
          {
            name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
            assert:
              'k = {"x": 100.0, "y": 100.0, "vx": 10.0, "vy": -5.0}\n' +
              'salinan = dict(k)\n' +
              'perbarui(k, {"kanan"}, 0.1)\n' +
              'assert k == salinan, f"perbarui tidak boleh mengubah keadaan yang diberikan, sekarang jadi: {k}"',
          },
        ],
        hints: [
          { en: 'The starter still moves the position directly. The whole change is to move the *velocity* instead, and let the velocity move the position.', id: 'Kode awalnya masih menggerakkan posisinya langsung. Seluruh perubahannya adalah menggerakkan *kecepatannya*, lalu biarkan kecepatannya yang menggerakkan posisinya.' },
          { en: 'The four steps in order, with nothing else between them: accelerate, drag, move, clamp. Two tests check exact numbers, so the order matters.', id: 'Keempat langkahnya berurutan, tanpa apa pun di antaranya: percepat, hambat, gerak, jepit. Dua tes memeriksa angka persisnya, jadi urutannya berarti.' },
          { en: 'Drag applies whether or not a key is held — that is what makes it coast to a stop.', id: 'Hambatannya berlaku baik ada tombol ditekan maupun tidak — itulah yang membuatnya meluncur sampai berhenti.' },
          { en: 'To zero the velocity at a wall, notice you clamped: if the clamped x is different from the x you calculated, you hit something.', id: 'Untuk menolkan kecepatan di dinding, perhatikan bahwa kamu menjepit: kalau x hasil jepitan berbeda dari x yang kamu hitung, berarti kamu menabrak sesuatu.' },
        ],
        solution:
          'DORONG = 400\n' +
          'HAMBAT = 4\n' +
          'SISI = 16\n' +
          'LEBAR = 320\n' +
          'TINGGI = 240\n\n' +
          'def awal():\n' +
          '    return {"x": 160.0, "y": 120.0, "vx": 0.0, "vy": 0.0}\n\n' +
          'def perbarui(keadaan, tombol, dt):\n' +
          '    vx = keadaan["vx"]\n' +
          '    vy = keadaan["vy"]\n\n' +
          '    if "kiri" in tombol:\n' +
          '        vx = vx - DORONG * dt\n' +
          '    if "kanan" in tombol:\n' +
          '        vx = vx + DORONG * dt\n' +
          '    if "atas" in tombol:\n' +
          '        vy = vy - DORONG * dt\n' +
          '    if "bawah" in tombol:\n' +
          '        vy = vy + DORONG * dt\n\n' +
          '    vx = vx - vx * HAMBAT * dt\n' +
          '    vy = vy - vy * HAMBAT * dt\n\n' +
          '    x = keadaan["x"] + vx * dt\n' +
          '    y = keadaan["y"] + vy * dt\n\n' +
          '    terjepit_x = max(0, min(LEBAR - SISI, x))\n' +
          '    terjepit_y = max(0, min(TINGGI - SISI, y))\n' +
          '    if terjepit_x != x:\n' +
          '        vx = 0.0\n' +
          '    if terjepit_y != y:\n' +
          '        vy = 0.0\n\n' +
          '    return {"x": terjepit_x, "y": terjepit_y, "vx": vx, "vy": vy}\n\n' +
          'def gambar(keadaan):\n' +
          '    return [\n' +
          '        {"bentuk": "kotak", "x": keadaan["x"], "y": keadaan["y"], "l": SISI, "t": SISI, "warna": "#7eaa71"}\n' +
          '    ]\n',
        xp: 50,
      },
    },
  ],
}
