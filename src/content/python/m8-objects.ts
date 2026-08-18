import type { Module } from '../types'

/** Module 8 — objects.
 *  The learner already keeps related values together in dictionaries; a class is
 *  the step where the data and the functions that act on it move in together. */
export const module8: Module = {
  id: 'py-m8',
  title: { en: 'Objects', id: 'Objek' },
  summary: {
    en: 'Keep data and the functions that work on it in one place.',
    id: 'Menyatukan data dan fungsi yang mengolahnya di satu tempat.',
  },
  submodules: [
    /* ------------------------------------------------------ 8.1 class & state */
    {
      id: 'py-m8-s1',
      title: { en: 'Classes and Instances', id: 'Class dan Instance' },
      summary: {
        en: 'Write the blueprint once, then stamp out as many as you need.',
        id: 'Tulis cetak birunya sekali, lalu cetak sebanyak yang kamu butuhkan.',
      },
      lessons: [
        {
          id: 'py-m8-s1-l1',
          title: { en: 'A blueprint for data', id: 'Cetak biru untuk data' },
          goal: { en: 'Define a class and create objects from it.', id: 'Mendefinisikan class dan membuat objek darinya.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The dictionary that got tired', id: 'Dictionary yang kelelahan' },
              body: {
                en: 'A dictionary per student works, but nothing stops a typo like `"nma"`, and nothing says which keys a student is supposed to have. A `class` writes that down once.',
                id: 'Satu dictionary per siswa memang bisa, tetapi tidak ada yang mencegah salah ketik seperti `"nma"`, dan tidak ada yang menyatakan kunci apa saja yang seharusnya dimiliki seorang siswa. Sebuah `class` menuliskannya sekali.',
              },
              code: 'class Siswa:\n    def __init__(self, nama, nilai):\n        self.nama = nama\n        self.nilai = nilai\n\nani = Siswa("Ani", 80)\nprint(ani.nama)\nprint(ani.nilai)',
              output: 'Ani\n80',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: '__init__ runs at birth', id: '__init__ jalan saat kelahiran' },
              body: {
                en: 'Calling `Siswa("Ani", 80)` creates a new object and immediately runs `__init__` on it. `self` is that new object — the lines inside are what fill it in.',
                id: 'Memanggil `Siswa("Ani", 80)` membuat objek baru dan langsung menjalankan `__init__` padanya. `self` adalah objek baru itu — baris di dalamnya yang mengisinya.',
              },
              code: 'class Siswa:\n    def __init__(self, nama, nilai):\n        print("membuat", nama)\n        self.nama = nama\n        self.nilai = nilai\n\na = Siswa("Ani", 80)\nb = Siswa("Budi", 65)',
              output: 'membuat Ani\nmembuat Budi',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Each object holds its own values', id: 'Tiap objek menyimpan nilainya sendiri' },
              body: {
                en: 'Two objects from the same class are entirely separate. Changing one leaves the other untouched — that separation is the whole point.',
                id: 'Dua objek dari class yang sama benar-benar terpisah. Mengubah satu tidak menyentuh yang lain — pemisahan itulah inti seluruhnya.',
              },
              code: 'a = Siswa("Ani", 80)\nb = Siswa("Budi", 65)\na.nilai = 90\nprint(a.nilai)\nprint(b.nilai)',
              output: '90\n65',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: 'class Kotak:\n    def __init__(self, isi):\n        self.isi = isi\n\nx = Kotak("buku")\ny = Kotak("pena")\nprint(x.isi)',
              options: [
                { en: 'buku', id: 'buku' },
                { en: 'pena', id: 'pena' },
                { en: 'buku pena', id: 'buku pena' },
                { en: 'An error', id: 'Error' },
              ],
              answer: 0,
              explain: {
                en: 'x and y are separate objects. x kept the value it was created with.',
                id: 'x dan y adalah objek terpisah. x menyimpan nilai yang diberikan saat ia dibuat.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the class so `Buku("Python", 120)` works.',
                id: 'Lengkapi class-nya agar `Buku("Python", 120)` berfungsi.',
              },
              template: 'class Buku:\n    def ___(self, judul, halaman):\n        ___.judul = judul\n        self.halaman = halaman',
              blanks: ['__init__', 'self'],
              explain: {
                en: '__init__ is the method Python calls on creation; self is the object being filled in.',
                id: '__init__ adalah method yang dipanggil Python saat pembuatan; self adalah objek yang sedang diisi.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Write a class `Produk` taking `nama` and `harga`. Create `Produk("Pensil", 3000)` into a variable `p` and print the name and price on two lines.',
                id: 'Tulis class `Produk` yang menerima `nama` dan `harga`. Buat `Produk("Pensil", 3000)` ke variabel `p` lalu cetak nama dan harganya dalam dua baris.',
              },
              starter: 'class Produk:\n    pass\n',
              tests: [
                { name: { en: 'Prints Pensil then 3000', id: 'Mencetak Pensil lalu 3000' }, expectOutput: 'Pensil\n3000' },
                {
                  name: { en: 'Works for another product too', id: 'Berfungsi untuk produk lain juga' },
                  assert:
                    'lain = Produk("Buku", 15000)\nassert lain.nama == "Buku" and lain.harga == 15000, "atribut belum tersimpan dengan benar"',
                },
              ],
              hints: [
                { en: 'Replace pass with a def __init__ line.', id: 'Ganti pass dengan baris def __init__.' },
                { en: 'def __init__(self, nama, harga): then two self. assignments.', id: 'def __init__(self, nama, harga): lalu dua penetapan self.' },
                { en: 'print(p.nama) and print(p.harga)', id: 'print(p.nama) dan print(p.harga)' },
              ],
              solution:
                'class Produk:\n    def __init__(self, nama, harga):\n        self.nama = nama\n        self.harga = harga\n\np = Produk("Pensil", 3000)\nprint(p.nama)\nprint(p.harga)',
            },
          ],
        },
        {
          id: 'py-m8-s1-l2',
          title: { en: 'Objects that do things', id: 'Objek yang bisa bertindak' },
          goal: { en: 'Give a class its own functions.', id: 'Memberi class fungsinya sendiri.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A method is a function that belongs', id: 'Method adalah fungsi yang menempel' },
              body: {
                en: 'Write the function inside the class and it can reach the object through `self`. You no longer pass the data in — the object already has it.',
                id: 'Tulis fungsinya di dalam class dan ia bisa menjangkau objeknya lewat `self`. Kamu tidak perlu lagi mengoper datanya — objeknya sudah memilikinya.',
              },
              code: 'class Siswa:\n    def __init__(self, nama, nilai):\n        self.nama = nama\n        self.nilai = nilai\n\n    def lulus(self):\n        return self.nilai >= 70\n\nani = Siswa("Ani", 80)\nprint(ani.lulus())',
              output: 'True',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Methods can change the object', id: 'Method bisa mengubah objeknya' },
              body: {
                en: 'Assigning to `self.something` inside a method changes that object for good. This is how an object grows a history instead of just holding a snapshot.',
                id: 'Menetapkan nilai ke `self.sesuatu` di dalam method mengubah objek itu secara permanen. Beginilah objek memiliki riwayat, bukan sekadar menyimpan potret sesaat.',
              },
              code: 'class Keranjang:\n    def __init__(self):\n        self.isi = []\n\n    def tambah(self, barang):\n        self.isi.append(barang)\n\nk = Keranjang()\nk.tambah("pensil")\nk.tambah("buku")\nprint(k.isi)',
              output: "['pensil', 'buku']",
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: '__str__ decides how it prints', id: '__str__ menentukan cara ia tercetak' },
              body: {
                en: 'Printing an object without `__str__` gives something unreadable. Define it and `print()` shows whatever you return.',
                id: 'Mencetak objek tanpa `__str__` menghasilkan sesuatu yang tak terbaca. Definisikan ia dan `print()` menampilkan apa pun yang kamu kembalikan.',
              },
              code: 'class Siswa:\n    def __init__(self, nama, nilai):\n        self.nama = nama\n        self.nilai = nilai\n\n    def __str__(self):\n        return f"{self.nama}: {self.nilai}"\n\nprint(Siswa("Ani", 80))',
              output: 'Ani: 80',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: 'class Hitung:\n    def __init__(self):\n        self.n = 0\n\n    def naik(self):\n        self.n += 1\n\nh = Hitung()\nh.naik()\nh.naik()\nprint(h.n)',
              options: [
                { en: '2', id: '2' },
                { en: '0', id: '0' },
                { en: '1', id: '1' },
                { en: 'None', id: 'None' },
              ],
              answer: 0,
              explain: {
                en: 'Each call changes the same object, so the two increments both stick.',
                id: 'Tiap pemanggilan mengubah objek yang sama, jadi kedua penambahan itu tersimpan.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a class whose object prints as `Pensil - 3000`.',
                id: 'Susun class yang objeknya tercetak sebagai `Pensil - 3000`.',
              },
              lines: [
                'class Produk:',
                '    def __init__(self, nama, harga):',
                '        self.nama = nama',
                '        self.harga = harga',
                '',
                '    def __str__(self):',
                '        return f"{self.nama} - {self.harga}"',
              ],
              explain: {
                en: '__init__ stores the values; __str__ is a second method at the same indentation, reading them back.',
                id: '__init__ menyimpan nilainya; __str__ adalah method kedua pada indentasi yang sama, yang membacanya kembali.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Write a class `Tabungan` starting at 0. `setor(n)` adds, `tarik(n)` subtracts but returns `False` and changes nothing when the balance is too small, otherwise returns `True`. `saldo` holds the current amount.',
                id: 'Tulis class `Tabungan` yang mulai dari 0. `setor(n)` menambah, `tarik(n)` mengurangi tetapi mengembalikan `False` dan tidak mengubah apa pun bila saldonya kurang, selain itu mengembalikan `True`. `saldo` menyimpan jumlah saat ini.',
              },
              starter: 'class Tabungan:\n    def __init__(self):\n        self.saldo = 0\n',
              tests: [
                {
                  name: { en: 'Deposits add up', id: 'Setoran bertambah' },
                  assert: 't = Tabungan()\nt.setor(1000)\nt.setor(500)\nassert t.saldo == 1500, "saldo setelah dua setoran harus 1500"',
                },
                {
                  name: { en: 'A valid withdrawal', id: 'Penarikan yang sah' },
                  assert:
                    't = Tabungan()\nt.setor(1000)\nassert t.tarik(400) is True, "penarikan yang sah harus True"\nassert t.saldo == 600, "saldo harus 600"',
                },
                {
                  name: { en: 'Withdrawing too much changes nothing', id: 'Menarik terlalu banyak tidak mengubah apa pun' },
                  assert:
                    't = Tabungan()\nt.setor(100)\nassert t.tarik(500) is False, "penarikan berlebih harus False"\nassert t.saldo == 100, "saldo tidak boleh berubah"',
                },
              ],
              hints: [
                { en: 'setor is one line: self.saldo += n', id: 'setor cukup satu baris: self.saldo += n' },
                { en: 'tarik must check before it subtracts.', id: 'tarik harus memeriksa sebelum mengurangi.' },
                { en: 'if n > self.saldo: return False — then subtract and return True', id: 'if n > self.saldo: return False — lalu kurangi dan return True' },
              ],
              solution:
                'class Tabungan:\n    def __init__(self):\n        self.saldo = 0\n\n    def setor(self, n):\n        self.saldo += n\n\n    def tarik(self, n):\n        if n > self.saldo:\n            return False\n        self.saldo -= n\n        return True',
            },
          ],
        },
      ],
      project: {
        id: 'py-m8-s1-p',
        title: { en: 'Library book', id: 'Buku perpustakaan' },
        brief: {
          en: 'Model a book that can be borrowed and returned, and refuses the impossible.',
          id: 'Modelkan buku yang bisa dipinjam dan dikembalikan, dan menolak hal yang mustahil.',
        },
        requirements: [
          { en: '`Buku(judul, penulis)` starts available.', id: '`Buku(judul, penulis)` dimulai dalam keadaan tersedia.' },
          { en: '`tersedia` is True when nobody has it.', id: '`tersedia` bernilai True saat tidak ada yang meminjamnya.' },
          { en: '`pinjam(nama)` returns True and records `peminjam`; returns False if already borrowed.', id: '`pinjam(nama)` mengembalikan True dan mencatat `peminjam`; mengembalikan False bila sedang dipinjam.' },
          { en: '`kembalikan()` returns True and clears the borrower; returns False if it was not borrowed.', id: '`kembalikan()` mengembalikan True dan mengosongkan peminjam; mengembalikan False bila memang tidak dipinjam.' },
          { en: 'Printing it shows `Judul oleh Penulis (tersedia)` or `... (dipinjam Ani)`.', id: 'Mencetaknya menampilkan `Judul oleh Penulis (tersedia)` atau `... (dipinjam Ani)`.' },
        ],
        starter: '# Buku perpustakaan\nclass Buku:\n    def __init__(self, judul, penulis):\n        pass\n',
        tests: [
          {
            name: { en: 'A new book is available', id: 'Buku baru tersedia' },
            assert:
              'b = Buku("Python Dasar", "Nunada")\nassert b.tersedia is True, "buku baru harus tersedia"\nassert str(b) == "Python Dasar oleh Nunada (tersedia)", "cetakannya belum sesuai: " + str(b)',
          },
          {
            name: { en: 'Borrowing works once', id: 'Peminjaman berhasil sekali' },
            assert:
              'b = Buku("Python Dasar", "Nunada")\nassert b.pinjam("Ani") is True\nassert b.tersedia is False\nassert b.peminjam == "Ani"\nassert str(b) == "Python Dasar oleh Nunada (dipinjam Ani)", "cetakannya belum sesuai: " + str(b)',
          },
          {
            name: { en: 'Cannot borrow twice', id: 'Tidak bisa dipinjam dua kali' },
            assert:
              'b = Buku("X", "Y")\nb.pinjam("Ani")\nassert b.pinjam("Budi") is False, "buku yang sedang dipinjam harus menolak"\nassert b.peminjam == "Ani", "peminjam tidak boleh berganti"',
          },
          {
            name: { en: 'Returning works, but only once', id: 'Pengembalian berhasil, tapi hanya sekali' },
            assert:
              'b = Buku("X", "Y")\nb.pinjam("Ani")\nassert b.kembalikan() is True\nassert b.tersedia is True\nassert b.kembalikan() is False, "buku yang sudah kembali tidak bisa dikembalikan lagi"',
          },
        ],
        hints: [
          { en: 'Store the borrower as None when nobody has it.', id: 'Simpan peminjam sebagai None saat tidak ada yang meminjam.' },
          { en: '`tersedia` can be its own attribute, or derived from `peminjam is None`.', id: '`tersedia` boleh jadi atribut sendiri, atau diturunkan dari `peminjam is None`.' },
          { en: 'Guard first in both methods: refuse, then act.', id: 'Periksa dulu di kedua method: tolak, baru bertindak.' },
          {
            en: '__str__ needs an if, because the ending differs between the two states.',
            id: '__str__ butuh if, karena akhirannya berbeda antara dua keadaan itu.',
          },
        ],
        solution:
          'class Buku:\n    def __init__(self, judul, penulis):\n        self.judul = judul\n        self.penulis = penulis\n        self.peminjam = None\n        self.tersedia = True\n\n    def pinjam(self, nama):\n        if not self.tersedia:\n            return False\n        self.peminjam = nama\n        self.tersedia = False\n        return True\n\n    def kembalikan(self):\n        if self.tersedia:\n            return False\n        self.peminjam = None\n        self.tersedia = True\n        return True\n\n    def __str__(self):\n        if self.tersedia:\n            return f"{self.judul} oleh {self.penulis} (tersedia)"\n        return f"{self.judul} oleh {self.penulis} (dipinjam {self.peminjam})"',
        xp: 50,
      },
    },

    /* -------------------------------------------------- 8.2 many objects, reuse */
    {
      id: 'py-m8-s2',
      title: { en: 'Many Objects Together', id: 'Banyak Objek Bersama' },
      summary: {
        en: 'Collections of objects, and a class built on another class.',
        id: 'Kumpulan objek, dan class yang dibangun di atas class lain.',
      },
      lessons: [
        {
          id: 'py-m8-s2-l1',
          title: { en: 'A list of objects', id: 'List berisi objek' },
          goal: { en: 'Search and total across many objects.', id: 'Mencari dan menjumlah lintas banyak objek.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Objects go in lists like anything else', id: 'Objek masuk list seperti benda lain' },
              body: {
                en: 'Nothing new is needed. A list of objects loops the same way a list of numbers does — you just reach into each one with a dot.',
                id: 'Tidak ada yang baru. List berisi objek diulang dengan cara yang sama seperti list berisi angka — kamu hanya menjangkau isinya dengan titik.',
              },
              code: 'class Produk:\n    def __init__(self, nama, harga):\n        self.nama = nama\n        self.harga = harga\n\nrak = [Produk("Pensil", 3000), Produk("Buku", 15000)]\nfor p in rak:\n    print(p.nama, p.harga)',
              output: 'Pensil 3000\nBuku 15000',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'One class can hold the others', id: 'Satu class bisa menampung yang lain' },
              body: {
                en: 'When a list of objects always travels with the same operations, wrap it in a class of its own. The list stops being loose data and becomes something with rules.',
                id: 'Ketika sebuah list objek selalu bepergian bersama operasi yang sama, bungkus ia dalam class tersendiri. List-nya berhenti menjadi data lepas dan berubah jadi sesuatu yang punya aturan.',
              },
              code: 'class Toko:\n    def __init__(self):\n        self.rak = []\n\n    def tambah(self, produk):\n        self.rak.append(produk)\n\n    def total(self):\n        return sum(p.harga for p in self.rak)\n\nt = Toko()\nt.tambah(Produk("Pensil", 3000))\nt.tambah(Produk("Buku", 15000))\nprint(t.total())',
              output: '18000',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What does this print?', id: 'Apa yang dicetak ini?' },
              code: 'rak = [Produk("A", 100), Produk("B", 250)]\nmahal = [p.nama for p in rak if p.harga > 200]\nprint(mahal)',
              options: [
                { en: "['B']", id: "['B']" },
                { en: "['A']", id: "['A']" },
                { en: "['A', 'B']", id: "['A', 'B']" },
                { en: '[250]', id: '[250]' },
              ],
              answer: 0,
              explain: {
                en: 'The condition keeps only B, and the part before `for` decides that names are collected, not objects.',
                id: 'Kondisinya hanya menyisakan B, dan bagian sebelum `for` menentukan bahwa yang dikumpulkan adalah namanya, bukan objeknya.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Using the given `Produk`, write `termahal(rak)` returning the name of the priciest product, and `"kosong"` for an empty list.',
                id: 'Dengan `Produk` yang diberikan, tulis `termahal(rak)` yang mengembalikan nama produk paling mahal, dan `"kosong"` untuk list kosong.',
              },
              starter:
                'class Produk:\n    def __init__(self, nama, harga):\n        self.nama = nama\n        self.harga = harga\n\ndef termahal(rak):\n    pass\n',
              tests: [
                {
                  name: { en: 'Finds the priciest', id: 'Menemukan yang termahal' },
                  assert:
                    'rak = [Produk("Pensil", 3000), Produk("Buku", 15000), Produk("Tas", 9000)]\nassert termahal(rak) == "Buku", "harus mengembalikan Buku"',
                },
                {
                  name: { en: 'Handles an empty shelf', id: 'Menangani rak kosong' },
                  assert: 'assert termahal([]) == "kosong", "list kosong harus mengembalikan kosong"',
                },
                {
                  name: { en: 'Works with one product', id: 'Berfungsi dengan satu produk' },
                  assert: 'assert termahal([Produk("Pena", 500)]) == "Pena"',
                },
              ],
              hints: [
                { en: 'Guard the empty list before touching rak[0].', id: 'Amankan list kosong sebelum menyentuh rak[0].' },
                { en: 'Keep the best object so far as you loop, like `terbaik` in module 5.', id: 'Simpan objek terbaik sejauh ini sambil mengulang, seperti `terbaik` di modul 5.' },
                { en: 'if p.harga > terbaik.harga: terbaik = p — then return terbaik.nama', id: 'if p.harga > terbaik.harga: terbaik = p — lalu return terbaik.nama' },
              ],
              solution:
                'class Produk:\n    def __init__(self, nama, harga):\n        self.nama = nama\n        self.harga = harga\n\ndef termahal(rak):\n    if len(rak) == 0:\n        return "kosong"\n    terbaik = rak[0]\n    for p in rak:\n        if p.harga > terbaik.harga:\n            terbaik = p\n    return terbaik.nama',
            },
          ],
        },
        {
          id: 'py-m8-s2-l2',
          title: { en: 'Building on a class', id: 'Membangun di atas class' },
          goal: { en: 'Reuse a class and change one part.', id: 'Memakai ulang class dan mengubah satu bagiannya.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Inheritance copies the rest', id: 'Pewarisan menyalin sisanya' },
              body: {
                en: 'Writing the brackets `class Anak(Induk)` means: everything the parent has, the child has too. You only write what is different.',
                id: 'Menulis kurung `class Anak(Induk)` berarti: semua yang dimiliki induknya, dimiliki anaknya juga. Kamu hanya menulis yang berbeda.',
              },
              code: 'class Hewan:\n    def __init__(self, nama):\n        self.nama = nama\n\n    def suara(self):\n        return "..."\n\nclass Kucing(Hewan):\n    def suara(self):\n        return "meong"\n\nk = Kucing("Molly")\nprint(k.nama)\nprint(k.suara())',
              output: 'Molly\nmeong',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'super() calls the parent version', id: 'super() memanggil versi induknya' },
              body: {
                en: 'When the child needs everything the parent did *plus* something extra, call the parent with `super()` rather than copying its lines.',
                id: 'Ketika anak butuh semua yang dilakukan induknya *ditambah* sesuatu, panggil induknya dengan `super()` alih-alih menyalin barisnya.',
              },
              code: 'class Siswa:\n    def __init__(self, nama):\n        self.nama = nama\n\nclass Mahasiswa(Siswa):\n    def __init__(self, nama, nim):\n        super().__init__(nama)\n        self.nim = nim\n\nm = Mahasiswa("Ani", "2201")\nprint(m.nama, m.nim)',
              output: 'Ani 2201',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: 'class A:\n    def halo(self):\n        return "A"\n\nclass B(A):\n    pass\n\nprint(B().halo())',
              options: [
                { en: 'A — B inherited it', id: 'A — B mewarisinya' },
                { en: 'B', id: 'B' },
                { en: 'None', id: 'None' },
                { en: 'An error, B has no halo', id: 'Error, B tidak punya halo' },
              ],
              answer: 0,
              explain: {
                en: 'B defines nothing of its own, so it uses the parent method unchanged.',
                id: 'B tidak mendefinisikan apa pun sendiri, jadi ia memakai method induknya apa adanya.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Make `Persegi` inherit from `Bangun` and reuse the parent constructor.',
                id: 'Buat `Persegi` mewarisi `Bangun` dan memakai ulang konstruktor induknya.',
              },
              template:
                'class Bangun:\n    def __init__(self, nama):\n        self.nama = nama\n\nclass Persegi(___):\n    def __init__(self, sisi):\n        ___().__init__("persegi")\n        self.sisi = sisi',
              blanks: ['Bangun', 'super'],
              explain: {
                en: 'The brackets name the parent; super() reaches it without repeating its code.',
                id: 'Kurungnya menyebut induknya; super() menjangkaunya tanpa mengulang kodenya.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Given `Pegawai` with `nama` and `gaji` and a method `bayar()` returning the salary, write `Manajer(nama, gaji, bonus)` whose `bayar()` returns salary plus bonus.',
                id: 'Diberikan `Pegawai` dengan `nama` dan `gaji` serta method `bayar()` yang mengembalikan gajinya, tulis `Manajer(nama, gaji, bonus)` yang `bayar()`-nya mengembalikan gaji ditambah bonus.',
              },
              starter:
                'class Pegawai:\n    def __init__(self, nama, gaji):\n        self.nama = nama\n        self.gaji = gaji\n\n    def bayar(self):\n        return self.gaji\n\nclass Manajer(Pegawai):\n    pass\n',
              tests: [
                {
                  name: { en: 'Manager gets salary plus bonus', id: 'Manajer menerima gaji plus bonus' },
                  assert:
                    'm = Manajer("Ani", 5000, 1500)\nassert m.bayar() == 6500, "bayar() harus 6500"\nassert m.nama == "Ani", "nama harus diwarisi"',
                },
                {
                  name: { en: 'The parent is untouched', id: 'Induknya tidak berubah' },
                  assert: 'p = Pegawai("Budi", 4000)\nassert p.bayar() == 4000, "Pegawai biasa tidak boleh dapat bonus"',
                },
                {
                  name: { en: 'A Manager is still a Pegawai', id: 'Manajer tetap seorang Pegawai' },
                  assert: 'assert isinstance(Manajer("X", 1, 2), Pegawai), "Manajer harus mewarisi Pegawai"',
                },
              ],
              hints: [
                { en: 'Manajer needs its own __init__ because it takes an extra value.', id: 'Manajer butuh __init__ sendiri karena ia menerima satu nilai tambahan.' },
                { en: 'super().__init__(nama, gaji) handles the two inherited ones.', id: 'super().__init__(nama, gaji) mengurus dua nilai warisannya.' },
                { en: 'Override bayar: return super().bayar() + self.bonus', id: 'Timpa bayar: return super().bayar() + self.bonus' },
              ],
              solution:
                'class Pegawai:\n    def __init__(self, nama, gaji):\n        self.nama = nama\n        self.gaji = gaji\n\n    def bayar(self):\n        return self.gaji\n\nclass Manajer(Pegawai):\n    def __init__(self, nama, gaji, bonus):\n        super().__init__(nama, gaji)\n        self.bonus = bonus\n\n    def bayar(self):\n        return super().bayar() + self.bonus',
            },
          ],
        },
      ],
      project: {
        id: 'py-m8-s2-p',
        title: { en: 'Shopping cart', id: 'Keranjang belanja' },
        brief: {
          en: 'Two classes working together: items, and the cart that holds them.',
          id: 'Dua class yang bekerja sama: barangnya, dan keranjang yang menampungnya.',
        },
        requirements: [
          { en: '`Barang(nama, harga, jumlah)` with `subtotal()` returning price times quantity.', id: '`Barang(nama, harga, jumlah)` dengan `subtotal()` yang mengembalikan harga kali jumlah.' },
          { en: '`Keranjang()` starts empty; `tambah(barang)` puts one in.', id: '`Keranjang()` mulai kosong; `tambah(barang)` memasukkan satu.' },
          { en: '`total()` returns the sum of every subtotal.', id: '`total()` mengembalikan jumlah seluruh subtotal.' },
          { en: '`hapus(nama)` removes by name and returns True, or False when it is not there.', id: '`hapus(nama)` menghapus berdasarkan nama dan mengembalikan True, atau False bila tidak ada.' },
          { en: '`termahal()` returns the name of the item with the biggest subtotal, or None when empty.', id: '`termahal()` mengembalikan nama barang dengan subtotal terbesar, atau None bila kosong.' },
          { en: 'Printing the cart gives `Keranjang: 3 barang, total 25000`.', id: 'Mencetak keranjangnya menghasilkan `Keranjang: 3 barang, total 25000`.' },
        ],
        starter:
          '# Keranjang belanja\nclass Barang:\n    def __init__(self, nama, harga, jumlah):\n        pass\n\nclass Keranjang:\n    def __init__(self):\n        pass\n',
        tests: [
          {
            name: { en: 'subtotal multiplies', id: 'subtotal mengalikan' },
            assert: 'b = Barang("Pensil", 3000, 2)\nassert b.subtotal() == 6000, "subtotal harus 6000"',
          },
          {
            name: { en: 'total adds every item', id: 'total menjumlah semua barang' },
            assert:
              'k = Keranjang()\nk.tambah(Barang("Pensil", 3000, 2))\nk.tambah(Barang("Buku", 15000, 1))\nassert k.total() == 21000, "total harus 21000"',
          },
          {
            name: { en: 'hapus reports what happened', id: 'hapus melaporkan hasilnya' },
            assert:
              'k = Keranjang()\nk.tambah(Barang("Pensil", 3000, 2))\nassert k.hapus("Pensil") is True\nassert k.total() == 0, "keranjang harus kosong setelah dihapus"\nassert k.hapus("Tas") is False, "barang yang tidak ada harus False"',
          },
          {
            name: { en: 'termahal uses the subtotal', id: 'termahal memakai subtotalnya' },
            assert:
              'k = Keranjang()\nk.tambah(Barang("Pensil", 3000, 10))\nk.tambah(Barang("Buku", 15000, 1))\nassert k.termahal() == "Pensil", "30000 lebih besar dari 15000"\nassert Keranjang().termahal() is None, "keranjang kosong harus None"',
          },
          {
            name: { en: 'Printing the cart', id: 'Mencetak keranjangnya' },
            assert:
              'k = Keranjang()\nk.tambah(Barang("Pensil", 3000, 2))\nk.tambah(Barang("Buku", 15000, 1))\nassert str(k) == "Keranjang: 2 barang, total 21000", "cetakannya belum sesuai: " + str(k)',
          },
        ],
        hints: [
          { en: 'Barang only needs three attributes and one small method.', id: 'Barang hanya butuh tiga atribut dan satu method kecil.' },
          { en: 'Keranjang holds a list — that list is the whole state.', id: 'Keranjang menyimpan sebuah list — list itulah seluruh keadaannya.' },
          { en: 'For hapus, loop the list and remove the first match, then return True.', id: 'Untuk hapus, ulangi list-nya dan buang yang pertama cocok, lalu return True.' },
          {
            en: '`Keranjang: 2 barang` counts entries, not quantities: len(self.isi)',
            id: '`Keranjang: 2 barang` menghitung entrinya, bukan jumlahnya: len(self.isi)',
          },
        ],
        solution:
          'class Barang:\n    def __init__(self, nama, harga, jumlah):\n        self.nama = nama\n        self.harga = harga\n        self.jumlah = jumlah\n\n    def subtotal(self):\n        return self.harga * self.jumlah\n\nclass Keranjang:\n    def __init__(self):\n        self.isi = []\n\n    def tambah(self, barang):\n        self.isi.append(barang)\n\n    def total(self):\n        return sum(b.subtotal() for b in self.isi)\n\n    def hapus(self, nama):\n        for b in self.isi:\n            if b.nama == nama:\n                self.isi.remove(b)\n                return True\n        return False\n\n    def termahal(self):\n        if not self.isi:\n            return None\n        terbaik = self.isi[0]\n        for b in self.isi:\n            if b.subtotal() > terbaik.subtotal():\n                terbaik = b\n        return terbaik.nama\n\n    def __str__(self):\n        return f"Keranjang: {len(self.isi)} barang, total {self.total()}"',
        xp: 50,
      },
    },
  ],
}
