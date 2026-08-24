import type { Module } from '../types'

/** Module 4 — perbarui() finally does something: a held key changes one
 *  number in the state, and gambar() keeps reflecting it. Every check calls
 *  perbarui() once with a made-up tombol set and dt, and checks the single
 *  resulting state — nothing here depends on frame rate or holding a key
 *  across many calls, matching how this course's checks have worked since
 *  module 3. */
export const module4: Module = {
  id: 'pymed-m4',
  title: { en: 'Interactive Teaching Aids', id: 'Peraga Interaktif' },
  summary: {
    en: 'A key changes a value, and the picture keeps up — a fraction bar a class can step through, a line that tilts as its slope changes.',
    id: 'Tombol mengubah sebuah nilai, dan gambarnya mengikuti — batang pecahan yang bisa dilangkahi satu kelas, garis yang miring seiring kemiringannya berubah.',
  },
  submodules: [
    /* ------------------------------------------------------- 4.1 fraction bar */
    {
      id: 'pymed-m4-s1',
      title: { en: 'Fraction Visualizer', id: 'Peraga Pecahan' },
      summary: {
        en: 'One key changes the numerator, another the denominator — and a bar of coloured segments always shows exactly that fraction.',
        id: 'Satu tombol mengubah pembilang, satu lagi penyebut — dan batang berisi segmen berwarna selalu menunjukkan persis pecahan itu.',
      },
      lessons: [
        {
          id: 'pymed-m4-s1-l1',
          title: { en: 'One Key, One Change', id: 'Satu Tombol, Satu Perubahan' },
          goal: { en: 'Read tombol inside perbarui and change part of the state.', id: 'Membaca tombol di dalam perbarui dan mengubah bagian dari keadaan.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'tombol is a set of what is held right now', id: 'tombol adalah kumpulan yang sedang ditekan sekarang' },
              body: {
                en: '`tombol` holds the names of every key down at this instant — checking `"kanan" in tombol` is exactly like checking membership in any other set. When nothing relevant is held, perbarui simply hands back the state as it was.',
                id: '`tombol` menyimpan nama tiap tombol yang sedang ditekan saat ini — memeriksa `"kanan" in tombol` persis seperti memeriksa keanggotaan di set mana pun. Kalau tak ada yang relevan sedang ditekan, perbarui sekadar mengembalikan keadaannya seperti semula.',
              },
              code:
                'def perbarui(keadaan, tombol, dt):\n    if "kanan" in tombol:\n        keadaan = dict(keadaan)\n        keadaan["x"] += 1\n    return keadaan\n\nprint(perbarui({"x": 5}, {"kanan"}, 0.1))\nprint(perbarui({"x": 5}, set(), 0.1))',
              output: "{'x': 6}\n{'x': 5}",
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Keeping a value inside its bounds', id: 'Menjaga nilai tetap di dalam batasnya' },
              body: {
                en: 'A value that only ever goes up needs a ceiling. `min(nilai, batas)` never lets the result exceed `batas` — the same idea as `max(nilai, 0)` for a floor that stops it going negative.',
                id: 'Nilai yang hanya pernah bertambah butuh batas atas. `min(nilai, batas)` tak pernah membiarkan hasilnya melebihi `batas` — ide yang sama seperti `max(nilai, 0)` untuk batas bawah yang mencegahnya jadi negatif.',
              },
              code: 'nilai = 8\nbatas = 6\nprint(min(nilai, batas))\nprint(max(-3, 0))',
              output: '6\n0',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'perbarui checks "kanan" in tombol. tombol is {"kanan", "atas"} — both keys are held. What happens?',
                id: 'perbarui memeriksa "kanan" in tombol. tombol adalah {"kanan", "atas"} — kedua tombol sedang ditekan. Apa yang terjadi?',
              },
              options: [
                { en: 'The check is True, since "kanan" is one of the members', id: 'Pemeriksaannya True, karena "kanan" salah satu anggotanya' },
                { en: 'The check is False, since more than one key is held', id: 'Pemeriksaannya False, karena lebih dari satu tombol ditekan' },
                { en: 'It raises an error', id: 'Ia melempar galat' },
                { en: 'It depends on the order the keys were pressed', id: 'Bergantung urutan tombolnya ditekan' },
              ],
              answer: 0,
              explain: {
                en: '"in" only asks whether the one name is a member of the set — extra members held alongside it change nothing.',
                id: '"in" hanya bertanya apakah satu nama itu anggota dari set-nya — anggota lain yang ikut ditekan tak mengubah apa pun.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Cap nilai so it never exceeds 10.',
                id: 'Batasi nilai agar tak pernah melebihi 10.',
              },
              template: 'nilai = 14\nnilai = ___(nilai, 10)\nprint(nilai)',
              blanks: ['min'],
              explain: {
                en: 'min keeps the smaller of the two — exactly a ceiling.',
                id: 'min menjaga yang lebih kecil dari keduanya — persis sebuah batas atas.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a perbarui that increases y when "atas" is held, floored at 0.',
                id: 'Susun perbarui yang menambah y ketika "atas" ditekan, dengan batas bawah 0.',
              },
              lines: [
                'def perbarui(keadaan, tombol, dt):',
                '    if "atas" in tombol:',
                '        keadaan = dict(keadaan)',
                '        keadaan["y"] = max(0, keadaan["y"] - 1)',
                '    return keadaan',
              ],
              explain: {
                en: '"up" moves y toward 0 on this canvas — the floor still has to be checked with max.',
                id: '"atas" menggerakkan y menuju 0 pada kanvas ini — batas bawahnya tetap harus diperiksa dengan max.',
              },
            },
            {
              kind: 'game',
              id: 'k1',
              prompt: {
                en: 'The state holds `n`. Write `awal()` returning `{"n": 3}`. Write `perbarui` so that holding "kanan" adds 1 to n, capped at 10; nothing else changes n. Write `gambar` returning one teks showing `str(n)`.',
                id: 'Keadaannya menyimpan `n`. Tulis `awal()` yang mengembalikan `{"n": 3}`. Tulis `perbarui` sehingga menekan "kanan" menambah 1 ke n, dengan batas atas 10; selain itu n tak berubah. Tulis `gambar` yang mengembalikan satu teks menampilkan `str(n)`.',
              },
              starter:
                'def awal():\n    return {}\n\ndef perbarui(keadaan, tombol, dt):\n    return keadaan\n\ndef gambar(keadaan):\n    return []\n',
              tests: [
                {
                  name: { en: 'awal() starts at n=3', id: 'awal() mulai di n=3' },
                  assert: 'k = awal()\nassert k.get("n") == 3, f\'awal()["n"] harus 3, sekarang: {k.get("n")}\'',
                },
                {
                  name: { en: 'holding kanan adds 1', id: 'menekan kanan menambah 1' },
                  assert: 'k = perbarui({"n": 3}, {"kanan"}, 0.1)\nassert k.get("n") == 4, f\'n harus jadi 4, sekarang: {k.get("n")}\'',
                },
                {
                  name: { en: 'nothing held changes nothing', id: 'tak ada yang ditekan, tak ada yang berubah' },
                  assert: 'k = perbarui({"n": 3}, set(), 0.1)\nassert k.get("n") == 3, f\'n harus tetap 3, sekarang: {k.get("n")}\'',
                },
                {
                  name: { en: 'n is capped at 10', id: 'n dibatasi sampai 10' },
                  assert: 'k = perbarui({"n": 10}, {"kanan"}, 0.1)\nassert k.get("n") == 10, f\'n tak boleh melewati 10, sekarang: {k.get("n")}\'',
                },
                {
                  name: { en: 'gambar shows n as text', id: 'gambar menampilkan n sebagai teks' },
                  assert:
                    'a = gambar({"n": 7})\nassert len(a) == 1 and a[0].get("bentuk") == "teks", f"harus tepat satu perintah teks, sekarang: {a}"\nassert a[0].get("isi") == "7", f\'isi-nya harus "7", sekarang: {a[0].get("isi")}\'',
                },
              ],
              hints: [
                { en: 'keadaan["n"] = min(10, keadaan["n"] + 1) inside the "kanan" branch.', id: 'keadaan["n"] = min(10, keadaan["n"] + 1) di dalam cabang "kanan".' },
                { en: "gambar's isi must be a string: str(n), not n by itself.", id: 'isi pada gambar harus string: str(n), bukan n begitu saja.' },
              ],
              solution:
                'def awal():\n    return {"n": 3}\n\ndef perbarui(keadaan, tombol, dt):\n    if "kanan" in tombol:\n        keadaan = dict(keadaan)\n        keadaan["n"] = min(10, keadaan["n"] + 1)\n    return keadaan\n\ndef gambar(keadaan):\n    return [{"bentuk": "teks", "x": 10, "y": 10, "isi": str(keadaan["n"]), "ukuran": 12}]',
            },
          ],
        },
        {
          id: 'pymed-m4-s1-l2',
          title: { en: 'Drawing a Fraction as a Divided Bar', id: 'Menggambar Pecahan sebagai Kotak Terbagi' },
          goal: { en: 'Colour part of a bar to show a fraction.', id: 'Mewarnai sebagian batang untuk menunjukkan sebuah pecahan.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A bar, cut into equal segments', id: 'Batang, dipotong jadi segmen sama besar' },
              body: {
                en: 'penyebut segments, each 20 pixels wide, laid side by side starting at x=40 — segment `i` sits at `x = 40 + i * 20`. Whether it counts as filled depends only on whether its index is less than pembilang.',
                id: 'penyebut segmen, masing-masing lebar 20 piksel, berjajar mulai dari x=40 — segmen ke-`i` berada di `x = 40 + i * 20`. Apakah ia terisi hanya bergantung pada apakah indeksnya kurang dari pembilang.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Two colours, one loop', id: 'Dua warna, satu perulangan' },
              body: {
                en: 'The same loop draws every segment; only the colour changes, chosen by a small if/else based on the index. The result is a bar where exactly `pembilang` out of `penyebut` segments stand out.',
                id: 'Perulangan yang sama menggambar tiap segmen; hanya warnanya yang berubah, dipilih lewat if/else kecil berdasarkan indeksnya. Hasilnya batang yang tepat `pembilang` dari `penyebut` segmennya menonjol.',
              },
              code:
                'def gambar(keadaan):\n    pembilang, penyebut = keadaan["pembilang"], keadaan["penyebut"]\n    perintah = []\n    for i in range(penyebut):\n        warna = "#437649" if i < pembilang else "#e5e5e5"\n        perintah.append({"bentuk": "kotak", "x": 40 + i * 20, "y": 100, "l": 18, "t": 30, "warna": warna})\n    return perintah\n\nhasil = gambar({"pembilang": 2, "penyebut": 4})\nprint(len(hasil))\nprint([p["warna"] for p in hasil])',
              output: "4\n['#437649', '#437649', '#e5e5e5', '#e5e5e5']",
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'pembilang=0, penyebut=5. How many segments come out coloured "#437649"?',
                id: 'pembilang=0, penyebut=5. Berapa segmen yang berwarna "#437649"?',
              },
              options: [
                { en: '0', id: '0' },
                { en: '5', id: '5' },
                { en: '1', id: '1' },
                { en: 'It raises an error', id: 'Melempar galat' },
              ],
              answer: 0,
              explain: {
                en: 'i < pembilang is i < 0, which is never true for i starting at 0 — no segment qualifies.',
                id: 'i < pembilang adalah i < 0, yang tak pernah benar untuk i yang mulai dari 0 — tak ada segmen yang memenuhi.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the check deciding whether segment i is filled.',
                id: 'Lengkapi pemeriksaan yang menentukan apakah segmen i terisi.',
              },
              template: 'pembilang = 3\ni = 2\nterisi = i ___ pembilang\nprint(terisi)',
              blanks: ['<'],
              explain: {
                en: 'Segments 0, 1, and 2 are the first three — indices strictly less than pembilang.',
                id: 'Segmen 0, 1, dan 2 adalah tiga yang pertama — indeks yang secara tegas kurang dari pembilang.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a loop drawing 3 segments, the first 2 filled.',
                id: 'Susun perulangan yang menggambar 3 segmen, 2 pertama terisi.',
              },
              lines: [
                'perintah = []',
                'for i in range(3):',
                '    warna = "#437649" if i < 2 else "#e5e5e5"',
                '    perintah.append({"bentuk": "kotak", "x": 40 + i * 20, "y": 100, "l": 18, "t": 30, "warna": warna})',
              ],
              explain: {
                en: 'The empty list has to exist before the loop can append to it, same as every other loop-building exercise so far.',
                id: 'List kosongnya harus ada sebelum perulangannya bisa menambahkan ke situ, sama seperti tiap latihan membangun-lewat-perulangan sejauh ini.',
              },
            },
            {
              kind: 'game',
              id: 'k1',
              prompt: {
                en: 'The state holds `pembilang` and `penyebut`. Write `awal()` returning `{"pembilang": 1, "penyebut": 4}`. Write `gambar` drawing `penyebut` segments exactly as the concept above. Write `perbarui` returning the state unchanged.',
                id: 'Keadaannya menyimpan `pembilang` dan `penyebut`. Tulis `awal()` yang mengembalikan `{"pembilang": 1, "penyebut": 4}`. Tulis `gambar` yang menggambar `penyebut` segmen persis seperti konsep di atas. Tulis `perbarui` yang mengembalikan keadaannya tanpa perubahan.',
              },
              starter:
                'def awal():\n    return {}\n\ndef perbarui(keadaan, tombol, dt):\n    return keadaan\n\ndef gambar(keadaan):\n    return []\n',
              tests: [
                {
                  name: { en: 'awal() starts at 1/4', id: 'awal() mulai di 1/4' },
                  assert: 'k = awal()\nassert k.get("pembilang") == 1 and k.get("penyebut") == 4, f"awal() salah: {k}"',
                },
                {
                  name: { en: 'penyebut segments come out', id: 'segmennya sejumlah penyebut' },
                  assert: 'a = gambar({"pembilang": 1, "penyebut": 4})\nassert len(a) == 4, f"harus 4 segmen, sekarang: {len(a)}"',
                },
                {
                  name: { en: 'exactly pembilang are filled', id: 'tepat pembilang yang terisi' },
                  assert:
                    'a = gambar({"pembilang": 2, "penyebut": 5})\nterisi = sum(1 for p in a if p.get("warna") == "#437649")\nassert terisi == 2, f"harus 2 segmen terisi, sekarang: {terisi}"\nassert len(a) == 5, f"harus 5 segmen total, sekarang: {len(a)}"',
                },
                {
                  name: { en: 'zero filled colours nothing', id: 'nol terisi tak mewarnai apa pun' },
                  assert:
                    'a = gambar({"pembilang": 0, "penyebut": 3})\nterisi = sum(1 for p in a if p.get("warna") == "#437649")\nassert terisi == 0, f"harus tak ada yang terisi, sekarang: {terisi}"',
                },
                {
                  name: { en: 'segments sit side by side', id: 'segmennya berjajar' },
                  assert:
                    'a = gambar({"pembilang": 1, "penyebut": 3})\nxs = sorted(p.get("x") for p in a)\nassert xs == [40, 60, 80], f"posisi segmennya salah, diharap [40, 60, 80]: {xs}"',
                },
                {
                  name: { en: 'nothing moves', id: 'tak ada yang bergerak' },
                  assert: 'k = perbarui({"pembilang": 1, "penyebut": 4}, set(), 0.2)\nassert k.get("pembilang") == 1 and k.get("penyebut") == 4, "belum ada yang bergerak di pelajaran ini"',
                },
              ],
              hints: [
                { en: 'One loop over range(penyebut), colour decided by i < pembilang.', id: 'Satu perulangan atas range(penyebut), warnanya ditentukan oleh i < pembilang.' },
              ],
              solution:
                'def awal():\n    return {"pembilang": 1, "penyebut": 4}\n\ndef perbarui(keadaan, tombol, dt):\n    return keadaan\n\ndef gambar(keadaan):\n    pembilang, penyebut = keadaan["pembilang"], keadaan["penyebut"]\n    perintah = []\n    for i in range(penyebut):\n        warna = "#437649" if i < pembilang else "#e5e5e5"\n        perintah.append({"bentuk": "kotak", "x": 40 + i * 20, "y": 100, "l": 18, "t": 30, "warna": warna})\n    return perintah',
            },
          ],
        },
      ],
      project: {
        id: 'pymed-m4-s1-p',
        title: { en: 'Interactive Fraction Visualizer', id: 'Peraga Pecahan Interaktif' },
        brief: {
          en: 'Combine both lessons: keys change pembilang and penyebut, and the divided bar always reflects the current fraction.',
          id: 'Gabungkan kedua pelajaran: tombol mengubah pembilang dan penyebut, dan batang terbaginya selalu mencerminkan pecahan saat ini.',
        },
        requirements: [
          { en: 'The state holds `pembilang` and `penyebut`. `awal()` returns `{"pembilang": 1, "penyebut": 4}`.', id: 'Keadaannya menyimpan `pembilang` dan `penyebut`. `awal()` mengembalikan `{"pembilang": 1, "penyebut": 4}`.' },
          { en: '"kanan" adds 1 to pembilang, capped at penyebut. "kiri" subtracts 1, floored at 0.', id: '"kanan" menambah 1 ke pembilang, dengan batas atas penyebut. "kiri" mengurangi 1, dengan batas bawah 0.' },
          { en: '"atas" adds 1 to penyebut, capped at 12. "bawah" subtracts 1, floored at 1.', id: '"atas" menambah 1 ke penyebut, dengan batas atas 12. "bawah" mengurangi 1, dengan batas bawah 1.' },
          { en: 'gambar draws penyebut segments, the first pembilang of them filled — the same shape as the lesson.', id: 'gambar menggambar penyebut segmen, pembilang pertama di antaranya terisi — bentuk yang sama seperti di pelajaran.' },
        ],
        starter: 'def awal():\n    return {}\n\ndef perbarui(keadaan, tombol, dt):\n    return keadaan\n\ndef gambar(keadaan):\n    return []\n',
        tests: [
          {
            name: { en: 'awal() starts at 1/4', id: 'awal() mulai di 1/4' },
            assert: 'k = awal()\nassert k.get("pembilang") == 1 and k.get("penyebut") == 4, f"awal() salah: {k}"',
          },
          {
            name: { en: 'kanan raises pembilang', id: 'kanan menaikkan pembilang' },
            assert: 'k = perbarui({"pembilang": 1, "penyebut": 4}, {"kanan"}, 0.1)\nassert k.get("pembilang") == 2 and k.get("penyebut") == 4, f"salah: {k}"',
          },
          {
            name: { en: 'pembilang is capped at penyebut', id: 'pembilang dibatasi sampai penyebut' },
            assert: 'k = perbarui({"pembilang": 4, "penyebut": 4}, {"kanan"}, 0.1)\nassert k.get("pembilang") == 4, f"pembilang tak boleh melewati penyebut, sekarang: {k.get(\'pembilang\')}"',
          },
          {
            name: { en: 'kiri lowers pembilang, floored at 0', id: 'kiri menurunkan pembilang, batas bawah 0' },
            assert:
              'k = perbarui({"pembilang": 0, "penyebut": 4}, {"kiri"}, 0.1)\nassert k.get("pembilang") == 0, f"pembilang tak boleh negatif, sekarang: {k.get(\'pembilang\')}"\nk2 = perbarui({"pembilang": 2, "penyebut": 4}, {"kiri"}, 0.1)\nassert k2.get("pembilang") == 1, f"salah: {k2}"',
          },
          {
            name: { en: 'atas raises penyebut, capped at 12', id: 'atas menaikkan penyebut, batas atas 12' },
            assert:
              'k = perbarui({"pembilang": 1, "penyebut": 4}, {"atas"}, 0.1)\nassert k.get("penyebut") == 5, f"salah: {k}"\nk2 = perbarui({"pembilang": 1, "penyebut": 12}, {"atas"}, 0.1)\nassert k2.get("penyebut") == 12, f"penyebut tak boleh melewati 12, sekarang: {k2.get(\'penyebut\')}"',
          },
          {
            name: { en: 'bawah lowers penyebut, floored at 1', id: 'bawah menurunkan penyebut, batas bawah 1' },
            assert: 'k = perbarui({"pembilang": 1, "penyebut": 1}, {"bawah"}, 0.1)\nassert k.get("penyebut") == 1, f"penyebut tak boleh di bawah 1, sekarang: {k.get(\'penyebut\')}"',
          },
          {
            name: { en: 'gambar reflects the current fraction', id: 'gambar mencerminkan pecahan saat ini' },
            assert:
              'a = gambar({"pembilang": 3, "penyebut": 5})\nassert len(a) == 5, f"harus 5 segmen, sekarang: {len(a)}"\nterisi = sum(1 for p in a if p.get("warna") == "#437649")\nassert terisi == 3, f"harus 3 segmen terisi, sekarang: {terisi}"',
          },
        ],
        hints: [
          { en: 'Four independent if-branches in perbarui, one per key — reuse min/max from the lesson for each cap.', id: 'Empat cabang if independen di perbarui, satu per tombol — pakai ulang min/max dari pelajaran untuk tiap batasnya.' },
          { en: 'gambar is exactly the loop from lesson 2, unchanged.', id: 'gambar persis perulangan dari pelajaran 2, tanpa perubahan.' },
        ],
        solution:
          'def awal():\n    return {"pembilang": 1, "penyebut": 4}\n\ndef perbarui(keadaan, tombol, dt):\n    keadaan = dict(keadaan)\n    if "kanan" in tombol:\n        keadaan["pembilang"] = min(keadaan["penyebut"], keadaan["pembilang"] + 1)\n    if "kiri" in tombol:\n        keadaan["pembilang"] = max(0, keadaan["pembilang"] - 1)\n    if "atas" in tombol:\n        keadaan["penyebut"] = min(12, keadaan["penyebut"] + 1)\n    if "bawah" in tombol:\n        keadaan["penyebut"] = max(1, keadaan["penyebut"] - 1)\n    return keadaan\n\ndef gambar(keadaan):\n    pembilang, penyebut = keadaan["pembilang"], keadaan["penyebut"]\n    perintah = []\n    for i in range(penyebut):\n        warna = "#437649" if i < pembilang else "#e5e5e5"\n        perintah.append({"bentuk": "kotak", "x": 40 + i * 20, "y": 100, "l": 18, "t": 30, "warna": warna})\n    return perintah',
        xp: 50,
      },
    },

    /* --------------------------------------------------- 4.2 linear function */
    {
      id: 'pymed-m4-s2',
      title: { en: 'Linear Function Plot', id: 'Grafik Fungsi Linear' },
      summary: {
        en: 'A handful of points, connected — and a key that tilts the whole line by changing one number.',
        id: 'Beberapa titik, dihubungkan — dan tombol yang memiringkan seluruh garisnya dengan mengubah satu angka.',
      },
      lessons: [
        {
          id: 'pymed-m4-s2-l1',
          title: { en: 'Drawing a Function as Connected Lines', id: 'Menggambar Fungsi sebagai Rangkaian Garis' },
          goal: { en: 'Convert math coordinates to screen coordinates, then connect the dots.', id: 'Mengubah koordinat matematis ke koordinat layar, lalu menghubungkan titik-titiknya.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Two coordinate systems, one formula each', id: 'Dua sistem koordinat, masing-masing satu formula' },
              body: {
                en: 'Math coordinates put (0, 0) at the centre, with y growing upward. Screen coordinates put (0, 0) at the top-left, with y growing downward. `layar_x = 160 + x * 20` and `layar_y = 120 - y * 20` convert one into the other — the minus sign is what flips y the right way.',
                id: 'Koordinat matematis menaruh (0, 0) di tengah, dengan y bertambah ke atas. Koordinat layar menaruh (0, 0) di kiri atas, dengan y bertambah ke bawah. `layar_x = 160 + x * 20` dan `layar_y = 120 - y * 20` mengubah satu ke yang lain — tanda minusnya itulah yang membalik y ke arah yang benar.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A few points, connected', id: 'Beberapa titik, dihubungkan' },
              body: {
                en: 'For `f(x) = m*x + c`, sampling just three x values and drawing a `garis` between each consecutive pair already looks like a straight line — a straight function needs no more points than that to be exact.',
                id: 'Untuk `f(x) = m*x + c`, mencuplik tiga nilai x saja dan menggambar `garis` antar tiap pasangan berurutan sudah terlihat seperti garis lurus — fungsi linear tak butuh titik lebih dari itu untuk tepat.',
              },
              code:
                'def gambar(keadaan):\n    m, c = keadaan["m"], keadaan["c"]\n    titik_x = [-3, 0, 3]\n    titik = []\n    for x in titik_x:\n        y = m * x + c\n        titik.append((160 + x * 20, 120 - y * 20))\n    perintah = []\n    for i in range(len(titik) - 1):\n        x1, y1 = titik[i]\n        x2, y2 = titik[i + 1]\n        perintah.append({"bentuk": "garis", "x1": x1, "y1": y1, "x2": x2, "y2": y2, "tebal": 2})\n    return perintah\n\nprint(gambar({"m": 1, "c": 0}))',
              output:
                "[{'bentuk': 'garis', 'x1': 100, 'y1': 180, 'x2': 160, 'y2': 120, 'tebal': 2}, {'bentuk': 'garis', 'x1': 160, 'y1': 120, 'x2': 220, 'y2': 60, 'tebal': 2}]",
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'With m=1, c=0, the point at math x=0 lands at screen (160, 120) — the exact centre. Why is that not a coincidence?',
                id: 'Dengan m=1, c=0, titik pada x matematis=0 mendarat di layar (160, 120) — tepat di tengah. Mengapa itu bukan kebetulan?',
              },
              options: [
                { en: 'f(0) = 0, and (0, 0) in math coordinates is exactly the screen\'s centre by the formula\'s design', id: 'f(0) = 0, dan (0, 0) dalam koordinat matematis persis pusat layar menurut rancangan formulanya' },
                { en: 'It only works for m=1', id: 'Hanya berlaku untuk m=1' },
                { en: 'It only works for c=0', id: 'Hanya berlaku untuk c=0' },
                { en: 'It is a coincidence', id: 'Itu memang kebetulan' },
              ],
              answer: 0,
              explain: {
                en: 'layar_x = 160 + 0*20 = 160 and layar_y = 120 - 0*20 = 120 for ANY line through the origin — the +160 and 120 in the formula are exactly what places math (0,0) at the screen\'s middle.',
                id: 'layar_x = 160 + 0*20 = 160 dan layar_y = 120 - 0*20 = 120 untuk garis MANA PUN yang melalui titik asal — +160 dan 120 pada formulanya itulah yang menaruh (0,0) matematis di tengah layar.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Convert a math y-coordinate to a screen y-coordinate.',
                id: 'Ubah koordinat y matematis ke koordinat y layar.',
              },
              template: 'y = 2\nlayar_y = 120 ___ y * 20',
              blanks: ['-'],
              explain: {
                en: 'Subtracting is what flips math\'s "up is positive" into the screen\'s "down is positive".',
                id: 'Mengurangi itulah yang membalik "atas itu positif" ala matematika menjadi "bawah itu positif" ala layar.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble the conversion of one math point (x=2, y=1) into screen coordinates.',
                id: 'Susun konversi satu titik matematis (x=2, y=1) ke koordinat layar.',
              },
              lines: ['x, y = 2, 1', 'layar_x = 160 + x * 20', 'layar_y = 120 - y * 20', 'titik = (layar_x, layar_y)'],
              explain: {
                en: 'Both coordinates have to be converted before they can be paired into one screen point.',
                id: 'Kedua koordinatnya harus dikonversi dulu sebelum bisa dipasangkan jadi satu titik layar.',
              },
            },
            {
              kind: 'game',
              id: 'k1',
              prompt: {
                en: 'The state holds `m` and `c`. Write `awal()` returning `{"m": 1, "c": 0}`. Write `gambar` drawing the two connected line segments exactly as the concept above (sampling x = -3, 0, 3). Write `perbarui` returning the state unchanged.',
                id: 'Keadaannya menyimpan `m` dan `c`. Tulis `awal()` yang mengembalikan `{"m": 1, "c": 0}`. Tulis `gambar` yang menggambar dua ruas garis tersambung persis seperti konsep di atas (mencuplik x = -3, 0, 3). Tulis `perbarui` yang mengembalikan keadaannya tanpa perubahan.',
              },
              starter:
                'def awal():\n    return {}\n\ndef perbarui(keadaan, tombol, dt):\n    return keadaan\n\ndef gambar(keadaan):\n    return []\n',
              tests: [
                {
                  name: { en: 'awal() starts at m=1, c=0', id: 'awal() mulai di m=1, c=0' },
                  assert: 'k = awal()\nassert k.get("m") == 1 and k.get("c") == 0, f"awal() salah: {k}"',
                },
                {
                  name: { en: 'exactly two line segments', id: 'tepat dua ruas garis' },
                  assert: 'a = gambar({"m": 1, "c": 0})\nassert len(a) == 2, f"harus 2 ruas garis, sekarang: {len(a)}"',
                },
                {
                  name: { en: 'passes through the screen centre for m=1, c=0', id: 'melewati pusat layar untuk m=1, c=0' },
                  assert:
                    'a = gambar({"m": 1, "c": 0})\ntitik = {(a[0]["x1"], a[0]["y1"]), (a[0]["x2"], a[0]["y2"]), (a[1]["x2"], a[1]["y2"])}\nassert (160, 120) in titik, f"garisnya harus melewati (160, 120), titik yang ada: {titik}"',
                },
                {
                  name: { en: 'a different m changes the shape', id: 'm berbeda mengubah bentuknya' },
                  assert:
                    'a = gambar({"m": 0, "c": 0})\ntitik = {(a[0]["x1"], a[0]["y1"]), (a[0]["x2"], a[0]["y2"]), (a[1]["x2"], a[1]["y2"])}\nassert (100, 120) in titik and (220, 120) in titik, f"dengan m=0 garisnya harus mendatar di y=120, titik yang ada: {titik}"',
                },
                {
                  name: { en: 'nothing moves', id: 'tak ada yang bergerak' },
                  assert: 'k = perbarui({"m": 1, "c": 0}, set(), 0.3)\nassert k.get("m") == 1 and k.get("c") == 0, "belum ada yang bergerak di pelajaran ini"',
                },
              ],
              hints: [
                { en: 'Sample titik_x = [-3, 0, 3], convert each to screen coordinates, then connect consecutive pairs.', id: 'Cuplik titik_x = [-3, 0, 3], ubah tiap satu ke koordinat layar, lalu hubungkan tiap pasangan berurutan.' },
              ],
              solution:
                'def awal():\n    return {"m": 1, "c": 0}\n\ndef perbarui(keadaan, tombol, dt):\n    return keadaan\n\ndef gambar(keadaan):\n    m, c = keadaan["m"], keadaan["c"]\n    titik_x = [-3, 0, 3]\n    titik = []\n    for x in titik_x:\n        y = m * x + c\n        titik.append((160 + x * 20, 120 - y * 20))\n    perintah = []\n    for i in range(len(titik) - 1):\n        x1, y1 = titik[i]\n        x2, y2 = titik[i + 1]\n        perintah.append({"bentuk": "garis", "x1": x1, "y1": y1, "x2": x2, "y2": y2, "tebal": 2})\n    return perintah',
            },
          ],
        },
        {
          id: 'pymed-m4-s2-l2',
          title: { en: 'Changing the Slope With a Key', id: 'Mengubah Kemiringan dengan Tombol' },
          goal: { en: 'Let kanan and kiri tilt the line.', id: 'Biarkan kanan dan kiri memiringkan garisnya.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A key changes one number in the state', id: 'Tombol mengubah satu angka di keadaan' },
              body: {
                en: 'Nothing about drawing the line has to change — only `m` does, by a fixed step, whenever "kanan" or "kiri" is held. The very same gambar() from the last lesson keeps working, because it always reads m fresh from the state.',
                id: 'Tak ada yang perlu berubah dari cara menggambar garisnya — hanya `m` yang berubah, sebesar langkah tetap, tiap kali "kanan" atau "kiri" ditekan. gambar() yang persis sama dari pelajaran lalu tetap berjalan, karena ia selalu membaca m segar dari keadaan.',
              },
              code:
                'def perbarui(keadaan, tombol, dt):\n    keadaan = dict(keadaan)\n    if "kanan" in tombol:\n        keadaan["m"] += 0.5\n    if "kiri" in tombol:\n        keadaan["m"] -= 0.5\n    return keadaan\n\nprint(perbarui({"m": 1, "c": 0}, {"kanan"}, 0.1))',
              output: "{'m': 1.5, 'c': 0}",
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Two keys, two directions, one variable', id: 'Dua tombol, dua arah, satu variabel' },
              body: {
                en: 'kanan and kiri each check independently — both can theoretically be held at once, in which case they cancel out, which is a perfectly reasonable thing for opposite keys to do.',
                id: 'kanan dan kiri masing-masing diperiksa secara independen — keduanya bisa saja ditekan bersamaan, yang membuat efeknya saling meniadakan, dan itu wajar saja untuk sepasang tombol yang berlawanan.',
              },
              code:
                'def perbarui(keadaan, tombol, dt):\n    keadaan = dict(keadaan)\n    if "kanan" in tombol:\n        keadaan["m"] += 0.5\n    if "kiri" in tombol:\n        keadaan["m"] -= 0.5\n    return keadaan\n\nprint(perbarui({"m": 2, "c": 0}, {"kanan", "kiri"}, 0.1))',
              output: "{'m': 2.0, 'c': 0}",
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'm starts at 2 and "kiri" is held for one call to perbarui. What is m afterward?',
                id: 'm mulai dari 2 dan "kiri" ditekan untuk satu pemanggilan perbarui. Berapa m setelahnya?',
              },
              options: [
                { en: '1.5', id: '1.5' },
                { en: '2.5', id: '2.5' },
                { en: '2', id: '2' },
                { en: '0', id: '0' },
              ],
              answer: 0,
              explain: {
                en: '"kiri" subtracts 0.5 — 2 minus 0.5 is 1.5.',
                id: '"kiri" mengurangi 0.5 — 2 dikurangi 0.5 adalah 1.5.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the check for the other direction.',
                id: 'Lengkapi pemeriksaan untuk arah satunya.',
              },
              template: 'keadaan = {"m": 1}\ntombol = {"kiri"}\nif ___ in tombol:\n    keadaan["m"] -= 0.5\nprint(keadaan)',
              blanks: ['"kiri"'],
              explain: {
                en: 'Decreasing is what "kiri" does, matching how it lowers x elsewhere in this course.',
                id: 'Mengurangi adalah yang dilakukan "kiri", selaras dengan bagaimana ia menurunkan x di tempat lain di kursus ini.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a perbarui that changes c instead of m, with atas/bawah.',
                id: 'Susun perbarui yang mengubah c alih-alih m, dengan atas/bawah.',
              },
              lines: [
                'def perbarui(keadaan, tombol, dt):',
                '    keadaan = dict(keadaan)',
                '    if "atas" in tombol:',
                '        keadaan["c"] += 1',
                '    if "bawah" in tombol:',
                '        keadaan["c"] -= 1',
                '    return keadaan',
              ],
              explain: {
                en: 'Same shape as the m version, with a different key pair and a different step size.',
                id: 'Bentuknya sama seperti versi m, dengan pasangan tombol dan besar langkah yang berbeda.',
              },
            },
            {
              kind: 'game',
              id: 'k1',
              prompt: {
                en: 'The state holds `m` and `c` as in the last lesson. Write `perbarui` so "kanan" adds 0.5 to m and "kiri" subtracts 0.5 — nothing else changes. Reuse `awal()` and `gambar` from the last lesson unchanged.',
                id: 'Keadaannya menyimpan `m` dan `c` seperti pada pelajaran lalu. Tulis `perbarui` sehingga "kanan" menambah 0.5 ke m dan "kiri" mengurangi 0.5 — selain itu tak berubah. Pakai ulang `awal()` dan `gambar` dari pelajaran lalu tanpa perubahan.',
              },
              starter:
                'def awal():\n    return {"m": 1, "c": 0}\n\ndef perbarui(keadaan, tombol, dt):\n    return keadaan\n\ndef gambar(keadaan):\n    m, c = keadaan["m"], keadaan["c"]\n    titik_x = [-3, 0, 3]\n    titik = []\n    for x in titik_x:\n        y = m * x + c\n        titik.append((160 + x * 20, 120 - y * 20))\n    perintah = []\n    for i in range(len(titik) - 1):\n        x1, y1 = titik[i]\n        x2, y2 = titik[i + 1]\n        perintah.append({"bentuk": "garis", "x1": x1, "y1": y1, "x2": x2, "y2": y2, "tebal": 2})\n    return perintah\n',
              tests: [
                {
                  name: { en: 'kanan raises m by 0.5', id: 'kanan menaikkan m sebesar 0.5' },
                  assert: 'k = perbarui({"m": 1, "c": 0}, {"kanan"}, 0.1)\nassert abs(k.get("m") - 1.5) < 0.0001 and k.get("c") == 0, f"salah: {k}"',
                },
                {
                  name: { en: 'kiri lowers m by 0.5', id: 'kiri menurunkan m sebesar 0.5' },
                  assert: 'k = perbarui({"m": 1, "c": 0}, {"kiri"}, 0.1)\nassert abs(k.get("m") - 0.5) < 0.0001, f"salah: {k}"',
                },
                {
                  name: { en: 'both at once cancel out', id: 'keduanya sekaligus saling meniadakan' },
                  assert: 'k = perbarui({"m": 2, "c": 0}, {"kanan", "kiri"}, 0.1)\nassert abs(k.get("m") - 2) < 0.0001, f"salah: {k}"',
                },
                {
                  name: { en: 'c is never touched by kanan/kiri', id: 'c tak pernah disentuh kanan/kiri' },
                  assert: 'k = perbarui({"m": 1, "c": 3}, {"kanan"}, 0.1)\nassert k.get("c") == 3, f"c seharusnya tak berubah, sekarang: {k.get(\'c\')}"',
                },
                {
                  name: { en: 'the line still draws correctly afterward', id: 'garisnya tetap tergambar benar sesudahnya' },
                  assert:
                    'a = gambar({"m": 0, "c": 0})\nassert len(a) == 2, f"gambar seharusnya tak berubah dari pelajaran lalu, sekarang: {len(a)}"',
                },
              ],
              hints: [
                { en: 'Two independent if-checks, exactly like the concept steps above.', id: 'Dua pemeriksaan if independen, persis seperti langkah konsep di atas.' },
              ],
              solution:
                'def awal():\n    return {"m": 1, "c": 0}\n\ndef perbarui(keadaan, tombol, dt):\n    keadaan = dict(keadaan)\n    if "kanan" in tombol:\n        keadaan["m"] += 0.5\n    if "kiri" in tombol:\n        keadaan["m"] -= 0.5\n    return keadaan\n\ndef gambar(keadaan):\n    m, c = keadaan["m"], keadaan["c"]\n    titik_x = [-3, 0, 3]\n    titik = []\n    for x in titik_x:\n        y = m * x + c\n        titik.append((160 + x * 20, 120 - y * 20))\n    perintah = []\n    for i in range(len(titik) - 1):\n        x1, y1 = titik[i]\n        x2, y2 = titik[i + 1]\n        perintah.append({"bentuk": "garis", "x1": x1, "y1": y1, "x2": x2, "y2": y2, "tebal": 2})\n    return perintah',
            },
          ],
        },
      ],
      project: {
        id: 'pymed-m4-s2-p',
        title: { en: 'Interactive Function Plot', id: 'Peraga Grafik Fungsi Interaktif' },
        brief: {
          en: 'Combine both lessons: kanan/kiri tilt the line, atas/bawah shift it, and gambar always reflects both.',
          id: 'Gabungkan kedua pelajaran: kanan/kiri memiringkan garisnya, atas/bawah menggesernya, dan gambar selalu mencerminkan keduanya.',
        },
        requirements: [
          { en: 'The state holds `m` and `c`. `awal()` returns `{"m": 1, "c": 0}`.', id: 'Keadaannya menyimpan `m` dan `c`. `awal()` mengembalikan `{"m": 1, "c": 0}`.' },
          { en: '"kanan" adds 0.5 to m, "kiri" subtracts 0.5.', id: '"kanan" menambah 0.5 ke m, "kiri" mengurangi 0.5.' },
          { en: '"atas" adds 1 to c, "bawah" subtracts 1.', id: '"atas" menambah 1 ke c, "bawah" mengurangi 1.' },
          { en: 'gambar draws the two connected line segments exactly as module 4\'s lessons (sampling x = -3, 0, 3).', id: 'gambar menggambar dua ruas garis tersambung persis seperti pelajaran modul 4 (mencuplik x = -3, 0, 3).' },
        ],
        starter:
          'def awal():\n    return {}\n\ndef perbarui(keadaan, tombol, dt):\n    return keadaan\n\ndef gambar(keadaan):\n    return []\n',
        tests: [
          {
            name: { en: 'awal() starts at m=1, c=0', id: 'awal() mulai di m=1, c=0' },
            assert: 'k = awal()\nassert k.get("m") == 1 and k.get("c") == 0, f"awal() salah: {k}"',
          },
          {
            name: { en: 'kanan raises m by 0.5', id: 'kanan menaikkan m sebesar 0.5' },
            assert: 'k = perbarui({"m": 1, "c": 0}, {"kanan"}, 0.1)\nassert abs(k.get("m") - 1.5) < 0.0001 and k.get("c") == 0, f"salah: {k}"',
          },
          {
            name: { en: 'kiri lowers m by 0.5', id: 'kiri menurunkan m sebesar 0.5' },
            assert: 'k = perbarui({"m": 1, "c": 0}, {"kiri"}, 0.1)\nassert abs(k.get("m") - 0.5) < 0.0001, f"salah: {k}"',
          },
          {
            name: { en: 'atas raises c by 1', id: 'atas menaikkan c sebesar 1' },
            assert: 'k = perbarui({"m": 1, "c": 0}, {"atas"}, 0.1)\nassert k.get("c") == 1 and abs(k.get("m") - 1) < 0.0001, f"salah: {k}"',
          },
          {
            name: { en: 'bawah lowers c by 1', id: 'bawah menurunkan c sebesar 1' },
            assert: 'k = perbarui({"m": 1, "c": 0}, {"bawah"}, 0.1)\nassert k.get("c") == -1, f"salah: {k}"',
          },
          {
            name: { en: 'm and c change independently, together', id: 'm dan c berubah independen, sekaligus' },
            assert:
              'k = perbarui({"m": 1, "c": 0}, {"kanan", "atas"}, 0.1)\nassert abs(k.get("m") - 1.5) < 0.0001 and k.get("c") == 1, f"salah: {k}"',
          },
          {
            name: { en: 'gambar reflects a shifted, tilted line', id: 'gambar mencerminkan garis yang bergeser dan miring' },
            assert:
              'a = gambar({"m": 0, "c": 2})\nassert len(a) == 2, f"harus 2 ruas garis, sekarang: {len(a)}"\ntitik = {(a[0]["x1"], a[0]["y1"]), (a[0]["x2"], a[0]["y2"]), (a[1]["x2"], a[1]["y2"])}\nassert (160, 80) in titik, f"dengan m=0, c=2, garisnya harus melewati (160, 80), titik yang ada: {titik}"',
          },
        ],
        hints: [
          { en: 'Four independent if-checks in perbarui — two for m, two for c.', id: 'Empat pemeriksaan if independen di perbarui — dua untuk m, dua untuk c.' },
          { en: 'gambar is unchanged from the lessons — it already reads both m and c from the state.', id: 'gambar tak berubah dari pelajaran — ia sudah membaca m maupun c dari keadaan.' },
        ],
        solution:
          'def awal():\n    return {"m": 1, "c": 0}\n\ndef perbarui(keadaan, tombol, dt):\n    keadaan = dict(keadaan)\n    if "kanan" in tombol:\n        keadaan["m"] += 0.5\n    if "kiri" in tombol:\n        keadaan["m"] -= 0.5\n    if "atas" in tombol:\n        keadaan["c"] += 1\n    if "bawah" in tombol:\n        keadaan["c"] -= 1\n    return keadaan\n\ndef gambar(keadaan):\n    m, c = keadaan["m"], keadaan["c"]\n    titik_x = [-3, 0, 3]\n    titik = []\n    for x in titik_x:\n        y = m * x + c\n        titik.append((160 + x * 20, 120 - y * 20))\n    perintah = []\n    for i in range(len(titik) - 1):\n        x1, y1 = titik[i]\n        x2, y2 = titik[i + 1]\n        perintah.append({"bentuk": "garis", "x1": x1, "y1": y1, "x2": x2, "y2": y2, "tebal": 2})\n    return perintah',
        xp: 50,
      },
    },
  ],
}
