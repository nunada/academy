import type { Module } from '../types'

/** Module 7 — data that outlives the program.
 *
 *  Pyodide gives every exercise a real (in-memory) filesystem, so `open()`
 *  behaves exactly as it does on a desktop. That one filesystem is shared for
 *  the whole session though, which is why the tests here use `setup` to delete
 *  leftovers before the learner's code runs. */
export const module7: Module = {
  id: 'py-m7',
  title: { en: 'Files', id: 'Berkas' },
  summary: {
    en: 'Save data so it is still there after the program ends.',
    id: 'Menyimpan data agar tetap ada setelah program berakhir.',
  },
  submodules: [
    /* --------------------------------------------------------- 7.1 read/write */
    {
      id: 'py-m7-s1',
      title: { en: 'Reading and Writing', id: 'Membaca dan Menulis' },
      summary: {
        en: 'Put text into a file, then get it back out.',
        id: 'Memasukkan teks ke berkas, lalu mengambilnya kembali.',
      },
      lessons: [
        {
          id: 'py-m7-s1-l1',
          title: { en: 'Writing a file', id: 'Menulis berkas' },
          goal: { en: 'Save text that survives the program.', id: 'Menyimpan teks yang bertahan setelah program selesai.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Everything so far was forgotten', id: 'Semua yang lalu terlupakan' },
              body: {
                en: 'Every variable disappears when the program ends. A file is the simplest way to keep something. `open(nama, "w")` opens a file for writing — and `"w"` **empties it first**, so an existing file loses its old contents.',
                id: 'Semua variabel lenyap saat program berakhir. Berkas adalah cara paling sederhana untuk menyimpan sesuatu. `open(nama, "w")` membuka berkas untuk ditulis — dan `"w"` **mengosongkannya lebih dulu**, jadi berkas lama kehilangan isinya.',
              },
              code: {
                en: 'f = open("notes.txt", "w")\nf.write("first line\\n")\nf.write("second line\\n")\nf.close()\n\nprint("saved")',
                id: 'f = open("catatan.txt", "w")\nf.write("baris pertama\\n")\nf.write("baris kedua\\n")\nf.close()\n\nprint("tersimpan")',
              },
              output: { en: 'saved', id: 'tersimpan' },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'with closes it for you', id: 'with menutupnya untukmu' },
              body: {
                en: 'Forgetting `close()` can leave the text unwritten. `with` closes the file the moment the indented block ends — even if an error happens inside it. Prefer this form always.',
                id: 'Lupa `close()` bisa membuat teksnya tidak tertulis. `with` menutup berkas begitu blok menjoroknya berakhir — bahkan bila terjadi error di dalamnya. Selalu utamakan bentuk ini.',
              },
              code: {
                en: 'with open("notes.txt", "w") as f:\n    f.write("hello\\n")\n\nprint("done")',
                id: 'with open("catatan.txt", "w") as f:\n    f.write("halo\\n")\n\nprint("selesai")',
              },
              output: { en: 'done', id: 'selesai' },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'write does not add a newline', id: 'write tidak menambah baris baru' },
              body: {
                en: 'Unlike `print()`, `write()` adds nothing. Two writes without `\\n` end up on the same line — a surprise worth meeting once, deliberately.',
                id: 'Tidak seperti `print()`, `write()` tidak menambahkan apa pun. Dua penulisan tanpa `\\n` berakhir di baris yang sama — kejutan yang sebaiknya kamu temui sekali, dengan sengaja.',
              },
              code: {
                en: 'with open("a.txt", "w") as f:\n    f.write("one")\n    f.write("two")\n\nwith open("a.txt") as f:\n    print(f.read())',
                id: 'with open("a.txt", "w") as f:\n    f.write("satu")\n    f.write("dua")\n\nwith open("a.txt") as f:\n    print(f.read())',
              },
              output: { en: 'onetwo', id: 'satudua' },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'The file already contains 10 lines. What does this leave in it?',
                id: 'Berkas sudah berisi 10 baris. Apa yang tersisa setelah kode ini?',
              },
              code: { en: 'with open("data.txt", "w") as f:\n    f.write("new\\n")', id: 'with open("data.txt", "w") as f:\n    f.write("baru\\n")' },
              options: [
                { en: 'Only the line `new`', id: 'Hanya baris `baru`' },
                { en: '11 lines', id: '11 baris' },
                { en: 'The original 10 lines', id: '10 baris aslinya' },
                { en: 'An error, the file exists', id: 'Error, berkasnya sudah ada' },
              ],
              answer: 0,
              explain: {
                en: 'Mode "w" truncates the file before writing. Use "a" to append instead.',
                id: 'Mode "w" mengosongkan berkas sebelum menulis. Pakai "a" bila ingin menambahkan.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Write `hello` into `message.txt`, closing the file automatically.',
                id: 'Tulis `halo` ke `pesan.txt`, dengan penutupan berkas otomatis.',
              },
              template: {
                en: '___ open("message.txt", "___") as f:\n    f.write("hello")',
                id: '___ open("pesan.txt", "___") as f:\n    f.write("halo")',
              },
              blanks: ['with', 'w'],
              explain: {
                en: 'with handles the closing; "w" opens the file for writing.',
                id: 'with mengurus penutupannya; "w" membuka berkas untuk ditulis.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Write the numbers 1 to 5 into `numbers.txt`, one per line, then print `Done`.',
                id: 'Tulis angka 1 sampai 5 ke `angka.txt`, satu per baris, lalu cetak `Selesai`.',
              },
              starter: '',
              tests: {
                en: [
                  {
                    name: { en: 'Prints Done', id: 'Mencetak Selesai' },
                    setup: 'import os\nif os.path.exists("numbers.txt"):\n    os.remove("numbers.txt")',
                    expectOutput: 'Done',
                  },
                  {
                    name: { en: 'The file holds five lines', id: 'Berkasnya berisi lima baris' },
                    setup: 'import os\nif os.path.exists("numbers.txt"):\n    os.remove("numbers.txt")',
                    assert:
                      'with open("numbers.txt") as _f:\n    _content = _f.read()\nassert _content.split() == ["1", "2", "3", "4", "5"], "file contents are not right: " + repr(_content)',
                  },
                ],
                id: [
                  {
                    name: { en: 'Prints Selesai', id: 'Mencetak Selesai' },
                    setup: 'import os\nif os.path.exists("angka.txt"):\n    os.remove("angka.txt")',
                    expectOutput: 'Selesai',
                  },
                  {
                    name: { en: 'The file holds five lines', id: 'Berkasnya berisi lima baris' },
                    setup: 'import os\nif os.path.exists("angka.txt"):\n    os.remove("angka.txt")',
                    assert:
                      'with open("angka.txt") as _f:\n    _isi = _f.read()\nassert _isi.split() == ["1", "2", "3", "4", "5"], "isi berkas belum sesuai: " + repr(_isi)',
                  },
                ],
              },
              hints: [
                { en: 'A for loop over range(1, 6) inside the with block.', id: 'Loop for atas range(1, 6) di dalam blok with.' },
                { en: 'write() needs text, so wrap the number: str(i)', id: 'write() butuh teks, jadi bungkus angkanya: str(i)' },
                { en: 'f.write(f"{i}\\n") — the \\n is what makes it a new line.', id: 'f.write(f"{i}\\n") — \\n itulah yang membuat baris baru.' },
              ],
              solution: {
                en: 'with open("numbers.txt", "w") as f:\n    for i in range(1, 6):\n        f.write(f"{i}\\n")\n\nprint("Done")',
                id: 'with open("angka.txt", "w") as f:\n    for i in range(1, 6):\n        f.write(f"{i}\\n")\n\nprint("Selesai")',
              },
            },
          ],
        },
        {
          id: 'py-m7-s1-l2',
          title: { en: 'Reading it back', id: 'Membacanya kembali' },
          goal: { en: 'Read a file line by line.', id: 'Membaca berkas baris demi baris.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'read, readlines, or just loop', id: 'read, readlines, atau langsung loop' },
              body: {
                en: '`read()` gives the whole file as one string. Looping the file directly gives one line at a time, which is what you usually want — and it never loads a huge file into memory at once.',
                id: '`read()` memberi seluruh berkas sebagai satu string. Mengulang berkasnya langsung memberi satu baris tiap kali, dan itulah yang biasanya kamu butuhkan — sekaligus tidak memuat berkas raksasa sekaligus ke memori.',
              },
              code: {
                en: 'with open("cities.txt", "w") as f:\n    f.write("Surabaya\\nMalang\\n")\n\nwith open("cities.txt") as f:\n    for line in f:\n        print(line)',
                id: 'with open("kota.txt", "w") as f:\n    f.write("Surabaya\\nMalang\\n")\n\nwith open("kota.txt") as f:\n    for baris in f:\n        print(baris)',
              },
              output: 'Surabaya\n\nMalang\n',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The newline comes along', id: 'Baris barunya ikut terbawa' },
              body: {
                en: 'Each line still ends with `\\n`, and `print` adds another — hence the blank lines above. `.strip()` removes the whitespace at both ends and fixes it.',
                id: 'Tiap baris masih berakhir dengan `\\n`, dan `print` menambah satu lagi — itulah asal baris kosong di atas. `.strip()` membuang spasi di kedua ujung dan memperbaikinya.',
              },
              code: {
                en: 'with open("cities.txt") as f:\n    for line in f:\n        print(line.strip())',
                id: 'with open("kota.txt") as f:\n    for baris in f:\n        print(baris.strip())',
              },
              output: 'Surabaya\nMalang',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'A missing file raises', id: 'Berkas yang tidak ada memunculkan error' },
              body: {
                en: 'Opening a file that is not there raises `FileNotFoundError`. This is where module 6 pays off: reading a file is exactly the kind of risky line `try` was made for.',
                id: 'Membuka berkas yang tidak ada memunculkan `FileNotFoundError`. Di sinilah modul 6 terbayar: membaca berkas persis jenis baris berisiko yang membuat `try` diciptakan.',
              },
              code: {
                en: 'try:\n    with open("missing.txt") as f:\n        print(f.read())\nexcept FileNotFoundError:\n    print("file does not exist yet")',
                id: 'try:\n    with open("hilang.txt") as f:\n        print(f.read())\nexcept FileNotFoundError:\n    print("berkas belum ada")',
              },
              output: { en: 'file does not exist yet', id: 'berkas belum ada' },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A file holds three lines. What does `len(f.readlines())` give?',
                id: 'Sebuah berkas berisi tiga baris. Berapa hasil `len(f.readlines())`?',
              },
              options: [
                { en: '3 — one string per line', id: '3 — satu string per baris' },
                { en: '1 — the whole file', id: '1 — seluruh berkas' },
                { en: 'The number of characters', id: 'Jumlah karakternya' },
                { en: '0 until you call read()', id: '0 sampai kamu memanggil read()' },
              ],
              answer: 0,
              explain: {
                en: 'readlines() returns a list with one item per line, each still carrying its newline.',
                id: 'readlines() mengembalikan list berisi satu item per baris, masing-masing masih membawa baris barunya.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program that counts the lines in a file.',
                id: 'Susun program yang menghitung jumlah baris dalam sebuah berkas.',
              },
              lines: {
                en: ['count = 0', 'with open("data.txt") as f:', '    for line in f:', '        count += 1', 'print(count)'],
                id: ['jumlah = 0', 'with open("data.txt") as f:', '    for baris in f:', '        jumlah += 1', 'print(jumlah)'],
              },
              explain: {
                en: 'The counter is created before the file is opened and printed after the block closes it.',
                id: 'Pencacahnya dibuat sebelum berkas dibuka dan dicetak setelah bloknya menutup berkas.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'The file `nilai.txt` holds one number per line. Read it and print the total, then the average rounded to one decimal, on two lines.',
                id: 'Berkas `nilai.txt` berisi satu angka per baris. Baca dan cetak totalnya, lalu rata-ratanya dibulatkan satu desimal, dalam dua baris.',
              },
              starter: { en: '# scores.txt has been prepared for you\n', id: '# nilai.txt sudah disiapkan untukmu\n' },
              tests: {
                en: [
                  {
                    name: { en: '80, 95, 70', id: '80, 95, 70' },
                    setup: 'with open("scores.txt", "w") as _f:\n    _f.write("80\\n95\\n70\\n")',
                    expectOutput: '245\n81.7',
                  },
                  {
                    name: { en: 'A single value', id: 'Satu nilai saja' },
                    setup: 'with open("scores.txt", "w") as _f:\n    _f.write("100\\n")',
                    expectOutput: '100\n100.0',
                  },
                  {
                    name: { en: 'Four values', id: 'Empat nilai' },
                    setup: 'with open("scores.txt", "w") as _f:\n    _f.write("10\\n20\\n30\\n40\\n")',
                    expectOutput: '100\n25.0',
                  },
                ],
                id: [
                  {
                    name: { en: '80, 95, 70', id: '80, 95, 70' },
                    setup: 'with open("nilai.txt", "w") as _f:\n    _f.write("80\\n95\\n70\\n")',
                    expectOutput: '245\n81.7',
                  },
                  {
                    name: { en: 'A single value', id: 'Satu nilai saja' },
                    setup: 'with open("nilai.txt", "w") as _f:\n    _f.write("100\\n")',
                    expectOutput: '100\n100.0',
                  },
                  {
                    name: { en: 'Four values', id: 'Empat nilai' },
                    setup: 'with open("nilai.txt", "w") as _f:\n    _f.write("10\\n20\\n30\\n40\\n")',
                    expectOutput: '100\n25.0',
                  },
                ],
              },
              hints: [
                { en: 'Collect the numbers into a list first, then report.', id: 'Kumpulkan angkanya ke sebuah list dulu, baru laporkan.' },
                { en: 'Each line is text with a newline: int(line.strip())', id: 'Tiap baris berupa teks dengan baris baru: int(baris.strip())' },
                { en: 'round(sum(scores) / len(scores), 1) gives one decimal.', id: 'round(sum(angka) / len(angka), 1) memberi satu angka desimal.' },
              ],
              solution: {
                en: 'scores = []\nwith open("scores.txt") as f:\n    for line in f:\n        scores.append(int(line.strip()))\n\nprint(sum(scores))\nprint(round(sum(scores) / len(scores), 1))',
                id: 'angka = []\nwith open("nilai.txt") as f:\n    for baris in f:\n        angka.append(int(baris.strip()))\n\nprint(sum(angka))\nprint(round(sum(angka) / len(angka), 1))',
              },
            },
          ],
        },
      ],
      project: {
        id: 'py-m7-s1-p',
        title: { en: 'Note keeper', id: 'Penyimpan catatan' },
        brief: {
          en: 'Add notes to a file that grows across runs, then show them numbered.',
          id: 'Tambahkan catatan ke berkas yang bertambah antar-jalan, lalu tampilkan bernomor.',
        },
        requirements: [
          { en: 'Read lines until the user types `done`.', id: 'Baca baris sampai pengguna mengetik `selesai`.' },
          { en: 'Append each note to `notes.txt` — do not erase what was already there.', id: 'Tambahkan tiap catatan ke `catatan.txt` — jangan hapus isi sebelumnya.' },
          { en: 'Then print every note as `1. note content`, numbered from 1.', id: 'Lalu cetak semua catatan sebagai `1. isi catatan`, bernomor mulai 1.' },
          { en: 'If the file does not exist yet, print `No notes yet`.', id: 'Bila berkasnya belum ada, cetak `Belum ada catatan`.' },
        ],
        starter: { en: '# Note keeper\n', id: '# Penyimpan catatan\n' },
        tests: {
          en: [
            {
              name: { en: 'Two new notes', id: 'Dua catatan baru' },
              setup: 'import os\nif os.path.exists("notes.txt"):\n    os.remove("notes.txt")',
              stdin: ['buy milk', 'do homework', 'done'],
              expectOutput: '1. buy milk\n2. do homework',
            },
            {
              name: { en: 'Appends to existing notes', id: 'Menambah ke catatan yang sudah ada' },
              setup: 'with open("notes.txt", "w") as _f:\n    _f.write("old note\\n")',
              stdin: ['new note', 'done'],
              expectOutput: '1. old note\n2. new note',
            },
            {
              name: { en: 'No file and no input', id: 'Tanpa berkas dan tanpa masukan' },
              setup: 'import os\nif os.path.exists("notes.txt"):\n    os.remove("notes.txt")',
              stdin: ['done'],
              expectOutput: 'No notes yet',
            },
          ],
          id: [
            {
              name: { en: 'Two new notes', id: 'Dua catatan baru' },
              setup: 'import os\nif os.path.exists("catatan.txt"):\n    os.remove("catatan.txt")',
              stdin: ['beli susu', 'kerjakan tugas', 'selesai'],
              expectOutput: '1. beli susu\n2. kerjakan tugas',
            },
            {
              name: { en: 'Appends to existing notes', id: 'Menambah ke catatan yang sudah ada' },
              setup: 'with open("catatan.txt", "w") as _f:\n    _f.write("catatan lama\\n")',
              stdin: ['catatan baru', 'selesai'],
              expectOutput: '1. catatan lama\n2. catatan baru',
            },
            {
              name: { en: 'No file and no input', id: 'Tanpa berkas dan tanpa masukan' },
              setup: 'import os\nif os.path.exists("catatan.txt"):\n    os.remove("catatan.txt")',
              stdin: ['selesai'],
              expectOutput: 'Belum ada catatan',
            },
          ],
        },
        hints: [
          { en: 'Mode "a" appends instead of erasing.', id: 'Mode "a" menambahkan, bukan menghapus.' },
          { en: 'Collect the notes in a loop first, then open the file once to append them all.', id: 'Kumpulkan catatannya dalam loop dulu, lalu buka berkasnya sekali untuk menambahkan semuanya.' },
          { en: 'Reading needs try/except FileNotFoundError for the very first run.', id: 'Pembacaan butuh try/except FileNotFoundError untuk jalan pertama kali.' },
          {
            en: 'enumerate(lines, 1) hands you the number and the line together.',
            id: 'enumerate(baris, 1) memberimu nomor dan barisnya sekaligus.',
          },
        ],
        solution: {
          en: 'new_notes = []\nwhile True:\n    text = input("Note (done to stop): ")\n    if text == "done":\n        break\n    new_notes.append(text)\n\nif new_notes:\n    with open("notes.txt", "a") as f:\n        for t in new_notes:\n            f.write(t + "\\n")\n\ntry:\n    with open("notes.txt") as f:\n        all_notes = [b.strip() for b in f]\nexcept FileNotFoundError:\n    all_notes = []\n\nif not all_notes:\n    print("No notes yet")\nelse:\n    for i, note in enumerate(all_notes, 1):\n        print(f"{i}. {note}")',
          id: 'baru = []\nwhile True:\n    teks = input("Catatan (selesai untuk berhenti): ")\n    if teks == "selesai":\n        break\n    baru.append(teks)\n\nif baru:\n    with open("catatan.txt", "a") as f:\n        for t in baru:\n            f.write(t + "\\n")\n\ntry:\n    with open("catatan.txt") as f:\n        semua = [b.strip() for b in f]\nexcept FileNotFoundError:\n    semua = []\n\nif not semua:\n    print("Belum ada catatan")\nelse:\n    for i, isi in enumerate(semua, 1):\n        print(f"{i}. {isi}")',
        },
        xp: 50,
      },
    },

    /* ------------------------------------------------------------- 7.2 tables */
    {
      id: 'py-m7-s2',
      title: { en: 'Structured Files', id: 'Berkas Terstruktur' },
      summary: {
        en: 'Store rows and columns, not just loose lines.',
        id: 'Menyimpan baris dan kolom, bukan sekadar baris lepas.',
      },
      lessons: [
        {
          id: 'py-m7-s2-l1',
          title: { en: 'Splitting a line', id: 'Memecah sebuah baris' },
          goal: { en: 'Turn one text line into fields.', id: 'Mengubah satu baris teks menjadi kolom.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'split cuts on a separator', id: 'split memotong pada pemisah' },
              body: {
                en: 'A line like `Ani,17,Surabaya` is a row with three fields. `.split(",")` returns them as a list, and the pieces are always text — convert what should be a number.',
                id: 'Baris seperti `Ani,17,Surabaya` adalah satu baris data dengan tiga kolom. `.split(",")` mengembalikannya sebagai list, dan potongannya selalu berupa teks — konversi yang seharusnya angka.',
              },
              code: {
                en: 'row = "Ani,17,Surabaya"\nparts = row.split(",")\nprint(parts)\nprint(parts[0])\nprint(int(parts[1]) + 1)',
                id: 'baris = "Ani,17,Surabaya"\nbagian = baris.split(",")\nprint(bagian)\nprint(bagian[0])\nprint(int(bagian[1]) + 1)',
              },
              output: "['Ani', '17', 'Surabaya']\nAni\n18",
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'join puts it back together', id: 'join menyatukannya kembali' },
              body: {
                en: '`join` is the mirror image of `split`. The separator goes in front, and every item must already be text.',
                id: '`join` adalah kebalikan dari `split`. Pemisahnya ditulis di depan, dan tiap item harus sudah berupa teks.',
              },
              code: { en: 'parts = ["Budi", "20", "Malang"]\nprint(",".join(parts))', id: 'bagian = ["Budi", "20", "Malang"]\nprint(",".join(bagian))' },
              output: 'Budi,20,Malang',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: { en: 'row = "a,b,,c"\nprint(len(row.split(",")))', id: 'baris = "a,b,,c"\nprint(len(baris.split(",")))' },
              options: [
                { en: '4 — the empty field counts', id: '4 — kolom kosong ikut terhitung' },
                { en: '3 — the empty one is skipped', id: '3 — yang kosong dilewati' },
                { en: '5', id: '5' },
                { en: 'An error', id: 'Error' },
              ],
              answer: 0,
              explain: {
                en: 'split cuts at every separator, so two commas in a row produce an empty string between them.',
                id: 'split memotong di tiap pemisah, jadi dua koma berurutan menghasilkan string kosong di antaranya.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Take the age out of the row and print it as a number.',
                id: 'Ambil umur dari baris itu dan cetak sebagai angka.',
              },
              template: {
                en: 'row = "Ani,17,Surabaya"\nparts = row.___(",")\nprint(___(parts[1]))',
                id: 'baris = "Ani,17,Surabaya"\nbagian = baris.___(",")\nprint(___(bagian[1]))',
              },
              blanks: ['split', 'int'],
              explain: {
                en: 'split gives a list of text; int turns the middle field into a number.',
                id: 'split memberi list berisi teks; int mengubah kolom tengahnya menjadi angka.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Write `read_row(row)` that turns `"Ani,17,Surabaya"` into the dictionary `{"name": "Ani", "age": 17, "city": "Surabaya"}` — with `age` as a real number.',
                id: 'Tulis `baca_baris(baris)` yang mengubah `"Ani,17,Surabaya"` menjadi dictionary `{"nama": "Ani", "umur": 17, "kota": "Surabaya"}` — dengan `umur` sebagai angka sungguhan.',
              },
              starter: { en: 'def read_row(row):\n    pass\n', id: 'def baca_baris(baris):\n    pass\n' },
              tests: {
                en: [
                  {
                    name: { en: 'Splits the three fields', id: 'Memecah ketiga kolom' },
                    assert:
                      'result = read_row("Ani,17,Surabaya")\nassert result == {"name": "Ani", "age": 17, "city": "Surabaya"}, "result is not right: " + repr(result)',
                  },
                  {
                    name: { en: 'The age is a number, not text', id: 'Umurnya angka, bukan teks' },
                    assert:
                      'result = read_row("Budi,20,Malang")\nassert result["age"] == 20 and isinstance(result["age"], int), "age must be an int"',
                  },
                ],
                id: [
                  {
                    name: { en: 'Splits the three fields', id: 'Memecah ketiga kolom' },
                    assert:
                      'hasil = baca_baris("Ani,17,Surabaya")\nassert hasil == {"nama": "Ani", "umur": 17, "kota": "Surabaya"}, "hasil belum sesuai: " + repr(hasil)',
                  },
                  {
                    name: { en: 'The age is a number, not text', id: 'Umurnya angka, bukan teks' },
                    assert:
                      'hasil = baca_baris("Budi,20,Malang")\nassert hasil["umur"] == 20 and isinstance(hasil["umur"], int), "umur harus int"',
                  },
                ],
              },
              hints: [
                { en: 'Split first, then build the dictionary from the pieces.', id: 'Pecah dulu, lalu bangun dictionary-nya dari potongannya.' },
                { en: 'parts = row.split(",")', id: 'bagian = baris.split(",")' },
                {
                  en: 'return {"name": parts[0], "age": int(parts[1]), "city": parts[2]}',
                  id: 'return {"nama": bagian[0], "umur": int(bagian[1]), "kota": bagian[2]}',
                },
              ],
              solution: {
                en: 'def read_row(row):\n    parts = row.split(",")\n    return {"name": parts[0], "age": int(parts[1]), "city": parts[2]}',
                id: 'def baca_baris(baris):\n    bagian = baris.split(",")\n    return {"nama": bagian[0], "umur": int(bagian[1]), "kota": bagian[2]}',
              },
            },
          ],
        },
        {
          id: 'py-m7-s2-l2',
          title: { en: 'A file full of rows', id: 'Berkas penuh baris data' },
          goal: { en: 'Load a whole table and query it.', id: 'Memuat seluruh tabel dan menanyainya.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Read, split, collect', id: 'Baca, pecah, kumpulkan' },
              body: {
                en: 'The whole pattern is three moves: loop the file, split each line, append the result. What you get is a list of dictionaries — the shape most real data arrives in.',
                id: 'Seluruh polanya cuma tiga langkah: ulangi berkasnya, pecah tiap baris, tambahkan hasilnya. Yang kamu dapat adalah list berisi dictionary — bentuk yang paling sering dipakai data nyata.',
              },
              code: {
                en: 'with open("students.txt", "w") as f:\n    f.write("Ani,80\\nBudi,65\\n")\n\ndata = []\nwith open("students.txt") as f:\n    for line in f:\n        name, score = line.strip().split(",")\n        data.append({"name": name, "score": int(score)})\n\nprint(data)',
                id: 'with open("siswa.txt", "w") as f:\n    f.write("Ani,80\\nBudi,65\\n")\n\ndata = []\nwith open("siswa.txt") as f:\n    for baris in f:\n        nama, nilai = baris.strip().split(",")\n        data.append({"nama": nama, "nilai": int(nilai)})\n\nprint(data)',
              },
              output: {
                en: "[{'name': 'Ani', 'score': 80}, {'name': 'Budi', 'score': 65}]",
                id: "[{'nama': 'Ani', 'nilai': 80}, {'nama': 'Budi', 'nilai': 65}]",
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Skip the blank line at the end', id: 'Lewati baris kosong di akhir' },
              body: {
                en: 'A file usually ends with a newline, which can hand you one empty final line. Splitting that would crash, so skip it — a one-line guard that saves a lot of confusion.',
                id: 'Berkas biasanya diakhiri baris baru, yang bisa memberimu satu baris kosong di ujung. Memecah baris itu akan error, jadi lewati saja — penjagaan satu baris yang menghemat banyak kebingungan.',
              },
              code: {
                en: 'line = "\\n"\nif not line.strip():\n    print("skipped")\nelse:\n    print(line.split(","))',
                id: 'baris = "\\n"\nif not baris.strip():\n    print("dilewati")\nelse:\n    print(baris.split(","))',
              },
              output: { en: 'skipped', id: 'dilewati' },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why does `name, score = line.strip().split(",")` fail on the line `Ani,80,extra`?',
                id: 'Kenapa `nama, nilai = baris.strip().split(",")` gagal pada baris `Ani,80,extra`?',
              },
              options: [
                { en: 'Three pieces cannot fit into two names', id: 'Tiga potongan tidak muat ke dua nama' },
                { en: 'strip() removed the comma', id: 'strip() menghapus komanya' },
                { en: 'split only ever returns two pieces', id: 'split selalu mengembalikan dua potongan' },
                { en: 'It does not fail', id: 'Tidak gagal' },
              ],
              answer: 0,
              explain: {
                en: 'Unpacking demands an exact match. Three values and two names raises ValueError.',
                id: 'Pembongkaran menuntut jumlah yang tepat sama. Tiga nilai dan dua nama memunculkan ValueError.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: '`stock.txt` holds `item,count` per line. Print the name of every item whose count is 0, one per line. Print nothing if there are none.',
                id: '`stok.txt` berisi `barang,jumlah` per baris. Cetak nama tiap barang yang jumlahnya 0, satu per baris. Jangan cetak apa pun bila tidak ada.',
              },
              starter: { en: '# stock.txt has been prepared for you\n', id: '# stok.txt sudah disiapkan untukmu\n' },
              tests: {
                en: [
                  {
                    name: { en: 'One item is out of stock', id: 'Satu barang habis' },
                    setup: 'with open("stock.txt", "w") as _f:\n    _f.write("pencil,4\\nbook,0\\nbag,7\\n")',
                    expectOutput: 'book',
                  },
                  {
                    name: { en: 'Two items are out of stock', id: 'Dua barang habis' },
                    setup: 'with open("stock.txt", "w") as _f:\n    _f.write("pen,0\\nbook,0\\nbag,2\\n")',
                    expectOutput: 'pen\nbook',
                  },
                  {
                    name: { en: 'Nothing is out of stock', id: 'Tidak ada yang habis' },
                    setup: 'with open("stock.txt", "w") as _f:\n    _f.write("pen,3\\nbook,1\\n")',
                    expectOutput: '',
                  },
                ],
                id: [
                  {
                    name: { en: 'One item is out of stock', id: 'Satu barang habis' },
                    setup: 'with open("stok.txt", "w") as _f:\n    _f.write("pensil,4\\nbuku,0\\ntas,7\\n")',
                    expectOutput: 'buku',
                  },
                  {
                    name: { en: 'Two items are out of stock', id: 'Dua barang habis' },
                    setup: 'with open("stok.txt", "w") as _f:\n    _f.write("pena,0\\nbuku,0\\ntas,2\\n")',
                    expectOutput: 'pena\nbuku',
                  },
                  {
                    name: { en: 'Nothing is out of stock', id: 'Tidak ada yang habis' },
                    setup: 'with open("stok.txt", "w") as _f:\n    _f.write("pena,3\\nbuku,1\\n")',
                    expectOutput: '',
                  },
                ],
              },
              hints: [
                { en: 'Loop the file, strip, then split on the comma.', id: 'Ulangi berkasnya, strip, lalu split pada komanya.' },
                { en: 'Skip a line that is empty after stripping.', id: 'Lewati baris yang kosong setelah di-strip.' },
                { en: 'name, count = line.strip().split(",") then if int(count) == 0:', id: 'nama, jumlah = baris.strip().split(",") lalu if int(jumlah) == 0:' },
              ],
              solution: {
                en: 'with open("stock.txt") as f:\n    for line in f:\n        if not line.strip():\n            continue\n        name, count = line.strip().split(",")\n        if int(count) == 0:\n            print(name)',
                id: 'with open("stok.txt") as f:\n    for baris in f:\n        if not baris.strip():\n            continue\n        nama, jumlah = baris.strip().split(",")\n        if int(jumlah) == 0:\n            print(nama)',
              },
            },
          ],
        },
      ],
      project: {
        id: 'py-m7-s2-p',
        title: { en: 'Class register', id: 'Daftar nilai kelas' },
        brief: {
          en: 'Load a table of students from a file and report on it.',
          id: 'Muat tabel siswa dari sebuah berkas lalu laporkan isinya.',
        },
        requirements: [
          { en: '`class.txt` holds `name,score` per line. Blank lines must be ignored.', id: '`kelas.txt` berisi `nama,nilai` per baris. Baris kosong harus diabaikan.' },
          { en: 'Print `Number of students: N`.', id: 'Cetak `Jumlah siswa: N`.' },
          { en: 'Print `Average: R`, rounded to one decimal.', id: 'Cetak `Rata-rata: R`, dibulatkan satu desimal.' },
          { en: 'Print `Highest: <name> (<score>)`.', id: 'Cetak `Tertinggi: <nama> (<nilai>)`.' },
          { en: 'Then write only the names scoring 70 or more into `passed.txt`, one per line.', id: 'Lalu tulis hanya nama yang bernilai 70 ke atas ke `lulus.txt`, satu per baris.' },
          { en: 'If the file is missing, print only `File not found`.', id: 'Bila berkasnya tidak ada, cetak hanya `Berkas tidak ditemukan`.' },
        ],
        starter: { en: '# Class register\n', id: '# Daftar nilai kelas\n' },
        tests: {
          en: [
            {
              name: { en: 'Three students', id: 'Tiga siswa' },
              setup:
                'import os\nwith open("class.txt", "w") as _f:\n    _f.write("Ani,80\\nBudi,65\\nCitra,95\\n")\nif os.path.exists("passed.txt"):\n    os.remove("passed.txt")',
              expectOutput: 'Number of students: 3\nAverage: 80.0\nHighest: Citra (95)',
            },
            {
              name: { en: 'passed.txt holds only the passers', id: 'lulus.txt hanya berisi yang lulus' },
              setup:
                'import os\nwith open("class.txt", "w") as _f:\n    _f.write("Ani,80\\nBudi,65\\nCitra,95\\n")\nif os.path.exists("passed.txt"):\n    os.remove("passed.txt")',
              assert:
                'with open("passed.txt") as _f:\n    _content = _f.read().split()\nassert _content == ["Ani", "Citra"], "passed.txt is not right: " + repr(_content)',
            },
            {
              name: { en: 'Blank lines are ignored', id: 'Baris kosong diabaikan' },
              setup:
                'import os\nwith open("class.txt", "w") as _f:\n    _f.write("Ani,70\\n\\nBudi,90\\n\\n")\nif os.path.exists("passed.txt"):\n    os.remove("passed.txt")',
              expectOutput: 'Number of students: 2\nAverage: 80.0\nHighest: Budi (90)',
            },
            {
              name: { en: 'A missing file', id: 'Berkas tidak ada' },
              setup: 'import os\nif os.path.exists("class.txt"):\n    os.remove("class.txt")',
              expectOutput: 'File not found',
            },
          ],
          id: [
            {
              name: { en: 'Three students', id: 'Tiga siswa' },
              setup:
                'import os\nwith open("kelas.txt", "w") as _f:\n    _f.write("Ani,80\\nBudi,65\\nCitra,95\\n")\nif os.path.exists("lulus.txt"):\n    os.remove("lulus.txt")',
              expectOutput: 'Jumlah siswa: 3\nRata-rata: 80.0\nTertinggi: Citra (95)',
            },
            {
              name: { en: 'lulus.txt holds only the passers', id: 'lulus.txt hanya berisi yang lulus' },
              setup:
                'import os\nwith open("kelas.txt", "w") as _f:\n    _f.write("Ani,80\\nBudi,65\\nCitra,95\\n")\nif os.path.exists("lulus.txt"):\n    os.remove("lulus.txt")',
              assert:
                'with open("lulus.txt") as _f:\n    _isi = _f.read().split()\nassert _isi == ["Ani", "Citra"], "lulus.txt belum sesuai: " + repr(_isi)',
            },
            {
              name: { en: 'Blank lines are ignored', id: 'Baris kosong diabaikan' },
              setup:
                'import os\nwith open("kelas.txt", "w") as _f:\n    _f.write("Ani,70\\n\\nBudi,90\\n\\n")\nif os.path.exists("lulus.txt"):\n    os.remove("lulus.txt")',
              expectOutput: 'Jumlah siswa: 2\nRata-rata: 80.0\nTertinggi: Budi (90)',
            },
            {
              name: { en: 'A missing file', id: 'Berkas tidak ada' },
              setup: 'import os\nif os.path.exists("kelas.txt"):\n    os.remove("kelas.txt")',
              expectOutput: 'Berkas tidak ditemukan',
            },
          ],
        },
        hints: [
          { en: 'Wrap the whole read in try/except FileNotFoundError.', id: 'Bungkus seluruh pembacaan dalam try/except FileNotFoundError.' },
          { en: 'Load into a list of dictionaries first; reporting is easier once the data is in memory.', id: 'Muat dulu ke list berisi dictionary; pelaporan lebih mudah setelah datanya di memori.' },
          { en: 'For the highest score, keep the best row as you loop, like `best_student` in module 5.', id: 'Untuk nilai tertinggi, simpan baris terbaik sambil mengulang, seperti `terbaik` di modul 5.' },
          { en: 'Write the passers in a second pass, with mode "w".', id: 'Tulis yang lulus pada tahap kedua, dengan mode "w".' },
        ],
        solution: {
          en: 'try:\n    data = []\n    with open("class.txt") as f:\n        for line in f:\n            if not line.strip():\n                continue\n            name, score = line.strip().split(",")\n            data.append({"name": name, "score": int(score)})\nexcept FileNotFoundError:\n    print("File not found")\nelse:\n    print(f"Number of students: {len(data)}")\n    total = sum(d["score"] for d in data)\n    print(f"Average: {round(total / len(data), 1)}")\n\n    best = data[0]\n    for d in data:\n        if d["score"] > best["score"]:\n            best = d\n    print(f"Highest: {best[\'name\']} ({best[\'score\']})")\n\n    with open("passed.txt", "w") as f:\n        for d in data:\n            if d["score"] >= 70:\n                f.write(d["name"] + "\\n")',
          id: 'try:\n    data = []\n    with open("kelas.txt") as f:\n        for baris in f:\n            if not baris.strip():\n                continue\n            nama, nilai = baris.strip().split(",")\n            data.append({"nama": nama, "nilai": int(nilai)})\nexcept FileNotFoundError:\n    print("Berkas tidak ditemukan")\nelse:\n    print(f"Jumlah siswa: {len(data)}")\n    total = sum(d["nilai"] for d in data)\n    print(f"Rata-rata: {round(total / len(data), 1)}")\n\n    terbaik = data[0]\n    for d in data:\n        if d["nilai"] > terbaik["nilai"]:\n            terbaik = d\n    print(f"Tertinggi: {terbaik[\'nama\']} ({terbaik[\'nilai\']})")\n\n    with open("lulus.txt", "w") as f:\n        for d in data:\n            if d["nilai"] >= 70:\n                f.write(d["nama"] + "\\n")',
        },
        xp: 50,
      },
    },
  ],
}
