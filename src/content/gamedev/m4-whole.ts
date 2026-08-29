import type { Module } from '../types'

/** Module 4 — the closing module: an update big enough to need taking apart,
 *  the small touches that make a game feel like one, and a whole game. */

export const module4: Module = {
  id: 'gd-m4',
  title: { en: 'A Whole Game', id: 'Game Utuh' },
  summary: {
    en: 'Break a long update into named pieces, add the feedback that makes a hit land, and build the whole thing.',
    id: 'Memecah pembaruan panjang jadi bagian bernama, menambahkan umpan balik yang membuat benturan terasa, dan membangun keseluruhannya.',
  },
  submodules: [
    {
      id: 'gd-m4-s1',
      title: { en: 'Putting It Together', id: 'Menyatukannya' },
      summary: {
        en: 'Helpers that each do one thing, and the difference between working and feeling right.',
        id: 'Pembantu yang masing-masing mengerjakan satu hal, dan beda antara berfungsi dan terasa benar.',
      },
      lessons: [
        {
          id: 'gd-m4-s1-l1',
          title: { en: 'Taking the update apart', id: 'Memecah pembaruannya' },
          goal: { en: 'Split one long function into three you can test.', id: 'Memecah satu fungsi panjang jadi tiga yang bisa kamu uji.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A long update is not wrong, it is just hard to check', id: 'Pembaruan panjang tidak salah, ia hanya sulit diperiksa' },
              body: {
                en: 'By now `perbarui` does five things. It works — but to ask "does the clamping handle the right edge" you have to build a whole game state and read one number out of the answer. Split the five things into five functions and each question has a one-line answer.',
                id: 'Sampai di sini `perbarui` mengerjakan lima hal. Ia berfungsi — tetapi untuk bertanya "apakah penjepitannya menangani tepi kanan" kamu harus membangun keadaan permainan utuh lalu membaca satu angka dari jawabannya. Pecah kelima hal itu jadi lima fungsi dan tiap pertanyaan punya jawaban satu baris.',
              },
              code: {
                en:
                  'gerak_pemain(100.0, {"kanan"}, 0.5)   # 195.0\n' +
                  '# ...instead of building the whole keadaan just to look at one number',
                id:
                  'gerak_pemain(100.0, {"kanan"}, 0.5)   # 195.0\n' +
                  '# ...alih-alih membangun seluruh keadaan hanya untuk melihat satu angka',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Each helper takes what it needs, and no more', id: 'Tiap pembantu menerima yang ia butuhkan, tak lebih' },
              body: {
                en: 'The player mover needs an `x`, the keys and `dt` — not the whole state. Passing less makes the function easier to read, impossible to misuse, and trivial to call from a check. If a helper needs six things, that is a sign it is really two helpers.',
                id: 'Penggerak pemain butuh sebuah `x`, tombolnya, dan `dt` — bukan seluruh keadaan. Mengoper lebih sedikit membuat fungsinya lebih mudah dibaca, mustahil disalahgunakan, dan sepele dipanggil dari sebuah pemeriksaan. Kalau sebuah pembantu butuh enam hal, itu tanda ia sebenarnya dua pembantu.',
              },
              code:
                'def gerak_pemain(x, tombol, dt):\n' +
                '    if "kiri" in tombol:\n' +
                '        x = x - LAJU * dt\n' +
                '    if "kanan" in tombol:\n' +
                '        x = x + LAJU * dt\n' +
                '    return max(0, min(LEBAR - SISI, x))',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'A helper may answer more than one thing', id: 'Sebuah pembantu boleh menjawab lebih dari satu hal' },
              body: {
                en: 'Sorting the blocks answers two questions at once: which ones are left, and how many hit. Return both as a tuple and unpack it at the call. That is much clearer than a helper that also updates a counter it was handed — and it stays a function of its arguments, which is what makes it testable.',
                id: 'Memilah baloknya menjawab dua pertanyaan sekaligus: mana yang tersisa, dan berapa yang mengenai. Kembalikan keduanya sebagai tuple dan bongkar saat memanggilnya. Itu jauh lebih jelas daripada pembantu yang sekalian memperbarui penghitung yang dioperkan padanya — dan ia tetap fungsi dari argumennya, dan itulah yang membuatnya bisa diuji.',
              },
              code:
                'tersisa, kena, lolos = bersihkan(balok, pemain)',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why pass `x` to the mover rather than the whole state?',
                id: 'Mengapa mengoper `x` ke penggeraknya alih-alih seluruh keadaan?',
              },
              options: [
                { en: 'It cannot touch anything else, and a check can call it with one number', id: 'Ia tak bisa menyentuh apa pun yang lain, dan sebuah pemeriksaan bisa memanggilnya dengan satu angka' },
                { en: 'Dictionaries are slow', id: 'Dictionary itu lambat' },
                { en: 'Python does not allow passing dictionaries', id: 'Python tidak membolehkan mengoper dictionary' },
                { en: 'It makes no difference', id: 'Tidak ada bedanya' },
              ],
              answer: 0,
              explain: {
                en: 'A function that can only see one number can only get that one number wrong.',
                id: 'Fungsi yang hanya bisa melihat satu angka hanya bisa salah pada satu angka itu.',
              },
            },
            {
              kind: 'game',
              id: 'g1',
              prompt: {
                en: 'The game already works. Take it apart: write `gerak_pemain(x, tombol, dt)` returning the new clamped x, `jatuhkan(balok, dt)` returning a new moved list, and `bersihkan(balok, pemain)` returning `(tersisa, kena, lolos)` — then make `perbarui` call all three.',
                id: 'Gamenya sudah berfungsi. Pecah ia: tulis `gerak_pemain(x, tombol, dt)` yang mengembalikan x baru yang sudah dijepit, `jatuhkan(balok, dt)` yang mengembalikan daftar baru yang sudah bergerak, dan `bersihkan(balok, pemain)` yang mengembalikan `(tersisa, kena, lolos)` — lalu buat `perbarui` memanggil ketiganya.',
              },
              starter:
                'TITIK_X = [30, 120, 210, 280, 70, 160]\n' +
                'LAJU = 190\n' +
                'JATUH = 120\n' +
                'JEDA = 0.6\n' +
                'SISI = 16\n' +
                'BALOK = 14\n' +
                'PEMAIN_Y = 210\n' +
                'LEBAR = 320\n' +
                'TINGGI = 240\n\n' +
                'def tabrakan(a, b):\n' +
                '    return (\n' +
                '        a["x"] < b["x"] + b["l"]\n' +
                '        and a["x"] + a["l"] > b["x"]\n' +
                '        and a["y"] < b["y"] + b["t"]\n' +
                '        and a["y"] + a["t"] > b["y"]\n' +
                '    )\n\n' +
                'def gerak_pemain(x, tombol, dt):\n' +
                '    return x\n\n' +
                'def jatuhkan(balok, dt):\n' +
                '    return balok\n\n' +
                'def bersihkan(balok, pemain):\n' +
                '    return balok, 0, 0\n\n' +
                'def awal():\n' +
                '    return {"x": 152.0, "balok": [], "i": 0, "sisa": 0.0, "lolos": 0, "kena": 0}\n\n' +
                'def perbarui(keadaan, tombol, dt):\n' +
                '    x = keadaan["x"]\n' +
                '    if "kiri" in tombol:\n' +
                '        x = x - LAJU * dt\n' +
                '    if "kanan" in tombol:\n' +
                '        x = x + LAJU * dt\n' +
                '    x = max(0, min(LEBAR - SISI, x))\n\n' +
                '    pemain = {"x": x, "y": PEMAIN_Y, "l": SISI, "t": SISI}\n' +
                '    lolos = keadaan["lolos"]\n' +
                '    kena = keadaan["kena"]\n' +
                '    tersisa = []\n' +
                '    for b in keadaan["balok"]:\n' +
                '        turun = {"x": b["x"], "y": b["y"] + JATUH * dt}\n' +
                '        kotak = {"x": turun["x"], "y": turun["y"], "l": BALOK, "t": BALOK}\n' +
                '        if tabrakan(kotak, pemain):\n' +
                '            kena = kena + 1\n' +
                '        elif turun["y"] > TINGGI:\n' +
                '            lolos = lolos + 1\n' +
                '        else:\n' +
                '            tersisa.append(turun)\n\n' +
                '    i = keadaan["i"]\n' +
                '    sisa = keadaan["sisa"] - dt\n' +
                '    if sisa <= 0:\n' +
                '        tersisa = tersisa + [{"x": TITIK_X[i], "y": -float(BALOK)}]\n' +
                '        i = (i + 1) % len(TITIK_X)\n' +
                '        sisa = JEDA\n\n' +
                '    return {"x": x, "balok": tersisa, "i": i, "sisa": sisa, "lolos": lolos, "kena": kena}\n\n' +
                'def gambar(keadaan):\n' +
                '    hasil = []\n' +
                '    for b in keadaan["balok"]:\n' +
                '        hasil.append({"bentuk": "kotak", "x": b["x"], "y": b["y"], "l": BALOK, "t": BALOK, "warna": "#ef8f70"})\n' +
                '    hasil.append({"bentuk": "kotak", "x": keadaan["x"], "y": PEMAIN_Y, "l": SISI, "t": SISI, "warna": "#24463d"})\n' +
                '    hasil.append({"bentuk": "teks", "x": 8, "y": 8, "isi": "Lolos: " + str(keadaan["lolos"]) + "  Kena: " + str(keadaan["kena"]), "warna": "#24463d"})\n' +
                '    return hasil\n',
              tests: [
                {
                  name: { en: 'The mover moves', id: 'Penggeraknya menggerakkan' },
                  assert:
                    'assert abs(gerak_pemain(100.0, {"kanan"}, 0.5) - 195) < 1e-9, f"kanan setengah detik harus 195, sekarang: {gerak_pemain(100.0, {\'kanan\'}, 0.5)}"\n' +
                    'assert abs(gerak_pemain(100.0, {"kiri"}, 0.5) - 5) < 1e-9, f"kiri setengah detik harus 5, sekarang: {gerak_pemain(100.0, {\'kiri\'}, 0.5)}"\n' +
                    'assert abs(gerak_pemain(100.0, set(), 0.5) - 100) < 1e-9, "tanpa tombol tidak bergerak"',
                },
                {
                  name: { en: 'The mover clamps', id: 'Penggeraknya menjepit' },
                  assert:
                    'assert abs(gerak_pemain(10.0, {"kiri"}, 1.0)) < 1e-9, f"harus terjepit di 0, sekarang: {gerak_pemain(10.0, {\'kiri\'}, 1.0)}"\n' +
                    'assert abs(gerak_pemain(300.0, {"kanan"}, 1.0) - 304) < 1e-9, f"harus terjepit di 304, sekarang: {gerak_pemain(300.0, {\'kanan\'}, 1.0)}"',
                },
                {
                  name: { en: 'The dropper drops, without touching the old list', id: 'Penjatuhnya menjatuhkan, tanpa menyentuh daftar lama' },
                  assert:
                    'asal = [{"x": 30, "y": 0.0}, {"x": 70, "y": 100.0}]\n' +
                    'baru = jatuhkan(asal, 0.5)\n' +
                    'assert len(baru) == 2, f"harus tetap dua, sekarang: {len(baru)}"\n' +
                    'assert abs(baru[0]["y"] - 60) < 1e-9, f"harus turun 60, sekarang: {baru[0][\'y\']}"\n' +
                    'assert abs(baru[1]["y"] - 160) < 1e-9, f"yang kedua juga, sekarang: {baru[1][\'y\']}"\n' +
                    'assert baru[0]["x"] == 30, "x tidak boleh berubah"\n' +
                    'assert asal[0]["y"] == 0.0, f"daftar aslinya tidak boleh ikut bergerak, sekarang: {asal[0][\'y\']}"\n' +
                    'assert jatuhkan([], 0.5) == [], "daftar kosong tetap kosong"',
                },
                {
                  name: { en: 'The sorter finds the hits', id: 'Pemilahnya menemukan yang mengenai' },
                  assert:
                    'pemain = {"x": 152.0, "y": 210, "l": 16, "t": 16}\n' +
                    'tersisa, kena, lolos = bersihkan([{"x": 152, "y": 208.0}], pemain)\n' +
                    'assert kena == 1, f"harus satu kena, sekarang: {kena}"\n' +
                    'assert lolos == 0 and tersisa == [], "dan tidak ada sisanya"',
                },
                {
                  name: { en: 'And the ones that got away', id: 'Dan yang lolos' },
                  assert:
                    'pemain = {"x": 0.0, "y": 210, "l": 16, "t": 16}\n' +
                    'tersisa, kena, lolos = bersihkan([{"x": 300, "y": 250.0}], pemain)\n' +
                    'assert lolos == 1, f"harus satu lolos, sekarang: {lolos}"\n' +
                    'assert kena == 0 and tersisa == [], "dan tidak ada sisanya"',
                },
                {
                  name: { en: 'And leaves the rest alone', id: 'Dan membiarkan sisanya' },
                  assert:
                    'pemain = {"x": 152.0, "y": 210, "l": 16, "t": 16}\n' +
                    'balok = [{"x": 152, "y": 208.0}, {"x": 300, "y": 250.0}, {"x": 30, "y": 50.0}]\n' +
                    'tersisa, kena, lolos = bersihkan(balok, pemain)\n' +
                    'assert kena == 1 and lolos == 1, f"satu dan satu, sekarang: {kena} dan {lolos}"\n' +
                    'assert len(tersisa) == 1 and tersisa[0]["x"] == 30, f"satu masih jatuh, sekarang: {tersisa}"\n' +
                    'assert bersihkan([], pemain) == ([], 0, 0), "daftar kosong memberi nol semuanya"',
                },
                {
                  name: { en: 'And the game still plays', id: 'Dan gamenya tetap bisa dimainkan' },
                  assert:
                    'k = perbarui({"x": 152.0, "balok": [{"x": 152, "y": 205.0}], "i": 0, "sisa": 5.0, "lolos": 0, "kena": 0}, set(), 1 / 60)\n' +
                    'assert k["kena"] == 1, f"harus terhitung kena, sekarang: {k[\'kena\']}"\n' +
                    'b = perbarui({"x": 100.0, "balok": [], "i": 0, "sisa": 5.0, "lolos": 0, "kena": 0}, {"kanan"}, 0.5)\n' +
                    'assert abs(b["x"] - 195) < 1e-9, f"pemainnya harus bergerak, sekarang: {b[\'x\']}"\n' +
                    'c = awal()\n' +
                    'for _ in range(600):\n' +
                    '    c = perbarui(c, set(), 1 / 60)\n' +
                    'assert c["kena"] + c["lolos"] > 3, "sepuluh detik harus menyelesaikan beberapa balok"\n' +
                    'assert len(c["balok"]) < 12, f"dan daftarnya tetap kecil, sekarang: {len(c[\'balok\'])}"',
                },
                {
                  name: { en: 'perbarui really does use the helpers', id: 'perbarui benar-benar memakai pembantunya' },
                  assert:
                    'asli = gerak_pemain\n' +
                    'dipanggil = []\n\n' +
                    'def mata_mata(x, tombol, dt):\n' +
                    '    dipanggil.append(True)\n' +
                    '    return asli(x, tombol, dt)\n\n' +
                    'globals()["gerak_pemain"] = mata_mata\n' +
                    'try:\n' +
                    '    perbarui({"x": 100.0, "balok": [], "i": 0, "sisa": 5.0, "lolos": 0, "kena": 0}, {"kanan"}, 0.1)\n' +
                    'finally:\n' +
                    '    globals()["gerak_pemain"] = asli\n' +
                    'assert dipanggil, "perbarui harus memanggil gerak_pemain, bukan mengulang isinya"',
                },
                {
                  name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
                  assert:
                    'asal = [{"x": 30, "y": 10.0}]\n' +
                    'k = {"x": 152.0, "balok": asal, "i": 0, "sisa": 5.0, "lolos": 0, "kena": 0}\n' +
                    'perbarui(k, {"kanan"}, 0.5)\n' +
                    'assert asal[0]["y"] == 10.0, f"balok lamanya tidak boleh ikut bergerak, sekarang: {asal[0][\'y\']}"\n' +
                    'assert k["x"] == 152.0, "keadaan yang diberikan tidak boleh berubah"',
                },
              ],
              hints: [
                { en: 'Nothing new is being written. Every line you need is already inside `perbarui` — it is being moved, not invented.', id: 'Tak ada yang baru ditulis. Tiap baris yang kamu butuhkan sudah ada di dalam `perbarui` — ia dipindahkan, bukan dikarang.' },
                { en: '`jatuhkan` is one comprehension, building a new dictionary per block.', id: '`jatuhkan` adalah satu comprehension, membangun dictionary baru per balok.' },
                { en: '`bersihkan` takes blocks that have **already** fallen, so it only sorts them — it does not move anything.', id: '`bersihkan` menerima balok yang **sudah** jatuh, jadi ia hanya memilah — ia tidak menggerakkan apa pun.' },
                { en: 'Return the three with commas: `return tersisa, kena, lolos`.', id: 'Kembalikan ketiganya dengan koma: `return tersisa, kena, lolos`.' },
              ],
              solution:
                'TITIK_X = [30, 120, 210, 280, 70, 160]\n' +
                'LAJU = 190\n' +
                'JATUH = 120\n' +
                'JEDA = 0.6\n' +
                'SISI = 16\n' +
                'BALOK = 14\n' +
                'PEMAIN_Y = 210\n' +
                'LEBAR = 320\n' +
                'TINGGI = 240\n\n' +
                'def tabrakan(a, b):\n' +
                '    return (\n' +
                '        a["x"] < b["x"] + b["l"]\n' +
                '        and a["x"] + a["l"] > b["x"]\n' +
                '        and a["y"] < b["y"] + b["t"]\n' +
                '        and a["y"] + a["t"] > b["y"]\n' +
                '    )\n\n' +
                'def gerak_pemain(x, tombol, dt):\n' +
                '    if "kiri" in tombol:\n' +
                '        x = x - LAJU * dt\n' +
                '    if "kanan" in tombol:\n' +
                '        x = x + LAJU * dt\n' +
                '    return max(0, min(LEBAR - SISI, x))\n\n' +
                'def jatuhkan(balok, dt):\n' +
                '    return [{"x": b["x"], "y": b["y"] + JATUH * dt} for b in balok]\n\n' +
                'def bersihkan(balok, pemain):\n' +
                '    tersisa = []\n' +
                '    kena = 0\n' +
                '    lolos = 0\n' +
                '    for b in balok:\n' +
                '        kotak = {"x": b["x"], "y": b["y"], "l": BALOK, "t": BALOK}\n' +
                '        if tabrakan(kotak, pemain):\n' +
                '            kena = kena + 1\n' +
                '        elif b["y"] > TINGGI:\n' +
                '            lolos = lolos + 1\n' +
                '        else:\n' +
                '            tersisa.append(b)\n' +
                '    return tersisa, kena, lolos\n\n' +
                'def awal():\n' +
                '    return {"x": 152.0, "balok": [], "i": 0, "sisa": 0.0, "lolos": 0, "kena": 0}\n\n' +
                'def perbarui(keadaan, tombol, dt):\n' +
                '    x = gerak_pemain(keadaan["x"], tombol, dt)\n' +
                '    pemain = {"x": x, "y": PEMAIN_Y, "l": SISI, "t": SISI}\n\n' +
                '    tersisa, kena, lolos = bersihkan(jatuhkan(keadaan["balok"], dt), pemain)\n\n' +
                '    i = keadaan["i"]\n' +
                '    sisa = keadaan["sisa"] - dt\n' +
                '    if sisa <= 0:\n' +
                '        tersisa = tersisa + [{"x": TITIK_X[i], "y": -float(BALOK)}]\n' +
                '        i = (i + 1) % len(TITIK_X)\n' +
                '        sisa = JEDA\n\n' +
                '    return {\n' +
                '        "x": x,\n' +
                '        "balok": tersisa,\n' +
                '        "i": i,\n' +
                '        "sisa": sisa,\n' +
                '        "lolos": keadaan["lolos"] + lolos,\n' +
                '        "kena": keadaan["kena"] + kena,\n' +
                '    }\n\n' +
                'def gambar(keadaan):\n' +
                '    hasil = []\n' +
                '    for b in keadaan["balok"]:\n' +
                '        hasil.append({"bentuk": "kotak", "x": b["x"], "y": b["y"], "l": BALOK, "t": BALOK, "warna": "#ef8f70"})\n' +
                '    hasil.append({"bentuk": "kotak", "x": keadaan["x"], "y": PEMAIN_Y, "l": SISI, "t": SISI, "warna": "#24463d"})\n' +
                '    hasil.append({"bentuk": "teks", "x": 8, "y": 8, "isi": "Lolos: " + str(keadaan["lolos"]) + "  Kena: " + str(keadaan["kena"]), "warna": "#24463d"})\n' +
                '    return hasil\n',
            },
          ],
        },
        {
          id: 'gd-m4-s1-l2',
          title: { en: 'Making a hit land', id: 'Membuat benturan terasa' },
          goal: { en: 'Add feedback the player can feel.', id: 'Menambahkan umpan balik yang bisa dirasakan pemain.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A correct game can still feel broken', id: 'Game yang benar masih bisa terasa rusak' },
              body: {
                en: 'Take a life away and change nothing on screen and the player will swear it did not happen. The rule was right; the game never said so. Feedback is not decoration — it is how a player learns what the rules are, and it costs a few lines.',
                id: 'Ambil satu nyawa tanpa mengubah apa pun di layar dan pemainnya akan bersumpah itu tidak terjadi. Aturannya benar; gamenya tak pernah mengatakannya. Umpan balik bukan hiasan — ia cara pemain mempelajari aturannya, dan biayanya beberapa baris.',
              },
              code: {
                en: '# the rule is correct, and invisible\nnyawa = max(0, nyawa - 1)',
                id: '# aturannya benar, dan tak terlihat\nnyawa = max(0, nyawa - 1)',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Blinking is a timer read differently', id: 'Berkedip adalah pewaktu yang dibaca berbeda' },
              body: {
                en: 'You already have the invulnerability timer. Read its value as a stripe rather than a number — multiply, take the whole part, and ask whether it is odd — and it blinks. No new state, and the blink stops exactly when the mercy does.',
                id: 'Kamu sudah punya pewaktu kekebalannya. Baca nilainya sebagai garis alih-alih angka — kalikan, ambil bagian bulatnya, lalu tanyakan apakah ganjil — dan ia berkedip. Tanpa state baru, dan kedipnya berhenti persis ketika keringanannya berhenti.',
              },
              code: {
                en:
                  'def kedip(kebal):\n' +
                  '    return kebal > 0 and int(kebal * 10) % 2 == 1\n\n' +
                  '# 1.15 -> int(11.5) = 11 -> odd -> blinks\n' +
                  '# 1.00 -> int(10.0) = 10 -> even -> does not',
                id:
                  'def kedip(kebal):\n' +
                  '    return kebal > 0 and int(kebal * 10) % 2 == 1\n\n' +
                  '# 1.15 -> int(11.5) = 11 -> ganjil -> berkedip\n' +
                  '# 1.00 -> int(10.0) = 10 -> genap -> tidak',
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'A shake is an offset, not a moved world', id: 'Guncangan adalah pergeseran, bukan dunia yang berpindah' },
              body: {
                en: 'Do not move anything in `perbarui` to shake the screen — the positions are the truth of the game and must not lie. Keep a timer, work out an offset from it in `gambar`, and add that to every coordinate as you draw. The world stays where it is; only the picture wobbles.',
                id: 'Jangan menggerakkan apa pun di `perbarui` untuk mengguncang layar — posisinya adalah kebenaran permainannya dan tak boleh berdusta. Simpan sebuah pewaktu, hitung pergeseran darinya di `gambar`, dan tambahkan itu ke tiap koordinat saat menggambar. Dunianya tetap di tempatnya; hanya gambarnya yang bergoyang.',
              },
              code:
                'def getar(guncang):\n' +
                '    if guncang <= 0:\n' +
                '        return 0\n' +
                '    return 4 if int(guncang * 60) % 2 == 0 else -4',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why work the shake out in `gambar` rather than moving things in `perbarui`?',
                id: 'Mengapa menghitung guncangannya di `gambar` alih-alih menggerakkan benda di `perbarui`?',
              },
              options: [
                { en: 'The positions are the game — shaking them would change what collides', id: 'Posisinya adalah permainannya — mengguncangnya akan mengubah apa yang bertabrakan' },
                { en: '`perbarui` cannot do arithmetic', id: '`perbarui` tidak bisa berhitung' },
                { en: 'It is faster', id: 'Itu lebih cepat' },
                { en: 'There is no difference', id: 'Tidak ada bedanya' },
              ],
              answer: 0,
              explain: {
                en: 'Anything that is only for the player to see belongs where the seeing happens.',
                id: 'Apa pun yang hanya untuk dilihat pemain, tempatnya di tempat melihat itu terjadi.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a draw that shakes the whole picture.',
                id: 'Susun penggambaran yang mengguncang seluruh gambarnya.',
              },
              lines: [
                'def gambar(keadaan):',
                '    geser = getar(keadaan["guncang"])',
                '    hasil = []',
                '    for b in keadaan["balok"]:',
                '        hasil.append({"bentuk": "kotak", "x": b["x"] + geser, "y": b["y"], "l": BALOK, "t": BALOK, "warna": "#ef8f70"})',
                '    return hasil',
              ],
              explain: {
                en: 'Work the offset out once, then add it as you build each command.',
                id: 'Hitung pergeserannya sekali, lalu tambahkan saat kamu membangun tiap perintahnya.',
              },
            },
            {
              kind: 'game',
              id: 'g1',
              prompt: {
                en: 'Add the feel. Write `kedip(kebal)` and `getar(guncang)`, start a 0.3 second shake on every hit, count it down like the mercy timer, and make `gambar` shift everything by the offset and skip drawing the player while it is blinking.',
                id: 'Tambahkan rasanya. Tulis `kedip(kebal)` dan `getar(guncang)`, mulai guncangan 0,3 detik tiap benturan, hitung mundur seperti pewaktu keringanannya, dan buat `gambar` menggeser semuanya sebesar pergeserannya serta melewatkan penggambaran pemain selagi ia berkedip.',
              },
              starter:
                'TITIK_X = [30, 120, 210, 280, 70, 160]\n' +
                'LAJU = 190\n' +
                'JATUH = 130\n' +
                'JEDA = 0.6\n' +
                'SISI = 16\n' +
                'BALOK = 14\n' +
                'PEMAIN_Y = 210\n' +
                'KEBAL = 1.5\n' +
                'GUNCANG = 0.3\n' +
                'LEBAR = 320\n' +
                'TINGGI = 240\n\n' +
                'def tabrakan(a, b):\n' +
                '    return (\n' +
                '        a["x"] < b["x"] + b["l"]\n' +
                '        and a["x"] + a["l"] > b["x"]\n' +
                '        and a["y"] < b["y"] + b["t"]\n' +
                '        and a["y"] + a["t"] > b["y"]\n' +
                '    )\n\n' +
                'def kedip(kebal):\n' +
                '    return False\n\n' +
                'def getar(guncang):\n' +
                '    return 0\n\n' +
                'def awal():\n' +
                '    return {"x": 152.0, "balok": [], "i": 0, "sisa": 0.0, "nyawa": 3, "kebal": 0.0, "guncang": 0.0}\n\n' +
                'def perbarui(keadaan, tombol, dt):\n' +
                '    x = keadaan["x"]\n' +
                '    if "kiri" in tombol:\n' +
                '        x = x - LAJU * dt\n' +
                '    if "kanan" in tombol:\n' +
                '        x = x + LAJU * dt\n' +
                '    x = max(0, min(LEBAR - SISI, x))\n\n' +
                '    nyawa = keadaan["nyawa"]\n' +
                '    kebal = max(0.0, keadaan["kebal"] - dt)\n' +
                '    guncang = keadaan["guncang"]\n\n' +
                '    pemain = {"x": x, "y": PEMAIN_Y, "l": SISI, "t": SISI}\n' +
                '    tersisa = []\n' +
                '    for b in keadaan["balok"]:\n' +
                '        turun = {"x": b["x"], "y": b["y"] + JATUH * dt}\n' +
                '        kotak = {"x": turun["x"], "y": turun["y"], "l": BALOK, "t": BALOK}\n' +
                '        if tabrakan(kotak, pemain):\n' +
                '            if kebal <= 0:\n' +
                '                nyawa = max(0, nyawa - 1)\n' +
                '                kebal = KEBAL\n' +
                '        elif turun["y"] <= TINGGI:\n' +
                '            tersisa.append(turun)\n\n' +
                '    i = keadaan["i"]\n' +
                '    sisa = keadaan["sisa"] - dt\n' +
                '    if sisa <= 0:\n' +
                '        tersisa = tersisa + [{"x": TITIK_X[i], "y": -float(BALOK)}]\n' +
                '        i = (i + 1) % len(TITIK_X)\n' +
                '        sisa = JEDA\n\n' +
                '    return {"x": x, "balok": tersisa, "i": i, "sisa": sisa, "nyawa": nyawa, "kebal": kebal, "guncang": guncang}\n\n' +
                'def gambar(keadaan):\n' +
                '    hasil = []\n' +
                '    for b in keadaan["balok"]:\n' +
                '        hasil.append({"bentuk": "kotak", "x": b["x"], "y": b["y"], "l": BALOK, "t": BALOK, "warna": "#ef8f70"})\n' +
                '    hasil.append({"bentuk": "kotak", "x": keadaan["x"], "y": PEMAIN_Y, "l": SISI, "t": SISI, "warna": "#24463d"})\n' +
                '    hasil.append({"bentuk": "teks", "x": 8, "y": 8, "isi": "Nyawa: " + str(keadaan["nyawa"]), "warna": "#24463d"})\n' +
                '    return hasil\n',
              tests: [
                {
                  name: { en: 'The blink is off when the mercy is', id: 'Kedipnya mati ketika keringanannya mati' },
                  assert:
                    'assert kedip(0.0) is False or not kedip(0.0), "tanpa kekebalan tidak boleh berkedip"\n' +
                    'assert not kedip(-1.0), "nilai negatif juga tidak"',
                },
                {
                  name: { en: 'And it alternates while it runs', id: 'Dan ia berganti-ganti selagi berjalan' },
                  assert:
                    'assert kedip(1.15), f"1.15 harus berkedip, sekarang: {kedip(1.15)}"\n' +
                    'assert not kedip(1.05), f"1.05 tidak, sekarang: {kedip(1.05)}"\n' +
                    'assert kedip(0.35), f"0.35 harus berkedip, sekarang: {kedip(0.35)}"\n' +
                    'nyala = sum(1 for n in range(1, 15) if kedip(n / 10 + 0.05))\n' +
                    'assert 5 <= nyala <= 9, f"harus berganti-ganti kira-kira separuh waktu, sekarang: {nyala} dari 14"',
                },
                {
                  name: { en: 'A still screen does not shake', id: 'Layar yang tenang tidak berguncang' },
                  assert:
                    'assert getar(0.0) == 0, f"tanpa guncangan harus nol, sekarang: {getar(0.0)}"\n' +
                    'assert getar(-1.0) == 0, "nilai negatif juga nol"',
                },
                {
                  name: { en: 'And a shaken one moves both ways', id: 'Dan yang terguncang bergerak ke dua arah' },
                  assert:
                    'nilai = set(getar(n / 60 + 0.001) for n in range(1, 20))\n' +
                    'assert 4 in nilai and -4 in nilai, f"harus bergoyang ke kedua sisi, sekarang: {sorted(nilai)}"\n' +
                    'assert all(abs(v) == 4 for v in nilai), f"besarnya harus selalu 4, sekarang: {sorted(nilai)}"',
                },
                {
                  name: { en: 'A hit starts the shake', id: 'Benturan memulai guncangannya' },
                  assert:
                    'k = perbarui({"x": 152.0, "balok": [{"x": 152, "y": 205.0}], "i": 0, "sisa": 5.0, "nyawa": 3, "kebal": 0.0, "guncang": 0.0}, set(), 1 / 60)\n' +
                    'assert k["guncang"] > 0.2, f"guncangannya harus menyala, sekarang: {k[\'guncang\']}"\n' +
                    'assert k["nyawa"] == 2, "dan nyawanya tetap berkurang"',
                },
                {
                  name: { en: 'And it settles down', id: 'Dan ia mereda' },
                  assert:
                    'k = perbarui({"x": 0.0, "balok": [], "i": 0, "sisa": 5.0, "nyawa": 3, "kebal": 0.0, "guncang": 0.2}, set(), 0.05)\n' +
                    'assert abs(k["guncang"] - 0.15) < 1e-9, f"harus turun ke 0.15, sekarang: {k[\'guncang\']}"\n' +
                    'b = perbarui({"x": 0.0, "balok": [], "i": 0, "sisa": 5.0, "nyawa": 3, "kebal": 0.0, "guncang": 0.05}, set(), 0.5)\n' +
                    'assert b["guncang"] == 0, f"tidak boleh negatif, sekarang: {b[\'guncang\']}"',
                },
                {
                  name: { en: 'A hit while merciful does not shake again', id: 'Benturan saat kebal tidak mengguncang lagi' },
                  assert:
                    'k = perbarui({"x": 152.0, "balok": [{"x": 152, "y": 205.0}], "i": 0, "sisa": 5.0, "nyawa": 3, "kebal": 1.0, "guncang": 0.0}, set(), 1 / 60)\n' +
                    'assert k["guncang"] == 0, f"sedang kebal, tidak boleh mengguncang, sekarang: {k[\'guncang\']}"',
                },
                {
                  name: { en: 'The picture moves with the shake', id: 'Gambarnya ikut bergerak bersama guncangannya' },
                  assert:
                    'dasar = {"x": 100.0, "balok": [{"x": 50, "y": 60.0}], "i": 0, "sisa": 5.0, "nyawa": 3, "kebal": 0.0, "guncang": 0.0}\n' +
                    'tenang = gambar(dict(dasar))\n' +
                    'goyang = gambar({**dasar, "guncang": 0.25})\n' +
                    'geser = getar(0.25)\n' +
                    'kotak_tenang = [p for p in tenang if p["bentuk"] == "kotak"]\n' +
                    'kotak_goyang = [p for p in goyang if p["bentuk"] == "kotak"]\n' +
                    'assert len(kotak_tenang) == len(kotak_goyang), "jumlah kotaknya tidak boleh berubah"\n' +
                    'for a, b in zip(kotak_tenang, kotak_goyang):\n' +
                    '    assert abs((b["x"] - a["x"]) - geser) < 1e-9, f"tiap kotak harus bergeser {geser}, sekarang: {b[\'x\'] - a[\'x\']}"',
                },
                {
                  name: { en: 'The player flickers while merciful', id: 'Pemainnya berkelip selagi kebal' },
                  assert:
                    'dasar = {"x": 100.0, "balok": [], "i": 0, "sisa": 5.0, "nyawa": 3, "guncang": 0.0}\n' +
                    'ada = gambar({**dasar, "kebal": 1.05})\n' +
                    'hilang = gambar({**dasar, "kebal": 1.15})\n' +
                    'assert len([p for p in ada if p["bentuk"] == "kotak"]) == 1, "pada fase menyala pemainnya harus tergambar"\n' +
                    'assert len([p for p in hilang if p["bentuk"] == "kotak"]) == 0, "pada fase padam pemainnya harus hilang"\n' +
                    'biasa = gambar({**dasar, "kebal": 0.0})\n' +
                    'assert len([p for p in biasa if p["bentuk"] == "kotak"]) == 1, "di luar kekebalan pemainnya harus selalu tergambar"',
                },
                {
                  name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
                  assert:
                    'k = {"x": 152.0, "balok": [], "i": 0, "sisa": 5.0, "nyawa": 3, "kebal": 0.0, "guncang": 0.2}\n' +
                    'salinan = dict(k)\n' +
                    'perbarui(k, set(), 0.05)\n' +
                    'assert k == salinan, f"perbarui tidak boleh mengubah keadaan yang diberikan, sekarang jadi: {k}"',
                },
              ],
              hints: [
                { en: 'Both helpers are one or two lines, and neither needs any state of its own.', id: 'Kedua pembantunya satu atau dua baris, dan tak satu pun butuh state-nya sendiri.' },
                { en: 'The shake timer counts down exactly like `kebal` — one `max(0.0, ... - dt)`.', id: 'Pewaktu guncangannya menghitung mundur persis seperti `kebal` — satu `max(0.0, ... - dt)`.' },
                { en: 'Start it in the same branch that takes the life, so mercy silences it too.', id: 'Mulai ia di cabang yang sama dengan yang mengambil nyawanya, agar keringanannya juga membungkamnya.' },
                { en: 'In `gambar`, work `geser` out once and add it to every `x` — including the text.', id: 'Di `gambar`, hitung `geser` sekali dan tambahkan ke tiap `x` — termasuk teksnya.' },
              ],
              solution:
                'TITIK_X = [30, 120, 210, 280, 70, 160]\n' +
                'LAJU = 190\n' +
                'JATUH = 130\n' +
                'JEDA = 0.6\n' +
                'SISI = 16\n' +
                'BALOK = 14\n' +
                'PEMAIN_Y = 210\n' +
                'KEBAL = 1.5\n' +
                'GUNCANG = 0.3\n' +
                'LEBAR = 320\n' +
                'TINGGI = 240\n\n' +
                'def tabrakan(a, b):\n' +
                '    return (\n' +
                '        a["x"] < b["x"] + b["l"]\n' +
                '        and a["x"] + a["l"] > b["x"]\n' +
                '        and a["y"] < b["y"] + b["t"]\n' +
                '        and a["y"] + a["t"] > b["y"]\n' +
                '    )\n\n' +
                'def kedip(kebal):\n' +
                '    return kebal > 0 and int(kebal * 10) % 2 == 1\n\n' +
                'def getar(guncang):\n' +
                '    if guncang <= 0:\n' +
                '        return 0\n' +
                '    return 4 if int(guncang * 60) % 2 == 0 else -4\n\n' +
                'def awal():\n' +
                '    return {"x": 152.0, "balok": [], "i": 0, "sisa": 0.0, "nyawa": 3, "kebal": 0.0, "guncang": 0.0}\n\n' +
                'def perbarui(keadaan, tombol, dt):\n' +
                '    x = keadaan["x"]\n' +
                '    if "kiri" in tombol:\n' +
                '        x = x - LAJU * dt\n' +
                '    if "kanan" in tombol:\n' +
                '        x = x + LAJU * dt\n' +
                '    x = max(0, min(LEBAR - SISI, x))\n\n' +
                '    nyawa = keadaan["nyawa"]\n' +
                '    kebal = max(0.0, keadaan["kebal"] - dt)\n' +
                '    guncang = max(0.0, keadaan["guncang"] - dt)\n\n' +
                '    pemain = {"x": x, "y": PEMAIN_Y, "l": SISI, "t": SISI}\n' +
                '    tersisa = []\n' +
                '    for b in keadaan["balok"]:\n' +
                '        turun = {"x": b["x"], "y": b["y"] + JATUH * dt}\n' +
                '        kotak = {"x": turun["x"], "y": turun["y"], "l": BALOK, "t": BALOK}\n' +
                '        if tabrakan(kotak, pemain):\n' +
                '            if kebal <= 0:\n' +
                '                nyawa = max(0, nyawa - 1)\n' +
                '                kebal = KEBAL\n' +
                '                guncang = GUNCANG\n' +
                '        elif turun["y"] <= TINGGI:\n' +
                '            tersisa.append(turun)\n\n' +
                '    i = keadaan["i"]\n' +
                '    sisa = keadaan["sisa"] - dt\n' +
                '    if sisa <= 0:\n' +
                '        tersisa = tersisa + [{"x": TITIK_X[i], "y": -float(BALOK)}]\n' +
                '        i = (i + 1) % len(TITIK_X)\n' +
                '        sisa = JEDA\n\n' +
                '    return {\n' +
                '        "x": x,\n' +
                '        "balok": tersisa,\n' +
                '        "i": i,\n' +
                '        "sisa": sisa,\n' +
                '        "nyawa": nyawa,\n' +
                '        "kebal": kebal,\n' +
                '        "guncang": guncang,\n' +
                '    }\n\n' +
                'def gambar(keadaan):\n' +
                '    geser = getar(keadaan["guncang"])\n' +
                '    hasil = []\n' +
                '    for b in keadaan["balok"]:\n' +
                '        hasil.append({"bentuk": "kotak", "x": b["x"] + geser, "y": b["y"], "l": BALOK, "t": BALOK, "warna": "#ef8f70"})\n' +
                '    if not kedip(keadaan["kebal"]):\n' +
                '        hasil.append({"bentuk": "kotak", "x": keadaan["x"] + geser, "y": PEMAIN_Y, "l": SISI, "t": SISI, "warna": "#24463d"})\n' +
                '    hasil.append({"bentuk": "teks", "x": 8 + geser, "y": 8, "isi": "Nyawa: " + str(keadaan["nyawa"]), "warna": "#24463d"})\n' +
                '    return hasil\n',
            },
          ],
        },
      ],
      project: {
        id: 'gd-m4-s1-p1',
        runtime: 'game',
        title: { en: 'Harvest', id: 'Panen' },
        brief: {
          en: 'The whole course in one game. Catch the good, dodge the bad, keep three lives, climb the levels, and beat your own record.',
          id: 'Seluruh kursus dalam satu game. Tangkap yang baik, hindari yang buruk, jaga tiga nyawa, naiki tingkatnya, dan kalahkan rekormu sendiri.',
        },
        requirements: [
          { en: 'Phases `"siap"`, `"main"`, `"selesai"`. A space **press** starts a game from `"siap"`; from `"selesai"` it goes back to `"siap"`. `segar` is given to you.', id: 'Fase `"siap"`, `"main"`, `"selesai"`. **Tekanan** spasi memulai permainan dari `"siap"`; dari `"selesai"` ia kembali ke `"siap"`. `segar` sudah diberikan.' },
          { en: '`tingkat(skor)` is `1 + skor // 5`; `laju(skor)` is `120 + tingkat * 20` capped at 300; `jeda(skor)` is `0.9 - tingkat * 0.06` floored at 0.35.', id: '`tingkat(skor)` adalah `1 + skor // 5`; `laju(skor)` adalah `120 + tingkat * 20` berplafon 300; `jeda(skor)` adalah `0.9 - tingkat * 0.06` berlantai 0,35.' },
          { en: 'Items are 14 by 14 and spawn at `TITIK_X[i % len(TITIK_X)]` with `jenis` from `POLA[i % len(POLA)]`. `i` only ever counts up.', id: 'Bendanya 14 kali 14 dan muncul di `TITIK_X[i % len(TITIK_X)]` dengan `jenis` dari `POLA[i % len(POLA)]`. `i` hanya pernah bertambah.' },
          { en: 'Catching a `"baik"` scores a point. Catching a `"buruk"` costs a life, starts 1.5 seconds of mercy and a 0.3 second shake — unless mercy is already running, in which case it is only removed.', id: 'Menangkap `"baik"` menambah satu poin. Menangkap `"buruk"` berbiaya satu nyawa, memulai keringanan 1,5 detik dan guncangan 0,3 detik — kecuali keringanannya sedang berjalan, dan kalau begitu ia hanya dibuang.' },
          { en: 'Anything that reaches the bottom is simply gone. Missing costs nothing.', id: 'Apa pun yang mencapai dasar sekadar hilang. Melewatkan tidak berbiaya apa pun.' },
          { en: 'At zero lives the phase becomes `"selesai"` and `rekor` becomes the larger of `rekor` and `skor`. `rekor` survives every restart.', id: 'Saat nyawa nol, fasenya jadi `"selesai"` dan `rekor` jadi yang lebih besar antara `rekor` dan `skor`. `rekor` selamat dari tiap mulai ulang.' },
          { en: '`gambar` shifts everything by `getar(guncang)`, hides the player on the dark half of `kedip(kebal)`, and draws good items in `#f5c65b` and bad ones in `#ef8f70`.', id: '`gambar` menggeser semuanya sebesar `getar(guncang)`, menyembunyikan pemainnya pada separuh gelap `kedip(kebal)`, dan menggambar benda baik dengan `#f5c65b` serta yang buruk dengan `#ef8f70`.' },
        ],
        starter:
          'TITIK_X = [40, 160, 280, 100, 220]\n' +
          'POLA = ["baik", "baik", "buruk", "baik", "buruk", "baik"]\n' +
          'LAJU = 200\n' +
          'PAPAN_L = 56\n' +
          'PAPAN_T = 12\n' +
          'PAPAN_Y = 214\n' +
          'BENDA = 14\n' +
          'KEBAL = 1.5\n' +
          'GUNCANG = 0.3\n' +
          'LEBAR = 320\n' +
          'TINGGI = 240\n\n' +
          'def tabrakan(a, b):\n' +
          '    return (\n' +
          '        a["x"] < b["x"] + b["l"]\n' +
          '        and a["x"] + a["l"] > b["x"]\n' +
          '        and a["y"] < b["y"] + b["t"]\n' +
          '        and a["y"] + a["t"] > b["y"]\n' +
          '    )\n\n' +
          'def segar(fase, spasi_lalu, rekor):\n' +
          '    return {\n' +
          '        "fase": fase,\n' +
          '        "px": 132.0,\n' +
          '        "benda": [],\n' +
          '        "i": 0,\n' +
          '        "sisa": 0.0,\n' +
          '        "skor": 0,\n' +
          '        "nyawa": 3,\n' +
          '        "kebal": 0.0,\n' +
          '        "guncang": 0.0,\n' +
          '        "rekor": rekor,\n' +
          '        "spasi_lalu": spasi_lalu,\n' +
          '    }\n\n' +
          'def tingkat(skor):\n' +
          '    return 1\n\n' +
          'def laju(skor):\n' +
          '    return 120\n\n' +
          'def jeda(skor):\n' +
          '    return 0.9\n\n' +
          'def kedip(kebal):\n' +
          '    return False\n\n' +
          'def getar(guncang):\n' +
          '    return 0\n\n' +
          'def awal():\n' +
          '    return segar("siap", False, 0)\n\n' +
          'def perbarui(keadaan, tombol, dt):\n' +
          '    return keadaan\n\n' +
          'def gambar(keadaan):\n' +
          '    hasil = []\n' +
          '    for b in keadaan["benda"]:\n' +
          '        hasil.append({"bentuk": "kotak", "x": b["x"], "y": b["y"], "l": BENDA, "t": BENDA, "warna": "#f5c65b"})\n' +
          '    hasil.append({"bentuk": "kotak", "x": keadaan["px"], "y": PAPAN_Y, "l": PAPAN_L, "t": PAPAN_T, "warna": "#24463d"})\n' +
          '    hasil.append({"bentuk": "teks", "x": 8, "y": 8, "isi": "Skor: 0", "warna": "#24463d"})\n' +
          '    return hasil\n',
        tests: [
          {
            name: { en: 'The tuning functions are right', id: 'Fungsi penyetelnya benar' },
            assert:
              'assert tingkat(0) == 1 and tingkat(4) == 1 and tingkat(5) == 2 and tingkat(14) == 3, "rentang tingkatnya salah"\n' +
              'assert abs(laju(0) - 140) < 1e-9, f"tingkat 1 harus 140, sekarang: {laju(0)}"\n' +
              'assert abs(laju(5) - 160) < 1e-9, f"tingkat 2 harus 160, sekarang: {laju(5)}"\n' +
              'assert abs(laju(500) - 300) < 1e-9, f"harus berplafon 300, sekarang: {laju(500)}"\n' +
              'assert abs(jeda(0) - 0.84) < 1e-9, f"tingkat 1 harus 0.84, sekarang: {jeda(0)}"\n' +
              'assert abs(jeda(500) - 0.35) < 1e-9, f"harus berlantai 0.35, sekarang: {jeda(500)}"',
          },
          {
            name: { en: 'The feel helpers are right', id: 'Pembantu rasanya benar' },
            assert:
              'assert not kedip(0.0) and not kedip(-1.0), "tanpa kekebalan tidak berkedip"\n' +
              'assert kedip(1.15) and not kedip(1.05), "harus berganti-ganti selagi berjalan"\n' +
              'assert getar(0.0) == 0, "tanpa guncangan tidak bergeser"\n' +
              'nilai = set(getar(n / 60 + 0.001) for n in range(1, 20))\n' +
              'assert 4 in nilai and -4 in nilai and all(abs(v) == 4 for v in nilai), f"harus bergoyang empat ke kedua sisi, sekarang: {sorted(nilai)}"',
          },
          {
            name: { en: 'It waits, starts, and does not restart while held', id: 'Ia menunggu, mulai, dan tidak mengulang selagi ditahan' },
            assert:
              'k = awal()\n' +
              'for _ in range(60):\n' +
              '    k = perbarui(k, set(), 1 / 60)\n' +
              'assert k["fase"] == "siap" and len(k["benda"]) == 0, "tanpa tombol harus tetap menunggu"\n' +
              'k = perbarui(k, {"spasi"}, 1 / 60)\n' +
              'assert k["fase"] == "main" and k["skor"] == 0 and k["nyawa"] == 3, f"harus mulai segar, sekarang: {k[\'fase\']}"\n' +
              'for _ in range(180):\n' +
              '    k = perbarui(k, {"spasi"}, 1 / 60)\n' +
              'assert k["fase"] == "main", "menahan spasi tidak boleh mengulang"\n' +
              'assert k["i"] > 1, "dan permainannya harus benar-benar berjalan"',
          },
          {
            name: { en: 'Items spawn in the right pattern', id: 'Bendanya muncul dengan pola yang benar' },
            assert:
              'k = perbarui({**segar("main", True, 0), "sisa": 0.0, "i": 7}, set(), 0.01)\n' +
              'assert len(k["benda"]) == 1, f"harus muncul satu, sekarang: {len(k[\'benda\'])}"\n' +
              'b = k["benda"][0]\n' +
              'assert b["x"] == TITIK_X[7 % len(TITIK_X)], f"x harus dari TITIK_X, sekarang: {b[\'x\']}"\n' +
              'assert b["jenis"] == POLA[7 % len(POLA)], f"jenisnya harus dari POLA, sekarang: {b[\'jenis\']}"\n' +
              'assert abs(b["y"] + 14) < 1e-9, f"harus mulai di -14, sekarang: {b[\'y\']}"\n' +
              'assert k["i"] == 8, f"i harus terus naik, sekarang: {k[\'i\']}"',
          },
          {
            name: { en: 'Items fall at the level speed', id: 'Bendanya jatuh pada kecepatan tingkatnya' },
            assert:
              'dasar = {**segar("main", True, 0), "sisa": 5.0, "benda": [{"x": 40, "y": 0.0, "jenis": "baik"}]}\n' +
              'k = perbarui(dict(dasar), set(), 0.5)\n' +
              'assert abs(k["benda"][0]["y"] - 70) < 1e-9, f"tingkat 1 setengah detik harus 70, sekarang: {k[\'benda\'][0][\'y\']}"\n' +
              'b = perbarui({**dasar, "skor": 5}, set(), 0.5)\n' +
              'assert abs(b["benda"][0]["y"] - 80) < 1e-9, f"tingkat 2 setengah detik harus 80, sekarang: {b[\'benda\'][0][\'y\']}"',
          },
          {
            name: { en: 'Catching the good scores', id: 'Menangkap yang baik menambah skor' },
            assert:
              'k = perbarui({**segar("main", True, 0), "sisa": 5.0, "px": 132.0, "skor": 2, "benda": [{"x": 140, "y": 210.0, "jenis": "baik"}]}, set(), 1 / 60)\n' +
              'assert k["skor"] == 3, f"harus menambah skor, sekarang: {k[\'skor\']}"\n' +
              'assert k["nyawa"] == 3, "dan tidak berbiaya nyawa"\n' +
              'assert len(k["benda"]) == 0, "bendanya harus dibuang"',
          },
          {
            name: { en: 'Catching the bad hurts', id: 'Menangkap yang buruk menyakitkan' },
            assert:
              'k = perbarui({**segar("main", True, 0), "sisa": 5.0, "px": 132.0, "skor": 2, "benda": [{"x": 140, "y": 210.0, "jenis": "buruk"}]}, set(), 1 / 60)\n' +
              'assert k["nyawa"] == 2, f"harus kehilangan nyawa, sekarang: {k[\'nyawa\']}"\n' +
              'assert k["skor"] == 2, "dan tidak menambah skor"\n' +
              'assert k["kebal"] > 1.0, f"keringanannya harus menyala, sekarang: {k[\'kebal\']}"\n' +
              'assert k["guncang"] > 0.2, f"guncangannya harus menyala, sekarang: {k[\'guncang\']}"\n' +
              'assert len(k["benda"]) == 0, "bendanya harus dibuang"',
          },
          {
            name: { en: 'Mercy protects, but the item still goes', id: 'Keringanan melindungi, tapi bendanya tetap pergi' },
            assert:
              'k = perbarui({**segar("main", True, 0), "sisa": 5.0, "px": 132.0, "kebal": 1.0, "benda": [{"x": 140, "y": 210.0, "jenis": "buruk"}]}, set(), 1 / 60)\n' +
              'assert k["nyawa"] == 3, f"sedang kebal, tidak boleh berkurang, sekarang: {k[\'nyawa\']}"\n' +
              'assert k["guncang"] == 0, f"dan tidak mengguncang, sekarang: {k[\'guncang\']}"\n' +
              'assert len(k["benda"]) == 0, "bendanya tetap dibuang"',
          },
          {
            name: { en: 'Missing costs nothing', id: 'Melewatkan tidak berbiaya apa pun' },
            assert:
              'dasar = {**segar("main", True, 0), "sisa": 5.0, "px": 0.0, "skor": 4}\n' +
              'k = perbarui({**dasar, "benda": [{"x": 280, "y": 239.0, "jenis": "baik"}]}, set(), 0.5)\n' +
              'assert k["skor"] == 4 and k["nyawa"] == 3, "melewatkan yang baik tidak berbiaya"\n' +
              'assert len(k["benda"]) == 0, "tapi bendanya hilang"\n' +
              'b = perbarui({**dasar, "benda": [{"x": 280, "y": 239.0, "jenis": "buruk"}]}, set(), 0.5)\n' +
              'assert b["nyawa"] == 3, "melewatkan yang buruk justru bagus"',
          },
          {
            name: { en: 'The last life ends it, and sets the record', id: 'Nyawa terakhir mengakhirinya, dan menetapkan rekornya' },
            assert:
              'k = perbarui({**segar("main", True, 3), "sisa": 5.0, "px": 132.0, "skor": 9, "nyawa": 1, "benda": [{"x": 140, "y": 210.0, "jenis": "buruk"}]}, set(), 1 / 60)\n' +
              'assert k["nyawa"] == 0 and k["fase"] == "selesai", f"harus berakhir, sekarang: {k[\'fase\']}"\n' +
              'assert k["rekor"] == 9, f"rekornya harus naik ke 9, sekarang: {k[\'rekor\']}"\n' +
              'b = perbarui({**segar("main", True, 20), "sisa": 5.0, "px": 132.0, "skor": 2, "nyawa": 1, "benda": [{"x": 140, "y": 210.0, "jenis": "buruk"}]}, set(), 1 / 60)\n' +
              'assert b["rekor"] == 20, f"permainan lebih buruk tidak menurunkan rekor, sekarang: {b[\'rekor\']}"',
          },
          {
            name: { en: 'Finished, nothing moves; the record survives', id: 'Setelah usai, tak ada yang bergerak; rekornya bertahan' },
            assert:
              'k = {**segar("selesai", False, 11), "benda": [{"x": 40, "y": 100.0, "jenis": "baik"}], "nyawa": 0, "skor": 6}\n' +
              'b = perbarui(dict(k), {"kanan"}, 0.5)\n' +
              'assert abs(b["px"] - 132.0) < 1e-9, "papannya harus diam"\n' +
              'assert abs(b["benda"][0]["y"] - 100.0) < 1e-9, "bendanya harus diam"\n' +
              'c = perbarui(b, {"spasi"}, 1 / 60)\n' +
              'assert c["fase"] == "siap" and c["rekor"] == 11, f"harus kembali ke siap dengan rekor utuh, sekarang: {c[\'fase\']}, {c[\'rekor\']}"\n' +
              'd = perbarui(perbarui(c, set(), 1 / 60), {"spasi"}, 1 / 60)\n' +
              'assert d["fase"] == "main" and d["skor"] == 0 and d["rekor"] == 11, "permainan barunya segar, rekornya tidak"',
          },
          {
            name: { en: 'The picture shakes and flickers', id: 'Gambarnya berguncang dan berkelip' },
            assert:
              'dasar = {**segar("main", True, 0), "benda": [{"x": 40, "y": 60.0, "jenis": "baik"}]}\n' +
              'tenang = gambar(dict(dasar))\n' +
              'goyang = gambar({**dasar, "guncang": 0.25})\n' +
              'geser = getar(0.25)\n' +
              'a = [p for p in tenang if p["bentuk"] == "kotak"]\n' +
              'b = [p for p in goyang if p["bentuk"] == "kotak"]\n' +
              'assert len(a) == len(b) and len(a) == 2, f"harus dua kotak di kedua gambar, sekarang: {len(a)} dan {len(b)}"\n' +
              'for satu, dua in zip(a, b):\n' +
              '    assert abs((dua["x"] - satu["x"]) - geser) < 1e-9, "semuanya harus bergeser sama"\n' +
              'padam = gambar({**dasar, "kebal": 1.15})\n' +
              'assert len([p for p in padam if p["bentuk"] == "kotak"]) == 1, "pada fase padam papannya harus hilang"',
          },
          {
            name: { en: 'Good and bad look different', id: 'Yang baik dan yang buruk tampak berbeda' },
            assert:
              'a = gambar({**segar("main", True, 0), "benda": [\n' +
              '    {"x": 40, "y": 60.0, "jenis": "baik"},\n' +
              '    {"x": 160, "y": 60.0, "jenis": "buruk"},\n' +
              ']})\n' +
              'warna = [p["warna"] for p in a if p["bentuk"] == "kotak"]\n' +
              'assert "#f5c65b" in warna, f"yang baik harus #f5c65b, sekarang: {warna}"\n' +
              'assert "#ef8f70" in warna, f"yang buruk harus #ef8f70, sekarang: {warna}"',
          },
          {
            name: { en: 'A whole game can be played end to end', id: 'Satu permainan penuh bisa dilalui ujung ke ujung' },
            assert:
              'k = perbarui(awal(), {"spasi"}, 1 / 60)\n' +
              'for _ in range(9000):\n' +
              '    # kejar yang baik terdekat, dan jangan berdiri di bawah yang buruk\n' +
              '    incar = None\n' +
              '    for b in k["benda"]:\n' +
              '        if b["jenis"] == "baik" and (incar is None or b["y"] > incar["y"]):\n' +
              '            incar = b\n' +
              '    ditekan = set()\n' +
              '    if incar is not None:\n' +
              '        target = incar["x"] - 21\n' +
              '        if k["px"] < target - 2:\n' +
              '            ditekan = {"kanan"}\n' +
              '        elif k["px"] > target + 2:\n' +
              '            ditekan = {"kiri"}\n' +
              '    k = perbarui(k, ditekan, 1 / 60)\n' +
              '    if k["fase"] == "selesai":\n' +
              '        break\n' +
              'assert k["skor"] > 5, f"pemain yang mengejar harus mencetak skor, sekarang: {k[\'skor\']}"\n' +
              'assert len(k["benda"]) < 20, f"daftarnya harus tetap kecil, sekarang: {len(k[\'benda\'])}"',
          },
          {
            name: { en: 'The state it was given is left alone', id: 'Keadaan yang diberikan padanya dibiarkan' },
            assert:
              'asal = [{"x": 40, "y": 10.0, "jenis": "baik"}]\n' +
              'k = {**segar("main", False, 4), "benda": asal, "sisa": 5.0}\n' +
              'perbarui(k, {"kanan"}, 0.5)\n' +
              'assert asal[0]["y"] == 10.0, f"benda lamanya tidak boleh ikut bergerak, sekarang: {asal[0][\'y\']}"\n' +
              'assert k["px"] == 132.0 and k["skor"] == 0, "keadaan yang diberikan tidak boleh berubah"',
          },
        ],
        hints: [
          { en: 'You have written all of this before. The only new thing is that an item carries a `jenis`, and the two kinds are resolved differently.', id: 'Kamu sudah pernah menulis semua ini. Satu-satunya yang baru adalah bendanya membawa `jenis`, dan kedua jenisnya diselesaikan berbeda.' },
          { en: 'Keep `i` as a plain counter and take the remainder where you read the lists — that is why the pattern and the positions can be different lengths.', id: 'Jaga `i` tetap penghitung biasa dan ambil sisanya di tempat kamu membaca daftarnya — itulah sebabnya polanya dan posisinya boleh berbeda panjang.' },
          { en: 'The bad-item branch has two cases inside it: mercy running, or not. Only one of them costs anything.', id: 'Cabang benda buruknya punya dua kasus di dalamnya: keringanan sedang berjalan, atau tidak. Hanya satu dari keduanya yang berbiaya.' },
          { en: 'Work `geser` out once at the top of `gambar`, and remember the text moves with everything else.', id: 'Hitung `geser` sekali di atas `gambar`, dan ingat teksnya ikut bergerak bersama yang lain.' },
        ],
        solution:
          'TITIK_X = [40, 160, 280, 100, 220]\n' +
          'POLA = ["baik", "baik", "buruk", "baik", "buruk", "baik"]\n' +
          'LAJU = 200\n' +
          'PAPAN_L = 56\n' +
          'PAPAN_T = 12\n' +
          'PAPAN_Y = 214\n' +
          'BENDA = 14\n' +
          'KEBAL = 1.5\n' +
          'GUNCANG = 0.3\n' +
          'LEBAR = 320\n' +
          'TINGGI = 240\n\n' +
          'def tabrakan(a, b):\n' +
          '    return (\n' +
          '        a["x"] < b["x"] + b["l"]\n' +
          '        and a["x"] + a["l"] > b["x"]\n' +
          '        and a["y"] < b["y"] + b["t"]\n' +
          '        and a["y"] + a["t"] > b["y"]\n' +
          '    )\n\n' +
          'def segar(fase, spasi_lalu, rekor):\n' +
          '    return {\n' +
          '        "fase": fase,\n' +
          '        "px": 132.0,\n' +
          '        "benda": [],\n' +
          '        "i": 0,\n' +
          '        "sisa": 0.0,\n' +
          '        "skor": 0,\n' +
          '        "nyawa": 3,\n' +
          '        "kebal": 0.0,\n' +
          '        "guncang": 0.0,\n' +
          '        "rekor": rekor,\n' +
          '        "spasi_lalu": spasi_lalu,\n' +
          '    }\n\n' +
          'def tingkat(skor):\n' +
          '    return 1 + skor // 5\n\n' +
          'def laju(skor):\n' +
          '    return min(300, 120 + tingkat(skor) * 20)\n\n' +
          'def jeda(skor):\n' +
          '    return max(0.35, 0.9 - tingkat(skor) * 0.06)\n\n' +
          'def kedip(kebal):\n' +
          '    return kebal > 0 and int(kebal * 10) % 2 == 1\n\n' +
          'def getar(guncang):\n' +
          '    if guncang <= 0:\n' +
          '        return 0\n' +
          '    return 4 if int(guncang * 60) % 2 == 0 else -4\n\n' +
          'def awal():\n' +
          '    return segar("siap", False, 0)\n\n' +
          'def perbarui(keadaan, tombol, dt):\n' +
          '    ditekan = "spasi" in tombol\n' +
          '    baru = ditekan and not keadaan["spasi_lalu"]\n\n' +
          '    if keadaan["fase"] == "siap":\n' +
          '        if baru:\n' +
          '            return segar("main", ditekan, keadaan["rekor"])\n' +
          '        return {**keadaan, "spasi_lalu": ditekan}\n\n' +
          '    if keadaan["fase"] == "selesai":\n' +
          '        if baru:\n' +
          '            return segar("siap", ditekan, keadaan["rekor"])\n' +
          '        return {**keadaan, "spasi_lalu": ditekan}\n\n' +
          '    px = keadaan["px"]\n' +
          '    if "kiri" in tombol:\n' +
          '        px = px - LAJU * dt\n' +
          '    if "kanan" in tombol:\n' +
          '        px = px + LAJU * dt\n' +
          '    px = max(0, min(LEBAR - PAPAN_L, px))\n\n' +
          '    skor = keadaan["skor"]\n' +
          '    nyawa = keadaan["nyawa"]\n' +
          '    kebal = max(0.0, keadaan["kebal"] - dt)\n' +
          '    guncang = max(0.0, keadaan["guncang"] - dt)\n' +
          '    turun = laju(skor)\n\n' +
          '    papan = {"x": px, "y": PAPAN_Y, "l": PAPAN_L, "t": PAPAN_T}\n' +
          '    tersisa = []\n' +
          '    for b in keadaan["benda"]:\n' +
          '        pindah = {"x": b["x"], "y": b["y"] + turun * dt, "jenis": b["jenis"]}\n' +
          '        kotak = {"x": pindah["x"], "y": pindah["y"], "l": BENDA, "t": BENDA}\n' +
          '        if tabrakan(kotak, papan):\n' +
          '            if pindah["jenis"] == "baik":\n' +
          '                skor = skor + 1\n' +
          '            elif kebal <= 0:\n' +
          '                nyawa = max(0, nyawa - 1)\n' +
          '                kebal = KEBAL\n' +
          '                guncang = GUNCANG\n' +
          '        elif pindah["y"] <= TINGGI:\n' +
          '            tersisa.append(pindah)\n\n' +
          '    i = keadaan["i"]\n' +
          '    sisa = keadaan["sisa"] - dt\n' +
          '    if sisa <= 0:\n' +
          '        tersisa = tersisa + [{\n' +
          '            "x": TITIK_X[i % len(TITIK_X)],\n' +
          '            "y": -float(BENDA),\n' +
          '            "jenis": POLA[i % len(POLA)],\n' +
          '        }]\n' +
          '        i = i + 1\n' +
          '        sisa = jeda(skor)\n\n' +
          '    rekor = keadaan["rekor"]\n' +
          '    fase = "main"\n' +
          '    if nyawa <= 0:\n' +
          '        fase = "selesai"\n' +
          '        rekor = max(rekor, skor)\n\n' +
          '    return {\n' +
          '        "fase": fase,\n' +
          '        "px": px,\n' +
          '        "benda": tersisa,\n' +
          '        "i": i,\n' +
          '        "sisa": sisa,\n' +
          '        "skor": skor,\n' +
          '        "nyawa": nyawa,\n' +
          '        "kebal": kebal,\n' +
          '        "guncang": guncang,\n' +
          '        "rekor": rekor,\n' +
          '        "spasi_lalu": ditekan,\n' +
          '    }\n\n' +
          'def gambar(keadaan):\n' +
          '    geser = getar(keadaan["guncang"])\n' +
          '    hasil = []\n\n' +
          '    for b in keadaan["benda"]:\n' +
          '        warna = "#f5c65b" if b["jenis"] == "baik" else "#ef8f70"\n' +
          '        hasil.append({"bentuk": "kotak", "x": b["x"] + geser, "y": b["y"], "l": BENDA, "t": BENDA, "warna": warna})\n\n' +
          '    if not kedip(keadaan["kebal"]):\n' +
          '        hasil.append({\n' +
          '            "bentuk": "kotak",\n' +
          '            "x": keadaan["px"] + geser,\n' +
          '            "y": PAPAN_Y,\n' +
          '            "l": PAPAN_L,\n' +
          '            "t": PAPAN_T,\n' +
          '            "warna": "#24463d",\n' +
          '        })\n\n' +
          '    if keadaan["fase"] == "siap":\n' +
          '        hasil.append({"bentuk": "teks", "x": 90 + geser, "y": 110, "isi": "Spasi untuk mulai", "warna": "#24463d"})\n' +
          '    elif keadaan["fase"] == "selesai":\n' +
          '        hasil.append({"bentuk": "teks", "x": 84 + geser, "y": 110, "isi": "Habis! Rekor " + str(keadaan["rekor"]), "warna": "#ef8f70"})\n' +
          '    else:\n' +
          '        hasil.append({\n' +
          '            "bentuk": "teks",\n' +
          '            "x": 8 + geser,\n' +
          '            "y": 8,\n' +
          '            "isi": "Skor: " + str(keadaan["skor"]) + "  Nyawa: " + str(keadaan["nyawa"]) + "  Tingkat: " + str(tingkat(keadaan["skor"])),\n' +
          '            "warna": "#24463d",\n' +
          '        })\n\n' +
          '    return hasil\n',
        xp: 80,
      },
    },
  ],
}
