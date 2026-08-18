import type { Module } from '../types'

/** Module 6 — the first module about programs that survive bad input.
 *  Everything before this assumed the user cooperates; this one stops assuming. */
export const module6: Module = {
  id: 'py-m6',
  title: { en: 'When Things Go Wrong', id: 'Ketika Terjadi Kesalahan' },
  summary: {
    en: 'Catch errors instead of crashing, and refuse bad data on the way in.',
    id: 'Menangkap error alih-alih berhenti mendadak, dan menolak data buruk sejak awal.',
  },
  submodules: [
    /* --------------------------------------------------------- 6.1 try/except */
    {
      id: 'py-m6-s1',
      title: { en: 'try and except', id: 'try dan except' },
      summary: {
        en: 'Let a risky line fail without taking the whole program down.',
        id: 'Biarkan baris berisiko gagal tanpa menjatuhkan seluruh program.',
      },
      lessons: [
        {
          id: 'py-m6-s1-l1',
          title: { en: 'Catching a crash', id: 'Menangkap kegagalan' },
          goal: { en: 'Keep running after an error.', id: 'Tetap berjalan setelah error.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'An error stops everything', id: 'Error menghentikan segalanya' },
              body: {
                en: 'Until now an error ended the program on the spot — every line after it was skipped. `int("abc")` is the classic case: the user types something that is not a number, and the whole thing falls over.',
                id: 'Sampai sekarang, error mengakhiri program saat itu juga — semua baris setelahnya dilewati. `int("abc")` adalah kasus klasiknya: pengguna mengetik sesuatu yang bukan angka, dan semuanya runtuh.',
              },
              code: 'n = int("abc")\nprint("baris ini tidak pernah jalan")',
              output: "ValueError: invalid literal for int() with base 10: 'abc'",
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'try runs it, except catches it', id: 'try menjalankan, except menangkap' },
              body: {
                en: 'Put the risky line under `try`. If it raises, Python jumps to `except` instead of stopping. The program keeps going.',
                id: 'Taruh baris berisikonya di bawah `try`. Kalau gagal, Python melompat ke `except` alih-alih berhenti. Programnya tetap berjalan.',
              },
              code: 'try:\n    n = int("abc")\n    print("berhasil")\nexcept ValueError:\n    print("bukan angka")\n\nprint("program lanjut")',
              output: 'bukan angka\nprogram lanjut',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'The names of common failures', id: 'Nama-nama kegagalan yang umum' },
              body: {
                en: 'Each kind of failure has a name. `ValueError` is the right type but an impossible value, `ZeroDivisionError` speaks for itself, `KeyError` is a missing dictionary key, `IndexError` a position past the end of a list.',
                id: 'Tiap jenis kegagalan punya nama. `ValueError` berarti tipenya benar tapi nilainya mustahil, `ZeroDivisionError` sudah jelas, `KeyError` adalah kunci dictionary yang tidak ada, `IndexError` adalah posisi melewati ujung list.',
              },
              code: 'try:\n    print(10 / 0)\nexcept ZeroDivisionError:\n    print("tidak bisa dibagi nol")',
              output: 'tidak bisa dibagi nol',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: 'try:\n    x = int("7")\n    print("A")\nexcept ValueError:\n    print("B")\nprint("C")',
              options: [
                { en: 'A then C', id: 'A lalu C' },
                { en: 'B then C', id: 'B lalu C' },
                { en: 'A, B, then C', id: 'A, B, lalu C' },
                { en: 'C only', id: 'Hanya C' },
              ],
              answer: 0,
              explain: {
                en: '"7" converts fine, so nothing is raised and except is skipped entirely.',
                id: '"7" berhasil dikonversi, jadi tidak ada error dan except dilewati sepenuhnya.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Catch the division by zero and print `tak hingga` instead.',
                id: 'Tangkap pembagian nol dan cetak `tak hingga` sebagai gantinya.',
              },
              template: '___:\n    print(5 / 0)\n___ ZeroDivisionError:\n    print("tak hingga")',
              blanks: ['try', 'except'],
              explain: {
                en: 'try wraps the risky line; except names the failure it will handle.',
                id: 'try membungkus baris berisiko; except menyebut kegagalan yang akan ditanganinya.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Read one line of input. Print the number doubled if it is a number, otherwise print `Bukan angka`.',
                id: 'Baca satu baris input. Cetak angkanya dikali dua jika berupa angka, selain itu cetak `Bukan angka`.',
              },
              starter: 'teks = input("Angka: ")\n',
              tests: [
                { name: { en: '"5" gives 10', id: '"5" menghasilkan 10' }, stdin: ['5'], expectOutput: '10' },
                {
                  name: { en: '"abc" gives Bukan angka', id: '"abc" menghasilkan Bukan angka' },
                  stdin: ['abc'],
                  expectOutput: 'Bukan angka',
                },
                { name: { en: '"-3" gives -6', id: '"-3" menghasilkan -6' }, stdin: ['-3'], expectOutput: '-6' },
                {
                  name: { en: 'An empty line is refused', id: 'Baris kosong ditolak' },
                  stdin: [''],
                  expectOutput: 'Bukan angka',
                },
              ],
              hints: [
                { en: 'The conversion is the risky part, so it goes inside try.', id: 'Konversinya bagian yang berisiko, jadi ia masuk ke dalam try.' },
                { en: 'except ValueError: is the one int() raises.', id: 'except ValueError: adalah yang dimunculkan int().' },
                {
                  en: 'try: n = int(teks) then print(n * 2) — except ValueError: then print("Bukan angka")',
                  id: 'try: n = int(teks) lalu print(n * 2) — except ValueError: lalu print("Bukan angka")',
                },
              ],
              solution:
                'teks = input("Angka: ")\ntry:\n    n = int(teks)\n    print(n * 2)\nexcept ValueError:\n    print("Bukan angka")',
            },
          ],
        },
        {
          id: 'py-m6-s1-l2',
          title: { en: 'Catching the right thing', id: 'Menangkap yang tepat' },
          goal: { en: 'Handle several failures separately.', id: 'Menangani beberapa kegagalan secara terpisah.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'One except per failure', id: 'Satu except per kegagalan' },
              body: {
                en: 'A block can have several `except` clauses. Python runs the first one that matches, so each kind of failure gets its own message.',
                id: 'Sebuah blok boleh punya beberapa klausa `except`. Python menjalankan yang pertama cocok, jadi tiap jenis kegagalan dapat pesannya sendiri.',
              },
              code: 'def bagi(a, b):\n    try:\n        return int(a) / int(b)\n    except ValueError:\n        return "bukan angka"\n    except ZeroDivisionError:\n        return "tidak bisa dibagi nol"\n\nprint(bagi("10", "2"))\nprint(bagi("x", "2"))\nprint(bagi("10", "0"))',
              output: '5.0\nbukan angka\ntidak bisa dibagi nol',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Do not catch everything', id: 'Jangan tangkap semuanya' },
              body: {
                en: 'A bare `except:` swallows every error, including your own typos, and hides the bug you actually need to see. Name the failure you expected. `as e` gives you the message Python would have shown.',
                id: '`except:` polos menelan semua error, termasuk salah ketikmu sendiri, dan menyembunyikan bug yang justru perlu kamu lihat. Sebutkan kegagalan yang kamu perkirakan. `as e` memberimu pesan yang tadinya akan ditampilkan Python.',
              },
              code: 'try:\n    n = int("abc")\nexcept ValueError as e:\n    print("gagal:", e)',
              output: "gagal: invalid literal for int() with base 10: 'abc'",
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: 'data = {"a": 1}\ntry:\n    print(data["b"])\nexcept ValueError:\n    print("nilai salah")\nexcept KeyError:\n    print("kunci tidak ada")',
              options: [
                { en: 'kunci tidak ada', id: 'kunci tidak ada' },
                { en: 'nilai salah', id: 'nilai salah' },
                { en: 'None', id: 'None' },
                { en: 'Both messages', id: 'Kedua pesan' },
              ],
              answer: 0,
              explain: {
                en: 'A missing key raises KeyError, so the ValueError clause does not match and only one branch runs.',
                id: 'Kunci yang tidak ada memunculkan KeyError, jadi klausa ValueError tidak cocok dan hanya satu cabang yang jalan.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a lookup that survives a missing position.',
                id: 'Susun pencarian yang selamat dari posisi yang tidak ada.',
              },
              lines: [
                'angka = [1, 2, 3]',
                'try:',
                '    print(angka[10])',
                'except IndexError:',
                '    print("posisi tidak ada")',
              ],
              explain: {
                en: 'The risky access sits inside try; the handler names IndexError because that is what a list raises.',
                id: 'Akses berisikonya ada di dalam try; penanganannya menyebut IndexError karena itulah yang dimunculkan list.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Write `aman_bagi(a, b)` returning `a / b`, but the text `nol` when b is 0, and `bukan angka` when either value cannot be converted with `float()`.',
                id: 'Tulis `aman_bagi(a, b)` yang mengembalikan `a / b`, tetapi teks `nol` bila b bernilai 0, dan `bukan angka` bila salah satu nilainya tidak bisa dikonversi dengan `float()`.',
              },
              starter: 'def aman_bagi(a, b):\n    pass\n',
              tests: [
                {
                  name: { en: 'Normal division', id: 'Pembagian biasa' },
                  assert:
                    'assert aman_bagi("10", "4") == 2.5, "10 / 4 harus 2.5"\nassert aman_bagi(9, 3) == 3.0, "angka biasa juga harus jalan"',
                },
                {
                  name: { en: 'Divide by zero', id: 'Dibagi nol' },
                  assert: 'assert aman_bagi("5", "0") == "nol", "pembagi 0 harus mengembalikan nol"',
                },
                {
                  name: { en: 'Not a number', id: 'Bukan angka' },
                  assert:
                    'assert aman_bagi("x", "2") == "bukan angka", "nilai a tak valid"\nassert aman_bagi("2", "y") == "bukan angka", "nilai b tak valid"',
                },
              ],
              hints: [
                { en: 'Convert both with float() inside the try.', id: 'Konversi keduanya dengan float() di dalam try.' },
                { en: 'Two except clauses: ValueError and ZeroDivisionError.', id: 'Dua klausa except: ValueError dan ZeroDivisionError.' },
                {
                  en: 'try: return float(a) / float(b) — except ZeroDivisionError: return "nol" — except ValueError: return "bukan angka"',
                  id: 'try: return float(a) / float(b) — except ZeroDivisionError: return "nol" — except ValueError: return "bukan angka"',
                },
              ],
              solution:
                'def aman_bagi(a, b):\n    try:\n        return float(a) / float(b)\n    except ZeroDivisionError:\n        return "nol"\n    except ValueError:\n        return "bukan angka"',
            },
          ],
        },
      ],
      project: {
        id: 'py-m6-s1-p',
        title: { en: 'Safe calculator', id: 'Kalkulator aman' },
        brief: {
          en: 'A calculator that never crashes, whatever the user types.',
          id: 'Kalkulator yang tidak pernah berhenti mendadak, apa pun yang diketik pengguna.',
        },
        requirements: [
          { en: 'Read a number, then an operator (`+ - * /`), then a second number.', id: 'Baca sebuah angka, lalu operator (`+ - * /`), lalu angka kedua.' },
          { en: 'Print the result, for example `7.0`.', id: 'Cetak hasilnya, misalnya `7.0`.' },
          { en: 'A value that is not a number: print `Angka tidak valid`.', id: 'Nilai yang bukan angka: cetak `Angka tidak valid`.' },
          { en: 'Dividing by zero: print `Tidak bisa dibagi nol`.', id: 'Pembagian dengan nol: cetak `Tidak bisa dibagi nol`.' },
          { en: 'An unknown operator: print `Operator tidak dikenal`.', id: 'Operator tak dikenal: cetak `Operator tidak dikenal`.' },
        ],
        starter:
          '# Kalkulator aman\na = input("Angka pertama: ")\nop = input("Operator (+ - * /): ")\nb = input("Angka kedua: ")\n',
        tests: [
          { name: { en: '3 + 4', id: '3 + 4' }, stdin: ['3', '+', '4'], expectOutput: '7.0' },
          { name: { en: '10 / 4', id: '10 / 4' }, stdin: ['10', '/', '4'], expectOutput: '2.5' },
          { name: { en: '6 * 7', id: '6 * 7' }, stdin: ['6', '*', '7'], expectOutput: '42.0' },
          { name: { en: '9 - 2', id: '9 - 2' }, stdin: ['9', '-', '2'], expectOutput: '7.0' },
          { name: { en: 'Divide by zero', id: 'Dibagi nol' }, stdin: ['5', '/', '0'], expectOutput: 'Tidak bisa dibagi nol' },
          { name: { en: 'Not a number', id: 'Bukan angka' }, stdin: ['abc', '+', '2'], expectOutput: 'Angka tidak valid' },
          { name: { en: 'Unknown operator', id: 'Operator tak dikenal' }, stdin: ['3', '^', '4'], expectOutput: 'Operator tidak dikenal' },
        ],
        hints: [
          { en: 'Convert both numbers first, inside a try — that failure is separate from the operator.', id: 'Konversi kedua angka lebih dulu di dalam try — kegagalan itu terpisah dari urusan operator.' },
          { en: 'Use float() so 3 + 4 prints 7.0 rather than 7.', id: 'Pakai float() agar 3 + 4 tercetak 7.0, bukan 7.' },
          { en: 'Check the operator with an if/elif chain, and let else print `Operator tidak dikenal`.', id: 'Periksa operatornya dengan rantai if/elif, dan biarkan else mencetak `Operator tidak dikenal`.' },
          { en: 'Division needs its own try, or an explicit check for 0 before dividing.', id: 'Pembagian butuh try sendiri, atau pemeriksaan nol sebelum membagi.' },
        ],
        solution:
          'a = input("Angka pertama: ")\nop = input("Operator (+ - * /): ")\nb = input("Angka kedua: ")\n\ntry:\n    x = float(a)\n    y = float(b)\nexcept ValueError:\n    print("Angka tidak valid")\nelse:\n    if op == "+":\n        print(x + y)\n    elif op == "-":\n        print(x - y)\n    elif op == "*":\n        print(x * y)\n    elif op == "/":\n        try:\n            print(x / y)\n        except ZeroDivisionError:\n            print("Tidak bisa dibagi nol")\n    else:\n        print("Operator tidak dikenal")',
        xp: 50,
      },
    },

    /* ------------------------------------------------------ 6.2 raise & guard */
    {
      id: 'py-m6-s2',
      title: { en: 'Guarding the Way In', id: 'Menjaga Pintu Masuk' },
      summary: {
        en: 'Ask again until the answer is usable, and raise your own errors.',
        id: 'Bertanya ulang sampai jawabannya bisa dipakai, dan memunculkan error sendiri.',
      },
      lessons: [
        {
          id: 'py-m6-s2-l1',
          title: { en: 'Ask until it is valid', id: 'Bertanya sampai valid' },
          goal: { en: 'Loop until the input can be used.', id: 'Mengulang sampai input bisa dipakai.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'try inside a loop', id: 'try di dalam loop' },
              body: {
                en: 'Handling the error is only half the job — you still need a number. Put the `try` inside `while True` and `break` only once it worked.',
                id: 'Menangani error baru separuh pekerjaan — kamu tetap butuh angkanya. Taruh `try` di dalam `while True` dan `break` hanya setelah berhasil.',
              },
              code: 'while True:\n    try:\n        umur = int(input("Umur: "))\n        break\n    except ValueError:\n        print("Masukkan angka saja")\n\nprint(f"Umur kamu {umur}")',
              output: 'Masukkan angka saja\nUmur kamu 17',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Valid is more than convertible', id: 'Valid tidak sekadar bisa dikonversi' },
              body: {
                en: '`int("-5")` converts happily, but an age of -5 is still nonsense. Two separate checks: can it be converted, and is the value sensible.',
                id: '`int("-5")` berhasil dikonversi, tetapi umur -5 tetap tidak masuk akal. Dua pemeriksaan terpisah: bisakah dikonversi, dan masuk akalkah nilainya.',
              },
              code: 'while True:\n    try:\n        umur = int(input("Umur: "))\n    except ValueError:\n        print("Bukan angka")\n        continue\n    if umur < 0:\n        print("Tidak boleh negatif")\n        continue\n    break\n\nprint(umur)',
              output: 'Bukan angka\nTidak boleh negatif\n21',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why use `continue` instead of `break` after printing the error?',
                id: 'Kenapa memakai `continue` alih-alih `break` setelah mencetak pesan error?',
              },
              options: [
                { en: 'To go back and ask again', id: 'Untuk kembali dan bertanya lagi' },
                { en: 'To leave the loop immediately', id: 'Untuk langsung keluar dari loop' },
                { en: 'To skip the print', id: 'Untuk melewati print' },
                { en: 'There is no difference', id: 'Tidak ada bedanya' },
              ],
              answer: 0,
              explain: {
                en: 'break would leave with no usable value. continue starts the next round, which asks again.',
                id: 'break akan keluar tanpa nilai yang bisa dipakai. continue memulai putaran berikutnya, yang bertanya lagi.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Keep asking for a number between 1 and 10 until you get one, then print `Diterima: N`. Print `Ulangi` for anything else.',
                id: 'Terus minta angka antara 1 dan 10 sampai dapat, lalu cetak `Diterima: N`. Cetak `Ulangi` untuk selain itu.',
              },
              starter: 'while True:\n    teks = input("Angka 1-10: ")\n',
              tests: [
                { name: { en: 'Accepts 7 straight away', id: 'Langsung menerima 7' }, stdin: ['7'], expectOutput: 'Diterima: 7' },
                {
                  name: { en: 'Rejects text, then accepts', id: 'Menolak teks, lalu menerima' },
                  stdin: ['abc', '3'],
                  expectOutput: 'Ulangi\nDiterima: 3',
                },
                {
                  name: { en: 'Rejects out of range twice', id: 'Menolak di luar rentang dua kali' },
                  stdin: ['0', '99', '10'],
                  expectOutput: 'Ulangi\nUlangi\nDiterima: 10',
                },
              ],
              hints: [
                { en: 'Both failures print the same word, so one message covers them.', id: 'Kedua kegagalan mencetak kata yang sama, jadi satu pesan cukup.' },
                { en: 'try/except ValueError for the conversion, then an if for the range.', id: 'try/except ValueError untuk konversinya, lalu if untuk rentangnya.' },
                { en: 'Only break once the value is inside 1 to 10.', id: 'Baru break setelah nilainya ada di antara 1 sampai 10.' },
              ],
              solution:
                'while True:\n    teks = input("Angka 1-10: ")\n    try:\n        n = int(teks)\n    except ValueError:\n        print("Ulangi")\n        continue\n    if 1 <= n <= 10:\n        print(f"Diterima: {n}")\n        break\n    print("Ulangi")',
            },
          ],
        },
        {
          id: 'py-m6-s2-l2',
          title: { en: 'Raising your own', id: 'Memunculkan error sendiri' },
          goal: { en: 'Reject bad data from inside a function.', id: 'Menolak data buruk dari dalam fungsi.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'raise says no', id: 'raise berarti menolak' },
              body: {
                en: 'A function that quietly returns a wrong answer is worse than one that refuses. `raise ValueError("pesan")` stops it and hands the caller a reason.',
                id: 'Fungsi yang diam-diam mengembalikan jawaban salah lebih buruk daripada yang menolak. `raise ValueError("pesan")` menghentikannya dan memberi pemanggil sebuah alasan.',
              },
              code: 'def akar(n):\n    if n < 0:\n        raise ValueError("tidak boleh negatif")\n    return n ** 0.5\n\nprint(akar(9))\nprint(akar(-1))',
              output: '3.0\nValueError: tidak boleh negatif',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The two halves fit together', id: 'Dua sisi yang saling melengkapi' },
              body: {
                en: 'The function decides what counts as invalid; the caller decides what to do about it. That split is why `raise` and `try` belong in different places.',
                id: 'Fungsi menentukan apa yang dianggap tidak valid; pemanggil menentukan tindakannya. Pemisahan itulah sebabnya `raise` dan `try` berada di tempat berbeda.',
              },
              code: 'def akar(n):\n    if n < 0:\n        raise ValueError("tidak boleh negatif")\n    return n ** 0.5\n\ntry:\n    print(akar(-4))\nexcept ValueError as e:\n    print("ditolak:", e)',
              output: 'ditolak: tidak boleh negatif',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What is printed?', id: 'Apa yang dicetak?' },
              code: 'def cek(n):\n    if n > 100:\n        raise ValueError("terlalu besar")\n    return n\n\ntry:\n    print(cek(5))\n    print(cek(500))\nexcept ValueError as e:\n    print(e)',
              options: [
                { en: '5 then terlalu besar', id: '5 lalu terlalu besar' },
                { en: 'terlalu besar only', id: 'hanya terlalu besar' },
                { en: '5 then 500', id: '5 lalu 500' },
                { en: '5 only', id: 'hanya 5' },
              ],
              answer: 0,
              explain: {
                en: 'The first call prints 5. The second raises, so the rest of the try block is abandoned and except runs.',
                id: 'Pemanggilan pertama mencetak 5. Yang kedua memunculkan error, jadi sisa blok try ditinggalkan dan except yang jalan.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: { en: 'Refuse an empty name.', id: 'Tolak nama yang kosong.' },
              template: 'def daftar(nama):\n    if nama == "":\n        ___ ValueError("nama wajib diisi")\n    return nama',
              blanks: ['raise'],
              explain: {
                en: 'raise creates the error; the caller decides whether to catch it.',
                id: 'raise memunculkan error-nya; pemanggil yang memutuskan apakah menangkapnya.',
              },
            },
            {
              kind: 'code',
              id: 'w1',
              prompt: {
                en: 'Write `nilai_valid(n)` returning n when it is between 0 and 100, and raising `ValueError` with the message `di luar rentang` otherwise.',
                id: 'Tulis `nilai_valid(n)` yang mengembalikan n bila berada antara 0 dan 100, dan memunculkan `ValueError` berpesan `di luar rentang` bila tidak.',
              },
              starter: 'def nilai_valid(n):\n    pass\n',
              tests: [
                {
                  name: { en: 'Accepts values in range', id: 'Menerima nilai dalam rentang' },
                  assert: 'assert nilai_valid(0) == 0\nassert nilai_valid(75) == 75\nassert nilai_valid(100) == 100',
                },
                {
                  name: { en: 'Raises for values outside', id: 'Menolak nilai di luar rentang' },
                  assert:
                    'for bad in (-1, 101):\n    try:\n        nilai_valid(bad)\n        raise AssertionError(str(bad) + " seharusnya ditolak")\n    except ValueError as e:\n        assert "di luar rentang" in str(e), "pesan error harus memuat: di luar rentang"',
                },
              ],
              hints: [
                { en: 'Guard first, return last.', id: 'Periksa dulu, kembalikan belakangan.' },
                { en: 'if not (0 <= n <= 100): raise ValueError("di luar rentang")', id: 'if not (0 <= n <= 100): raise ValueError("di luar rentang")' },
              ],
              solution:
                'def nilai_valid(n):\n    if not (0 <= n <= 100):\n        raise ValueError("di luar rentang")\n    return n',
            },
          ],
        },
      ],
      project: {
        id: 'py-m6-s2-p',
        title: { en: 'Registration form', id: 'Formulir pendaftaran' },
        brief: {
          en: 'Collect a name, an age, and an email, refusing anything unusable and asking again.',
          id: 'Kumpulkan nama, umur, dan email, tolak yang tidak layak lalu tanya ulang.',
        },
        requirements: [
          { en: 'Name must not be empty. Bad: print `Nama wajib diisi` and ask again.', id: 'Nama tidak boleh kosong. Salah: cetak `Nama wajib diisi` lalu tanya lagi.' },
          { en: 'Age is a whole number from 5 to 100. Bad: print `Umur tidak valid` and ask again.', id: 'Umur adalah bilangan bulat 5 sampai 100. Salah: cetak `Umur tidak valid` lalu tanya lagi.' },
          { en: 'Email must contain `@`. Bad: print `Email tidak valid` and ask again.', id: 'Email harus memuat `@`. Salah: cetak `Email tidak valid` lalu tanya lagi.' },
          { en: 'Finally print `Terdaftar: <nama> (<umur>) <email>`.', id: 'Terakhir cetak `Terdaftar: <nama> (<umur>) <email>`.' },
        ],
        starter: '# Formulir pendaftaran\n',
        tests: [
          {
            name: { en: 'All three valid first time', id: 'Ketiganya valid sejak awal' },
            stdin: ['Ani', '17', 'ani@mail.com'],
            expectOutput: 'Terdaftar: Ani (17) ani@mail.com',
          },
          {
            name: { en: 'Empty name is refused', id: 'Nama kosong ditolak' },
            stdin: ['', 'Budi', '20', 'budi@mail.com'],
            expectOutput: 'Nama wajib diisi\nTerdaftar: Budi (20) budi@mail.com',
          },
          {
            name: { en: 'Age: text, then out of range', id: 'Umur: teks, lalu di luar rentang' },
            stdin: ['Citra', 'dua', '3', '30', 'citra@mail.com'],
            expectOutput: 'Umur tidak valid\nUmur tidak valid\nTerdaftar: Citra (30) citra@mail.com',
          },
          {
            name: { en: 'Email without @ is refused', id: 'Email tanpa @ ditolak' },
            stdin: ['Dina', '25', 'dina.mail.com', 'dina@mail.com'],
            expectOutput: 'Email tidak valid\nTerdaftar: Dina (25) dina@mail.com',
          },
        ],
        hints: [
          { en: 'Three loops, one per field — each only breaks when its value is good.', id: 'Tiga loop, satu per isian — masing-masing baru break saat nilainya benar.' },
          { en: 'Only the age needs try/except, because only it converts.', id: 'Hanya umur yang butuh try/except, karena hanya ia yang dikonversi.' },
          { en: 'The `in` operator tests for a fragment: `"@" in email`', id: 'Operator `in` menguji potongan teks: `"@" in email`' },
          {
            en: 'A helper like `def minta_umur():` keeps the three loops from turning into one long block.',
            id: 'Fungsi bantu seperti `def minta_umur():` menjaga ketiga loop tidak menjadi satu blok panjang.',
          },
        ],
        solution:
          'while True:\n    nama = input("Nama: ")\n    if nama != "":\n        break\n    print("Nama wajib diisi")\n\nwhile True:\n    teks = input("Umur: ")\n    try:\n        umur = int(teks)\n    except ValueError:\n        print("Umur tidak valid")\n        continue\n    if 5 <= umur <= 100:\n        break\n    print("Umur tidak valid")\n\nwhile True:\n    email = input("Email: ")\n    if "@" in email:\n        break\n    print("Email tidak valid")\n\nprint(f"Terdaftar: {nama} ({umur}) {email}")',
        xp: 50,
      },
    },
  ],
}
