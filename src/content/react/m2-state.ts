import type { Module } from '../types'

/** Module 2 — state, events, and forms.
 *
 *  Checks here interact with the page, so they use `await click(...)`: React
 *  commits after the handler returns. They also read the current value before
 *  acting rather than assuming zero, because every check in a test shares one
 *  page and an earlier check may already have clicked. */

const ROOT = '<div id="root"></div>'

export const module2: Module = {
  id: 'react-m2',
  title: { en: 'State and Interaction', id: 'State dan Interaksi' },
  summary: {
    en: 'Remember something between renders, and let the reader change it.',
    id: 'Mengingat sesuatu antar-render, dan membiarkan pembaca mengubahnya.',
  },
  submodules: [
    /* ------------------------------------------------------------ 2.1 useState */
    {
      id: 'react-m2-s1',
      title: { en: 'useState', id: 'useState' },
      summary: {
        en: 'The value a component remembers, and the right way to change it.',
        id: 'Nilai yang diingat sebuah komponen, dan cara yang benar mengubahnya.',
      },
      lessons: [
        {
          id: 'react-m2-s1-l1',
          title: { en: 'Remembering a value', id: 'Mengingat sebuah nilai' },
          goal: { en: 'Hold state and change it on a click.', id: 'Menyimpan state dan mengubahnya saat diklik.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A plain variable will not do', id: 'Variabel biasa tidak cukup' },
              body: {
                en: 'Changing an ordinary variable changes nothing on screen: React has no idea it happened, so it never re-renders. And even if it did, the function would run again and reset the variable. State solves both halves.',
                id: 'Mengubah variabel biasa tidak mengubah apa pun di layar: React tidak tahu itu terjadi, jadi ia tak pernah merender ulang. Dan seandainya pun tahu, fungsinya akan berjalan lagi dan menyetel ulang variabelnya. State menyelesaikan kedua sisinya.',
              },
              code: {
                en: '// does not work\nfunction Wrong() {\n  let count = 0;\n  return <button onClick={() => count++}>{count}</button>;\n}',
                id: '// tidak berfungsi\nfunction Salah() {\n  let hitung = 0;\n  return <button onClick={() => hitung++}>{hitung}</button>;\n}',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'useState returns a pair', id: 'useState mengembalikan sepasang' },
              body: {
                en: 'The current value, and a function to set it. Calling the setter tells React the component needs to run again — and on that run, `useState` hands back the new value instead of the initial one.',
                id: 'Nilai saat ini, dan sebuah fungsi untuk menyetelnya. Memanggil setter-nya memberi tahu React bahwa komponennya perlu berjalan lagi — dan pada putaran itu, `useState` mengembalikan nilai barunya, bukan nilai awalnya.',
              },
              code: {
                en: 'function Counter() {\n  const [count, setCount] = React.useState(0);\n\n  return (\n    <div>\n      <p id="count">{count}</p>\n      <button onClick={() => setCount(count + 1)}>Add</button>\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Counter />);',
                id: 'function Penghitung() {\n  const [hitung, setHitung] = React.useState(0);\n\n  return (\n    <div>\n      <p id="angka">{hitung}</p>\n      <button onClick={() => setHitung(hitung + 1)}>Tambah</button>\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Penghitung />);',
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Hand over the function, do not call it', id: 'Serahkan fungsinya, jangan panggil' },
              body: {
                en: '`onClick={increment}` registers the handler. `onClick={increment()}` calls it during rendering and registers whatever it returned — which usually means the state updates once immediately and then never again, or loops forever.',
                id: '`onClick={naik}` mendaftarkan penangannya. `onClick={naik()}` memanggilnya saat perenderan dan mendaftarkan apa pun hasilnya — yang biasanya berarti state-nya berubah sekali langsung lalu tak pernah lagi, atau berputar tanpa henti.',
              },
              code: {
                en: '// wrong: called during render\n// <button onClick={setCount(count + 1)}>\n\n// correct: function handed over\n// <button onClick={() => setCount(count + 1)}>',
                id: '// salah: dipanggil saat render\n// <button onClick={setHitung(hitung + 1)}>\n\n// benar: fungsi diserahkan\n// <button onClick={() => setHitung(hitung + 1)}>',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'What does `useState(0)` return?', id: 'Apa yang dikembalikan `useState(0)`?' },
              options: [
                { en: 'An array: the value and a setter', id: 'Sebuah array: nilainya dan sebuah setter' },
                { en: 'Just the value', id: 'Hanya nilainya' },
                { en: 'An object with .value', id: 'Sebuah object dengan .value' },
                { en: 'Nothing — it only registers state', id: 'Tidak ada — ia hanya mendaftarkan state' },
              ],
              answer: 0,
              explain: {
                en: 'The array destructuring `const [x, setX]` is why you get to pick both names.',
                id: 'Pembongkaran array `const [x, setX]` itulah sebabnya kamu bebas memilih kedua namanya.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: { en: 'Declare state starting at 10.', id: 'Deklarasikan state yang dimulai dari 10.' },
              template: {
                en: 'const [value, setValue] = React.___(___);',
                id: 'const [nilai, setNilai] = React.___(___);',
              },
              blanks: ['useState', '10'],
              explain: {
                en: 'The argument is the starting value, used on the first render only.',
                id: 'Argumennya adalah nilai awal, dipakai hanya pada render pertama.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              react: true,
              html: ROOT,
              prompt: {
                en: 'Build `Counter` with a `p#count` showing the count starting at 0, a button `Add` that adds one, and a button `Subtract` that subtracts one.',
                id: 'Bangun `Penghitung` dengan `p#angka` yang menampilkan hitungan mulai dari 0, tombol `Tambah` yang menambah satu, dan tombol `Kurang` yang mengurangi satu.',
              },
              starter: {
                en: 'function Counter() {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Counter />);\n',
                id: 'function Penghitung() {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Penghitung />);\n',
              },
              tests: {
                en: [
                  {
                    name: { en: 'It starts at zero', id: 'Ia mulai dari nol' },
                    check:
                      'assert(sel("#count"), "no <p id=\\"count\\"> yet");\nassert(text("#count") === "0", "should start at 0, got: " + JSON.stringify(text("#count")));',
                  },
                  {
                    name: { en: 'Add adds one', id: 'Tambah menambah satu' },
                    check:
                      'var button = all("button").filter(function (b) { return b.textContent.trim() === "Add"; })[0];\nassert(button, "no Add button yet");\nvar before = Number(text("#count"));\nawait click(button);\nassert(Number(text("#count")) === before + 1, "after Add should be " + (before + 1) + ", got: " + text("#count"));',
                  },
                  {
                    name: { en: 'Subtract subtracts one', id: 'Kurang mengurangi satu' },
                    check:
                      'var button = all("button").filter(function (b) { return b.textContent.trim() === "Subtract"; })[0];\nassert(button, "no Subtract button yet");\nvar before = Number(text("#count"));\nawait click(button);\nassert(Number(text("#count")) === before - 1, "after Subtract should be " + (before - 1) + ", got: " + text("#count"));',
                  },
                  {
                    name: { en: 'It really is state, not the DOM', id: 'Ia benar-benar state, bukan DOM' },
                    check:
                      'var increment = all("button").filter(function (b) { return b.textContent.trim() === "Add"; })[0];\nvar before = Number(text("#count"));\nawait click(increment);\nawait click(increment);\nawait click(increment);\nassert(Number(text("#count")) === before + 3, "three clicks should add three, got: " + text("#count"));',
                  },
                ],
                id: [
                  {
                    name: { en: 'It starts at zero', id: 'Ia mulai dari nol' },
                    check:
                      'assert(sel("#angka"), "belum ada <p id=\\"angka\\">");\nassert(text("#angka") === "0", "awalnya harus 0, sekarang: " + JSON.stringify(text("#angka")));',
                  },
                  {
                    name: { en: 'Add adds one', id: 'Tambah menambah satu' },
                    check:
                      'var tombol = all("button").filter(function (b) { return b.textContent.trim() === "Tambah"; })[0];\nassert(tombol, "belum ada tombol Tambah");\nvar sebelum = Number(text("#angka"));\nawait click(tombol);\nassert(Number(text("#angka")) === sebelum + 1, "setelah Tambah harus " + (sebelum + 1) + ", sekarang: " + text("#angka"));',
                  },
                  {
                    name: { en: 'Subtract subtracts one', id: 'Kurang mengurangi satu' },
                    check:
                      'var tombol = all("button").filter(function (b) { return b.textContent.trim() === "Kurang"; })[0];\nassert(tombol, "belum ada tombol Kurang");\nvar sebelum = Number(text("#angka"));\nawait click(tombol);\nassert(Number(text("#angka")) === sebelum - 1, "setelah Kurang harus " + (sebelum - 1) + ", sekarang: " + text("#angka"));',
                  },
                  {
                    name: { en: 'It really is state, not the DOM', id: 'Ia benar-benar state, bukan DOM' },
                    check:
                      'var naik = all("button").filter(function (b) { return b.textContent.trim() === "Tambah"; })[0];\nvar sebelum = Number(text("#angka"));\nawait click(naik);\nawait click(naik);\nawait click(naik);\nassert(Number(text("#angka")) === sebelum + 3, "tiga klik harus menambah tiga, sekarang: " + text("#angka"));',
                  },
                ],
              },
              hints: [
                { en: 'One piece of state serves both buttons.', id: 'Satu state melayani kedua tombol.' },
                { en: 'Each button needs an arrow function, not a call.', id: 'Tiap tombol butuh arrow function, bukan pemanggilan.' },
                { en: 'onClick={() => setCount(count - 1)}', id: 'onClick={() => setHitung(hitung - 1)}' },
              ],
              solution: {
                en:
                  'function Counter() {\n  const [count, setCount] = React.useState(0);\n\n  return (\n    <div>\n      <p id="count">{count}</p>\n      <button onClick={() => setCount(count + 1)}>Add</button>\n      <button onClick={() => setCount(count - 1)}>Subtract</button>\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Counter />);',
                id:
                  'function Penghitung() {\n  const [hitung, setHitung] = React.useState(0);\n\n  return (\n    <div>\n      <p id="angka">{hitung}</p>\n      <button onClick={() => setHitung(hitung + 1)}>Tambah</button>\n      <button onClick={() => setHitung(hitung - 1)}>Kurang</button>\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Penghitung />);',
              },
            },
          ],
        },
        {
          id: 'react-m2-s1-l2',
          title: { en: 'Updating state properly', id: 'Memperbarui state dengan benar' },
          goal: { en: 'Update from the previous value, and never mutate.', id: 'Memperbarui dari nilai sebelumnya, dan tak pernah memutasi.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The value is a snapshot', id: 'Nilainya adalah potret sesaat' },
              body: {
                en: 'Inside one render, `count` never changes. So calling `setCount(count + 1)` twice in a row sets the same number twice — the second call did not see the first. Pass a function instead and React hands you the latest value.',
                id: 'Di dalam satu render, `hitung` tidak pernah berubah. Jadi memanggil `setHitung(hitung + 1)` dua kali berturut-turut menyetel angka yang sama dua kali — panggilan kedua tidak melihat yang pertama. Oper sebuah fungsi, maka React memberimu nilai terbarunya.',
              },
              code: {
                en: '// adds one, not two\nsetCount(count + 1);\nsetCount(count + 1);\n\n// adds two\nsetCount((n) => n + 1);\nsetCount((n) => n + 1);',
                id: '// menambah satu, bukan dua\nsetHitung(hitung + 1);\nsetHitung(hitung + 1);\n\n// menambah dua\nsetHitung((n) => n + 1);\nsetHitung((n) => n + 1);',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Replace, never modify', id: 'Ganti, jangan ubah' },
              body: {
                en: 'React decides whether to re-render by comparing the old value with the new one. `push` returns the same array it was given, so React sees no change and the screen stays still. Build a new array instead — the spread does exactly that.',
                id: 'React memutuskan perlu tidaknya render ulang dengan membandingkan nilai lama dan baru. `push` mengembalikan array yang sama, jadi React tidak melihat perubahan dan layarnya diam. Bangun array baru — operator sebar melakukan tepat itu.',
              },
              code: {
                en: '// does not re-render\n// list.push(item); setList(list);\n\n// correct\nsetList([...list, item]);\nsetList(list.filter((x) => x.id !== id));',
                id: '// tidak merender ulang\n// daftar.push(baru); setDaftar(daftar);\n\n// benar\nsetDaftar([...daftar, baru]);\nsetDaftar(daftar.filter((x) => x.id !== id));',
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Objects the same way', id: 'Object dengan cara yang sama' },
              body: {
                en: 'Spread the old object, then override the field you are changing. The result is a different object, which is what tells React something happened.',
                id: 'Sebar object lamanya, lalu timpa bidang yang sedang kamu ubah. Hasilnya object yang berbeda, dan itulah yang memberi tahu React bahwa sesuatu terjadi.',
              },
              code: {
                en: 'setProfile({ ...profile, name: "Budi" });',
                id: 'setProfil({ ...profil, nama: "Budi" });',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A click calls `setN(n + 1)` twice. What happens?',
                id: 'Sebuah klik memanggil `setN(n + 1)` dua kali. Apa yang terjadi?',
              },
              options: [
                { en: 'n increases by one — both calls saw the same n', id: 'n bertambah satu — kedua panggilan melihat n yang sama' },
                { en: 'n increases by two', id: 'n bertambah dua' },
                { en: 'React throws', id: 'React error' },
                { en: 'The component renders twice', id: 'Komponennya render dua kali' },
              ],
              answer: 0,
              explain: {
                en: 'Both computed the same value from the same snapshot. `setN((v) => v + 1)` twice adds two.',
                id: 'Keduanya menghitung nilai sama dari potret yang sama. `setN((v) => v + 1)` dua kali menambah dua.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              react: true,
              html: ROOT,
              prompt: {
                en: 'Build `Double` with `p#count` starting at 0 and a button `Add 2` whose single click adds two — using two separate setter calls, so the functional form is required.',
                id: 'Bangun `Ganda` dengan `p#angka` mulai dari 0 dan tombol `Tambah 2` yang satu kliknya menambah dua — memakai dua pemanggilan setter terpisah, sehingga bentuk fungsionalnya wajib.',
              },
              starter: {
                en: 'function Double() {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Double />);\n',
                id: 'function Ganda() {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Ganda />);\n',
              },
              tests: {
                en: [
                  {
                    name: { en: 'It starts at zero', id: 'Ia mulai dari nol' },
                    check: 'assert(text("#count") === "0", "should start at 0, got: " + JSON.stringify(text("#count")));',
                  },
                  {
                    name: { en: 'One click adds two', id: 'Satu klik menambah dua' },
                    check:
                      'var before = Number(text("#count"));\nawait click("button");\nassert(Number(text("#count")) === before + 2, "one click should add 2 — with setCount(count + 1) twice it only adds 1. Now: " + text("#count"));',
                  },
                  {
                    name: { en: 'And keeps adding two', id: 'Dan terus menambah dua' },
                    check:
                      'var before = Number(text("#count"));\nawait click("button");\nawait click("button");\nassert(Number(text("#count")) === before + 4, "two clicks should add 4, got: " + text("#count"));',
                  },
                ],
                id: [
                  {
                    name: { en: 'It starts at zero', id: 'Ia mulai dari nol' },
                    check: 'assert(text("#angka") === "0", "awalnya harus 0, sekarang: " + JSON.stringify(text("#angka")));',
                  },
                  {
                    name: { en: 'One click adds two', id: 'Satu klik menambah dua' },
                    check:
                      'var sebelum = Number(text("#angka"));\nawait click("button");\nassert(Number(text("#angka")) === sebelum + 2, "satu klik harus menambah 2 — dengan setHitung(hitung + 1) dua kali hanya bertambah 1. Sekarang: " + text("#angka"));',
                  },
                  {
                    name: { en: 'And keeps adding two', id: 'Dan terus menambah dua' },
                    check:
                      'var sebelum = Number(text("#angka"));\nawait click("button");\nawait click("button");\nassert(Number(text("#angka")) === sebelum + 4, "dua klik harus menambah 4, sekarang: " + text("#angka"));',
                  },
                ],
              },
              hints: [
                { en: 'Two setter calls in the handler, not one call adding 2.', id: 'Dua pemanggilan setter di penangannya, bukan satu panggilan menambah 2.' },
                { en: 'The plain form reads a snapshot that never changes within a render.', id: 'Bentuk biasanya membaca potret yang tak berubah di dalam satu render.' },
                { en: 'setCount((n) => n + 1); twice', id: 'setHitung((n) => n + 1); dua kali' },
              ],
              solution: {
                en:
                  'function Double() {\n  const [count, setCount] = React.useState(0);\n\n  function addTwo() {\n    setCount((n) => n + 1);\n    setCount((n) => n + 1);\n  }\n\n  return (\n    <div>\n      <p id="count">{count}</p>\n      <button onClick={addTwo}>Add 2</button>\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Double />);',
                id:
                  'function Ganda() {\n  const [hitung, setHitung] = React.useState(0);\n\n  function tambahDua() {\n    setHitung((n) => n + 1);\n    setHitung((n) => n + 1);\n  }\n\n  return (\n    <div>\n      <p id="angka">{hitung}</p>\n      <button onClick={tambahDua}>Tambah 2</button>\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Ganda />);',
              },
            },
          ],
        },
      ],
      project: {
        id: 'react-m2-s1-p',
        runtime: 'web',
        react: true,
        html: ROOT,
        title: { en: 'Score keeper', id: 'Pencatat skor' },
        brief: {
          en: 'A counter with limits, a reset, and a message that appears only at the top.',
          id: 'Penghitung dengan batas, tombol reset, dan pesan yang hanya muncul di puncak.',
        },
        requirements: [
          { en: '`p#score` shows the score, starting at 0.', id: '`p#skor` menampilkan skornya, mulai dari 0.' },
          { en: 'Buttons `+1` and `+5` add; `Reset` sets it back to 0.', id: 'Tombol `+1` dan `+5` menambah; `Reset` mengembalikannya ke 0.' },
          { en: 'The score never goes above 10 — further clicks change nothing.', id: 'Skornya tak pernah melewati 10 — klik selanjutnya tidak mengubah apa pun.' },
          { en: 'At exactly 10, render `<p className="full">Maximum</p>`; otherwise do not render it at all.', id: 'Tepat di 10, render `<p className="penuh">Maksimal</p>`; selain itu jangan render sama sekali.' },
        ],
        starter: {
          en: 'function Score() {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Score />);\n',
          id: 'function Skor() {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Skor />);\n',
        },
        tests: {
          en: [
            {
              name: { en: 'It starts empty and unflagged', id: 'Ia mulai kosong dan tanpa tanda' },
              check:
                'assert(sel("#score"), "no <p id=\\"score\\"> yet");\nassert(text("#score") === "0", "should start at 0, got: " + JSON.stringify(text("#score")));\nassert(sel(".full") === null, "the Maximum message must not show at the start");',
            },
            {
              name: { en: 'The two add buttons work', id: 'Kedua tombol tambah berfungsi' },
              check:
                'function button(t) { return all("button").filter(function (b) { return b.textContent.trim() === t; })[0]; }\nassert(button("+1"), "no +1 button yet");\nassert(button("+5"), "no +5 button yet");\nassert(button("Reset"), "no Reset button yet");\nawait click(button("Reset"));\nawait click(button("+1"));\nassert(text("#score") === "1", "after +1 should be 1, got: " + text("#score"));\nawait click(button("+5"));\nassert(text("#score") === "6", "after +5 should be 6, got: " + text("#score"));',
            },
            {
              name: { en: 'It stops at ten', id: 'Ia berhenti di sepuluh' },
              check:
                'function button(t) { return all("button").filter(function (b) { return b.textContent.trim() === t; })[0]; }\nawait click(button("Reset"));\nfor (var i = 0; i < 4; i++) await click(button("+5"));\nassert(text("#score") === "10", "the score should stop at 10, got: " + text("#score"));',
            },
            {
              name: { en: 'The full message appears only at ten', id: 'Pesan penuhnya hanya muncul di sepuluh' },
              check:
                'function button(t) { return all("button").filter(function (b) { return b.textContent.trim() === t; })[0]; }\nassert(sel(".full"), "at 10 there should be a <p className=\\"full\\">");\nassert(text(".full") === "Maximum", "text was: " + JSON.stringify(text(".full")));\nawait click(button("Reset"));\nassert(text("#score") === "0", "Reset should return to 0");\nassert(sel(".full") === null, "after reset the message should be gone");',
            },
            {
              name: { en: 'Nothing threw', id: 'Tidak ada yang error' },
              check: 'assert(error() === null, "there was an error: " + error());',
            },
          ],
          id: [
            {
              name: { en: 'It starts empty and unflagged', id: 'Ia mulai kosong dan tanpa tanda' },
              check:
                'assert(sel("#skor"), "belum ada <p id=\\"skor\\">");\nassert(text("#skor") === "0", "awalnya harus 0, sekarang: " + JSON.stringify(text("#skor")));\nassert(sel(".penuh") === null, "pesan Maksimal tidak boleh tampil di awal");',
            },
            {
              name: { en: 'The two add buttons work', id: 'Kedua tombol tambah berfungsi' },
              check:
                'function tombol(t) { return all("button").filter(function (b) { return b.textContent.trim() === t; })[0]; }\nassert(tombol("+1"), "belum ada tombol +1");\nassert(tombol("+5"), "belum ada tombol +5");\nassert(tombol("Reset"), "belum ada tombol Reset");\nawait click(tombol("Reset"));\nawait click(tombol("+1"));\nassert(text("#skor") === "1", "setelah +1 harus 1, sekarang: " + text("#skor"));\nawait click(tombol("+5"));\nassert(text("#skor") === "6", "setelah +5 harus 6, sekarang: " + text("#skor"));',
            },
            {
              name: { en: 'It stops at ten', id: 'Ia berhenti di sepuluh' },
              check:
                'function tombol(t) { return all("button").filter(function (b) { return b.textContent.trim() === t; })[0]; }\nawait click(tombol("Reset"));\nfor (var i = 0; i < 4; i++) await click(tombol("+5"));\nassert(text("#skor") === "10", "skor harus berhenti di 10, sekarang: " + text("#skor"));',
            },
            {
              name: { en: 'The full message appears only at ten', id: 'Pesan penuhnya hanya muncul di sepuluh' },
              check:
                'function tombol(t) { return all("button").filter(function (b) { return b.textContent.trim() === t; })[0]; }\nassert(sel(".penuh"), "di angka 10 harus ada <p className=\\"penuh\\">");\nassert(text(".penuh") === "Maksimal", "teksnya: " + JSON.stringify(text(".penuh")));\nawait click(tombol("Reset"));\nassert(text("#skor") === "0", "Reset harus mengembalikan ke 0");\nassert(sel(".penuh") === null, "setelah reset pesannya harus hilang");',
            },
            {
              name: { en: 'Nothing threw', id: 'Tidak ada yang error' },
              check: 'assert(error() === null, "ada error: " + error());',
            },
          ],
        },
        hints: [
          { en: 'One piece of state; the buttons differ only in how much they add.', id: 'Satu state; tombolnya hanya berbeda pada berapa banyak yang ditambahkan.' },
          { en: 'Clamp inside the setter: Math.min(10, n + amount).', id: 'Batasi di dalam setter-nya: Math.min(10, n + jumlah).' },
          { en: 'The functional form keeps the clamp correct even on fast clicks.', id: 'Bentuk fungsionalnya menjaga pembatasannya tetap benar bahkan saat diklik cepat.' },
          { en: 'The message is show-or-nothing: {score === 10 && …}', id: 'Pesannya tampil-atau-tidak: {skor === 10 && …}' },
        ],
        solution: {
          en:
            'function Score() {\n  const [score, setScore] = React.useState(0);\n\n  function add(amount) {\n    setScore((n) => Math.min(10, n + amount));\n  }\n\n  return (\n    <div>\n      <p id="score">{score}</p>\n      <button onClick={() => add(1)}>+1</button>\n      <button onClick={() => add(5)}>+5</button>\n      <button onClick={() => setScore(0)}>Reset</button>\n      {score === 10 && <p className="full">Maximum</p>}\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Score />);',
          id:
            'function Skor() {\n  const [skor, setSkor] = React.useState(0);\n\n  function tambah(jumlah) {\n    setSkor((n) => Math.min(10, n + jumlah));\n  }\n\n  return (\n    <div>\n      <p id="skor">{skor}</p>\n      <button onClick={() => tambah(1)}>+1</button>\n      <button onClick={() => tambah(5)}>+5</button>\n      <button onClick={() => setSkor(0)}>Reset</button>\n      {skor === 10 && <p className="penuh">Maksimal</p>}\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Skor />);',
        },
        xp: 50,
      },
    },

    /* -------------------------------------------------------------- 2.2 forms */
    {
      id: 'react-m2-s2',
      title: { en: 'Forms', id: 'Formulir' },
      summary: {
        en: 'Inputs whose value lives in state, and state that lives in the parent.',
        id: 'Input yang nilainya tinggal di state, dan state yang tinggal di induknya.',
      },
      lessons: [
        {
          id: 'react-m2-s2-l1',
          title: { en: 'Controlled inputs', id: 'Input terkendali' },
          goal: { en: 'Put an input under React control.', id: 'Menempatkan input di bawah kendali React.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'State is the single source', id: 'State adalah satu-satunya sumber' },
              body: {
                en: 'The input shows `value`, and every keystroke calls `onChange`, which sets the state, which re-renders the input. The DOM holds no truth of its own — the state does.',
                id: 'Input menampilkan `value`, dan tiap ketukan tombol memanggil `onChange`, yang menyetel state, yang merender ulang input-nya. DOM tidak menyimpan kebenarannya sendiri — state-lah yang menyimpannya.',
              },
              code: {
                en: 'function Field() {\n  const [name, setName] = React.useState("");\n\n  return (\n    <div>\n      <input value={name} onChange={(e) => setName(e.target.value)} />\n      <p id="greeting">Hello, {name}</p>\n    </div>\n  );\n}',
                id: 'function Isian() {\n  const [nama, setNama] = React.useState("");\n\n  return (\n    <div>\n      <input value={nama} onChange={(e) => setNama(e.target.value)} />\n      <p id="halo">Halo, {nama}</p>\n    </div>\n  );\n}',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'value without onChange freezes it', id: 'value tanpa onChange membekukannya' },
              body: {
                en: 'Give an input a `value` and no `onChange` and it becomes read-only: React re-renders it back to the state after every keystroke. Either pair them, or use `defaultValue` when you genuinely want the DOM to keep the value.',
                id: 'Beri sebuah input `value` tanpa `onChange` dan ia menjadi hanya-baca: React merender ulang ke nilai state setelah tiap ketukan. Pasangkan keduanya, atau pakai `defaultValue` bila kamu memang ingin DOM yang menyimpan nilainya.',
              },
              code: {
                en: '// frozen, and React warns\n// <input value={name} />\n\n// controlled\n// <input value={name} onChange={(e) => setName(e.target.value)} />',
                id: '// beku, dan React memperingatkan\n// <input value={nama} />\n\n// terkendali\n// <input value={nama} onChange={(e) => setNama(e.target.value)} />',
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Submitting without reloading', id: 'Mengirim tanpa memuat ulang' },
              body: {
                en: 'The same `preventDefault` as plain JavaScript, for the same reason: a real submit navigates, and a reload throws away every piece of state the component was holding.',
                id: '`preventDefault` yang sama seperti di JavaScript biasa, dengan alasan sama: submit sungguhan berpindah halaman, dan muat ulang membuang seluruh state yang sedang dipegang komponennya.',
              },
              code: {
                en: 'function Form() {\n  const [text, setText] = React.useState("");\n\n  function submit(e) {\n    e.preventDefault();\n    setText("");\n  }\n\n  return (\n    <form onSubmit={submit}>\n      <input value={text} onChange={(e) => setText(e.target.value)} />\n    </form>\n  );\n}',
                id: 'function Form() {\n  const [teks, setTeks] = React.useState("");\n\n  function kirim(e) {\n    e.preventDefault();\n    setTeks("");\n  }\n\n  return (\n    <form onSubmit={kirim}>\n      <input value={teks} onChange={(e) => setTeks(e.target.value)} />\n    </form>\n  );\n}',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Your input will not accept typing. What is most likely missing?',
                id: 'Input-mu tidak mau menerima ketikan. Apa yang paling mungkin belum ada?',
              },
              options: [
                { en: 'onChange — value alone makes it read-only', id: 'onChange — value saja membuatnya hanya-baca' },
                { en: 'A name attribute', id: 'Atribut name' },
                { en: 'It must be inside a form', id: 'Ia harus di dalam form' },
                { en: 'useState cannot hold a string', id: 'useState tidak bisa menyimpan string' },
              ],
              answer: 0,
              explain: {
                en: 'React re-renders the input back to the state value after each keystroke, so without onChange the state never moves.',
                id: 'React merender ulang input-nya ke nilai state setelah tiap ketukan, jadi tanpa onChange state-nya tak pernah bergerak.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              react: true,
              html: ROOT,
              prompt: {
                en: 'Build `Greeting` with a controlled `input`, and a `p#result` reading `Hello, Ani` as you type. With the field empty it must read `Hello, guest`.',
                id: 'Bangun `Sapaan` dengan `input` terkendali, dan `p#hasil` bertuliskan `Halo, Ani` seiring kamu mengetik. Saat isiannya kosong ia harus bertuliskan `Halo, tamu`.',
              },
              starter: {
                en: 'function Greeting() {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Greeting />);\n',
                id: 'function Sapaan() {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Sapaan />);\n',
              },
              tests: {
                en: [
                  {
                    name: { en: 'The empty state greets a guest', id: 'Keadaan kosongnya menyapa tamu' },
                    check:
                      'assert(sel("input"), "no <input> yet");\nassert(sel("#result"), "no <p id=\\"result\\"> yet");\nassert(text("#result") === "Hello, guest", "when empty should be \\"Hello, guest\\", got: " + JSON.stringify(text("#result")));',
                  },
                  {
                    name: { en: 'The input is controlled', id: 'Input-nya terkendali' },
                    check:
                      'var i = sel("input");\nassert(i.value === "", "the input value should be bound to state, and the state starts empty");\nvar setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i), "value").set;\nsetter.call(i, "Ani");\ni.dispatchEvent(new Event("input", { bubbles: true }));\nawait tick(20);\nassert(i.value === "Ani", "the input must accept typing — pair value with onChange");',
                  },
                  {
                    name: { en: 'Typing updates the greeting', id: 'Mengetik memperbarui sapaannya' },
                    check:
                      'assert(text("#result") === "Hello, Ani", "after typing Ani should be \\"Hello, Ani\\", got: " + JSON.stringify(text("#result")));',
                  },
                  {
                    name: { en: 'Clearing it goes back to the guest', id: 'Mengosongkannya kembali ke tamu' },
                    check:
                      'var i = sel("input");\nvar setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i), "value").set;\nsetter.call(i, "");\ni.dispatchEvent(new Event("input", { bubbles: true }));\nawait tick(20);\nassert(text("#result") === "Hello, guest", "clearing it should go back to \\"Hello, guest\\", got: " + JSON.stringify(text("#result")));',
                  },
                ],
                id: [
                  {
                    name: { en: 'The empty state greets a guest', id: 'Keadaan kosongnya menyapa tamu' },
                    check:
                      'assert(sel("input"), "belum ada <input>");\nassert(sel("#hasil"), "belum ada <p id=\\"hasil\\">");\nassert(text("#hasil") === "Halo, tamu", "saat kosong harus \\"Halo, tamu\\", sekarang: " + JSON.stringify(text("#hasil")));',
                  },
                  {
                    name: { en: 'The input is controlled', id: 'Input-nya terkendali' },
                    check:
                      'var i = sel("input");\nassert(i.value === "", "value input harus terikat ke state, dan state awalnya kosong");\nvar setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i), "value").set;\nsetter.call(i, "Ani");\ni.dispatchEvent(new Event("input", { bubbles: true }));\nawait tick(20);\nassert(i.value === "Ani", "input harus menerima ketikan — pasangkan value dengan onChange");',
                  },
                  {
                    name: { en: 'Typing updates the greeting', id: 'Mengetik memperbarui sapaannya' },
                    check:
                      'assert(text("#hasil") === "Halo, Ani", "setelah mengetik Ani harus \\"Halo, Ani\\", sekarang: " + JSON.stringify(text("#hasil")));',
                  },
                  {
                    name: { en: 'Clearing it goes back to the guest', id: 'Mengosongkannya kembali ke tamu' },
                    check:
                      'var i = sel("input");\nvar setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i), "value").set;\nsetter.call(i, "");\ni.dispatchEvent(new Event("input", { bubbles: true }));\nawait tick(20);\nassert(text("#hasil") === "Halo, tamu", "dikosongkan harus kembali \\"Halo, tamu\\", sekarang: " + JSON.stringify(text("#hasil")));',
                  },
                ],
              },
              hints: [
                { en: 'One state holds what was typed.', id: 'Satu state menyimpan apa yang diketik.' },
                { en: 'The fallback is a condition on the state, not a default on the input.', id: 'Nilai cadangannya adalah kondisi atas state-nya, bukan nilai bawaan pada input.' },
                { en: '{name === "" ? "guest" : name}', id: '{nama === "" ? "tamu" : nama}' },
              ],
              solution: {
                en:
                  'function Greeting() {\n  const [name, setName] = React.useState("");\n\n  return (\n    <div>\n      <input value={name} onChange={(e) => setName(e.target.value)} />\n      <p id="result">Hello, {name === "" ? "guest" : name}</p>\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Greeting />);',
                id:
                  'function Sapaan() {\n  const [nama, setNama] = React.useState("");\n\n  return (\n    <div>\n      <input value={nama} onChange={(e) => setNama(e.target.value)} />\n      <p id="hasil">Halo, {nama === "" ? "tamu" : nama}</p>\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Sapaan />);',
              },
            },
          ],
        },
        {
          id: 'react-m2-s2-l2',
          title: { en: 'Lifting state up', id: 'Mengangkat state ke atas' },
          goal: { en: 'Let a child report back to its parent.', id: 'Membiarkan anak melapor ke induknya.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Data flows down', id: 'Data mengalir ke bawah' },
              body: {
                en: 'A child cannot change its parent\'s state directly, and cannot pass anything upward. What it can do is call a function the parent gave it — so the parent stays in charge of its own data.',
                id: 'Sebuah anak tidak bisa mengubah state induknya secara langsung, dan tidak bisa mengoper apa pun ke atas. Yang bisa ia lakukan adalah memanggil fungsi yang diberikan induknya — sehingga induknya tetap memegang kendali atas datanya sendiri.',
              },
              code: {
                en: 'function Button({ onAdd }) {\n  return <button onClick={onAdd}>Add</button>;\n}\n\nfunction Parent() {\n  const [n, setN] = React.useState(0);\n\n  return (\n    <div>\n      <p id="count">{n}</p>\n      <Button onAdd={() => setN(n + 1)} />\n    </div>\n  );\n}',
                id: 'function Tombol({ onTambah }) {\n  return <button onClick={onTambah}>Tambah</button>;\n}\n\nfunction Induk() {\n  const [n, setN] = React.useState(0);\n\n  return (\n    <div>\n      <p id="angka">{n}</p>\n      <Tombol onTambah={() => setN(n + 1)} />\n    </div>\n  );\n}',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'When two children need the same value', id: 'Ketika dua anak butuh nilai yang sama' },
              body: {
                en: 'Put the state in their closest common parent and pass it down to both. Two copies in two children would drift apart the moment one of them changed.',
                id: 'Taruh state-nya di induk terdekat yang sama-sama mereka miliki, lalu operkan ke keduanya. Dua salinan di dua anak akan langsung berselisih begitu salah satunya berubah.',
              },
              code: {
                en: 'function Parent() {\n  const [text, setText] = React.useState("");\n\n  return (\n    <div>\n      <Field value={text} onChange={setText} />\n      <Display value={text} />\n    </div>\n  );\n}',
                id: 'function Induk() {\n  const [teks, setTeks] = React.useState("");\n\n  return (\n    <div>\n      <Isian nilai={teks} onUbah={setTeks} />\n      <Tampilan nilai={teks} />\n    </div>\n  );\n}',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Two sibling components must show the same count. Where does it live?',
                id: 'Dua komponen bersaudara harus menampilkan hitungan yang sama. Di mana ia tinggal?',
              },
              options: [
                { en: 'In their common parent, passed down as props', id: 'Di induk bersama mereka, dioper turun sebagai props' },
                { en: 'In each of them', id: 'Di masing-masing mereka' },
                { en: 'In a global variable', id: 'Di variabel global' },
                { en: 'In the DOM', id: 'Di DOM' },
              ],
              answer: 0,
              explain: {
                en: 'One owner, passed down. Two owners means two truths, and they will disagree.',
                id: 'Satu pemilik, dioper ke bawah. Dua pemilik berarti dua kebenaran, dan keduanya akan berselisih.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              react: true,
              html: ROOT,
              prompt: {
                en: 'Write `Button({ label, onClick })` rendering a button, and `App` holding the count in `p#count` and rendering two of those buttons: `Up` and `Down`.',
                id: 'Tulis `Tombol({ label, onKlik })` yang merender sebuah tombol, dan `Aplikasi` yang menyimpan hitungannya di `p#angka` serta merender dua tombol itu: `Naik` dan `Turun`.',
              },
              starter: {
                en: 'function Button({ label, onClick }) {\n\n}\n\nfunction App() {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<App />);\n',
                id: 'function Tombol({ label, onKlik }) {\n\n}\n\nfunction Aplikasi() {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Aplikasi />);\n',
              },
              tests: {
                en: [
                  {
                    name: { en: 'Both buttons render', id: 'Kedua tombol terender' },
                    check:
                      'var b = all("button").map(function (x) { return x.textContent.trim(); });\nassert(b.indexOf("Up") !== -1, "no Up button yet, found: " + JSON.stringify(b));\nassert(b.indexOf("Down") !== -1, "no Down button yet");',
                  },
                  {
                    name: { en: 'The child reports up', id: 'Anaknya melapor ke atas' },
                    check:
                      'function button(t) { return all("button").filter(function (b) { return b.textContent.trim() === t; })[0]; }\nvar before = Number(text("#count"));\nawait click(button("Up"));\nassert(Number(text("#count")) === before + 1, "Up should add one, got: " + text("#count"));\nawait click(button("Down"));\nassert(Number(text("#count")) === before, "Down should bring it back, got: " + text("#count"));',
                  },
                  {
                    name: { en: 'The state lives in the parent', id: 'State-nya tinggal di induknya' },
                    check:
                      'var container = document.createElement("div");\ndocument.body.appendChild(container);\nReactDOM.createRoot(container).render(React.createElement(Button, { label: "Test", onClick: function () {} }));\nawait tick(60);\nvar b = container.querySelector("button");\nassert(b, "Button should render a <button>");\nassert(b.textContent.trim() === "Test", "Button should use the label prop, got: " + JSON.stringify(b.textContent.trim()));\nassert(container.querySelector("#count") === null, "Button must not hold or display its own count");\ncontainer.remove();',
                  },
                ],
                id: [
                  {
                    name: { en: 'Both buttons render', id: 'Kedua tombol terender' },
                    check:
                      'var b = all("button").map(function (x) { return x.textContent.trim(); });\nassert(b.indexOf("Naik") !== -1, "belum ada tombol Naik, yang ada: " + JSON.stringify(b));\nassert(b.indexOf("Turun") !== -1, "belum ada tombol Turun");',
                  },
                  {
                    name: { en: 'The child reports up', id: 'Anaknya melapor ke atas' },
                    check:
                      'function tombol(t) { return all("button").filter(function (b) { return b.textContent.trim() === t; })[0]; }\nvar sebelum = Number(text("#angka"));\nawait click(tombol("Naik"));\nassert(Number(text("#angka")) === sebelum + 1, "Naik harus menambah satu, sekarang: " + text("#angka"));\nawait click(tombol("Turun"));\nassert(Number(text("#angka")) === sebelum, "Turun harus mengembalikannya, sekarang: " + text("#angka"));',
                  },
                  {
                    name: { en: 'The state lives in the parent', id: 'State-nya tinggal di induknya' },
                    check:
                      'var wadah = document.createElement("div");\ndocument.body.appendChild(wadah);\nReactDOM.createRoot(wadah).render(React.createElement(Tombol, { label: "Uji", onKlik: function () {} }));\nawait tick(60);\nvar b = wadah.querySelector("button");\nassert(b, "Tombol harus merender sebuah <button>");\nassert(b.textContent.trim() === "Uji", "Tombol harus memakai prop label, sekarang: " + JSON.stringify(b.textContent.trim()));\nassert(wadah.querySelector("#angka") === null, "Tombol tidak boleh menyimpan atau menampilkan hitungannya sendiri");\nwadah.remove();',
                  },
                ],
              },
              hints: [
                { en: 'Button holds no state at all — it only renders and calls back.', id: 'Tombol sama sekali tidak menyimpan state — ia hanya merender dan memanggil balik.' },
                { en: 'The parent passes a different function to each button.', id: 'Induknya mengoper fungsi yang berbeda ke tiap tombol.' },
                { en: '<Button label="Up" onClick={() => setN(n + 1)} />', id: '<Tombol label="Naik" onKlik={() => setN(n + 1)} />' },
              ],
              solution: {
                en:
                  'function Button({ label, onClick }) {\n  return <button onClick={onClick}>{label}</button>;\n}\n\nfunction App() {\n  const [n, setN] = React.useState(0);\n\n  return (\n    <div>\n      <p id="count">{n}</p>\n      <Button label="Up" onClick={() => setN(n + 1)} />\n      <Button label="Down" onClick={() => setN(n - 1)} />\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<App />);',
                id:
                  'function Tombol({ label, onKlik }) {\n  return <button onClick={onKlik}>{label}</button>;\n}\n\nfunction Aplikasi() {\n  const [n, setN] = React.useState(0);\n\n  return (\n    <div>\n      <p id="angka">{n}</p>\n      <Tombol label="Naik" onKlik={() => setN(n + 1)} />\n      <Tombol label="Turun" onKlik={() => setN(n - 1)} />\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Aplikasi />);',
              },
            },
          ],
        },
      ],
      project: {
        id: 'react-m2-s2-p',
        runtime: 'web',
        react: true,
        html: ROOT,
        title: { en: 'To-do list', id: 'Daftar tugas' },
        brief: {
          en: 'A form, a list built from state, and items you can tick off.',
          id: 'Sebuah formulir, daftar yang dibangun dari state, dan item yang bisa ditandai selesai.',
        },
        requirements: [
          { en: 'A controlled `input` and a `form` that adds the trimmed text.', id: 'Sebuah `input` terkendali dan `form` yang menambahkan teksnya setelah di-trim.' },
          { en: 'Empty or whitespace-only entries add nothing.', id: 'Masukan kosong atau berisi spasi saja tidak menambah apa pun.' },
          { en: 'Adding clears the input.', id: 'Penambahan mengosongkan input-nya.' },
          { en: 'Each task is an `li` with a `key`; clicking it toggles the class `done`.', id: 'Tiap tugas adalah `li` ber-`key`; mengkliknya menyalakan-mematikan class `selesai`.' },
          { en: '`p#remaining` reads `2 of 3 not done`.', id: '`p#sisa` bertuliskan `2 dari 3 belum selesai`.' },
        ],
        starter: {
          en: 'function Tasks() {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Tasks />);\n',
          id: 'function Tugas() {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Tugas />);\n',
        },
        tests: {
          en: [
            {
              name: { en: 'The form adds and clears', id: 'Formulirnya menambah dan mengosongkan' },
              check:
                'async function add(text) {\n  var i = sel("input");\n  var setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i), "value").set;\n  setter.call(i, text);\n  i.dispatchEvent(new Event("input", { bubbles: true }));\n  await tick(20);\n  sel("form").dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));\n  await tick(30);\n}\nassert(sel("form"), "no <form> yet");\nassert(sel("input"), "no <input> yet");\nvar before = all("li").length;\nawait add("Learn");\nassert(all("li").length === before + 1, "one item should be added, got: " + all("li").length);\nassert(sel("input").value === "", "the input should be cleared after adding");',
            },
            {
              name: { en: 'Empty entries are refused', id: 'Masukan kosong ditolak' },
              check:
                'async function add(text) {\n  var i = sel("input");\n  var setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i), "value").set;\n  setter.call(i, text);\n  i.dispatchEvent(new Event("input", { bubbles: true }));\n  await tick(20);\n  sel("form").dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));\n  await tick(30);\n}\nvar before = all("li").length;\nawait add("");\nawait add("   ");\nassert(all("li").length === before, "empty and whitespace must not add an item");',
            },
            {
              name: { en: 'Clicking toggles both ways', id: 'Klik menyalakan dan mematikan' },
              check:
                'var li = all("li")[0];\nassert(li, "no item to click yet");\nvar original = li.classList.contains("done");\nawait click(li);\nassert(all("li")[0].classList.contains("done") !== original, "a click should change the done status");\nawait click(all("li")[0]);\nassert(all("li")[0].classList.contains("done") === original, "a second click should undo it");',
            },
            {
              name: { en: 'The count follows the list', id: 'Hitungannya mengikuti daftarnya' },
              check:
                'function expected() {\n  var li = all("li");\n  var pending = li.filter(function (e) { return !e.classList.contains("done"); }).length;\n  return pending + " of " + li.length + " not done";\n}\nassert(sel("#remaining"), "no <p id=\\"remaining\\"> yet");\nassert(text("#remaining") === expected(), "#remaining should be " + JSON.stringify(expected()) + ", got: " + JSON.stringify(text("#remaining")));\nawait click(all("li")[0]);\nassert(text("#remaining") === expected(), "after marking, #remaining should be " + JSON.stringify(expected()) + ", got: " + JSON.stringify(text("#remaining")));',
            },
            {
              name: { en: 'No reload, no key warning', id: 'Tanpa muat ulang, tanpa peringatan key' },
              check:
                'var ev = new Event("submit", { cancelable: true, bubbles: true });\nsel("form").dispatchEvent(ev);\nassert(ev.defaultPrevented, "call e.preventDefault() in onSubmit");\nassert(out().toLowerCase().indexOf("key") === -1, "React warned about key: " + JSON.stringify(out()));\nassert(error() === null, "there was an error: " + error());',
            },
          ],
          id: [
            {
              name: { en: 'The form adds and clears', id: 'Formulirnya menambah dan mengosongkan' },
              check:
                'async function tambah(teks) {\n  var i = sel("input");\n  var setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i), "value").set;\n  setter.call(i, teks);\n  i.dispatchEvent(new Event("input", { bubbles: true }));\n  await tick(20);\n  sel("form").dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));\n  await tick(30);\n}\nassert(sel("form"), "belum ada <form>");\nassert(sel("input"), "belum ada <input>");\nvar sebelum = all("li").length;\nawait tambah("Belajar");\nassert(all("li").length === sebelum + 1, "satu item harus bertambah, sekarang: " + all("li").length);\nassert(sel("input").value === "", "input harus dikosongkan setelah ditambah");',
            },
            {
              name: { en: 'Empty entries are refused', id: 'Masukan kosong ditolak' },
              check:
                'async function tambah(teks) {\n  var i = sel("input");\n  var setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i), "value").set;\n  setter.call(i, teks);\n  i.dispatchEvent(new Event("input", { bubbles: true }));\n  await tick(20);\n  sel("form").dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));\n  await tick(30);\n}\nvar sebelum = all("li").length;\nawait tambah("");\nawait tambah("   ");\nassert(all("li").length === sebelum, "kosong dan spasi tidak boleh menambah item");',
            },
            {
              name: { en: 'Clicking toggles both ways', id: 'Klik menyalakan dan mematikan' },
              check:
                'var li = all("li")[0];\nassert(li, "belum ada item untuk diklik");\nvar semula = li.classList.contains("selesai");\nawait click(li);\nassert(all("li")[0].classList.contains("selesai") !== semula, "klik harus mengubah status selesai");\nawait click(all("li")[0]);\nassert(all("li")[0].classList.contains("selesai") === semula, "klik kedua harus mengembalikannya");',
            },
            {
              name: { en: 'The count follows the list', id: 'Hitungannya mengikuti daftarnya' },
              check:
                'function harusnya() {\n  var li = all("li");\n  var belum = li.filter(function (e) { return !e.classList.contains("selesai"); }).length;\n  return belum + " dari " + li.length + " belum selesai";\n}\nassert(sel("#sisa"), "belum ada <p id=\\"sisa\\">");\nassert(text("#sisa") === harusnya(), "#sisa harus " + JSON.stringify(harusnya()) + ", sekarang: " + JSON.stringify(text("#sisa")));\nawait click(all("li")[0]);\nassert(text("#sisa") === harusnya(), "setelah ditandai, #sisa harus " + JSON.stringify(harusnya()) + ", sekarang: " + JSON.stringify(text("#sisa")));',
            },
            {
              name: { en: 'No reload, no key warning', id: 'Tanpa muat ulang, tanpa peringatan key' },
              check:
                'var ev = new Event("submit", { cancelable: true, bubbles: true });\nsel("form").dispatchEvent(ev);\nassert(ev.defaultPrevented, "panggil e.preventDefault() pada onSubmit");\nassert(out().toLowerCase().indexOf("key") === -1, "React memperingatkan soal key: " + JSON.stringify(out()));\nassert(error() === null, "ada error: " + error());',
            },
          ],
        },
        hints: [
          { en: 'Two pieces of state: the text being typed, and the array of tasks.', id: 'Dua state: teks yang sedang diketik, dan array tugasnya.' },
          { en: 'Each task is an object with an id, a text, and a done flag.', id: 'Tiap tugas adalah object dengan id, teks, dan penanda selesai.' },
          { en: 'Toggling replaces the array — map, returning a new object for the one that changed.', id: 'Menandai selesai mengganti array-nya — map, mengembalikan object baru untuk yang berubah.' },
          { en: 'The count is derived with filter at render time; never store it in state.', id: 'Hitungannya diturunkan dengan filter saat render; jangan pernah menyimpannya di state.' },
        ],
        solution: {
          en:
            'function Tasks() {\n  const [text, setText] = React.useState("");\n  const [tasks, setTasks] = React.useState([]);\n\n  function submit(e) {\n    e.preventDefault();\n    const trimmed = text.trim();\n    if (trimmed === "") {\n      return;\n    }\n    setTasks([...tasks, { id: Date.now(), text: trimmed, done: false }]);\n    setText("");\n  }\n\n  function toggle(id) {\n    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));\n  }\n\n  const pending = tasks.filter((t) => !t.done).length;\n\n  return (\n    <div>\n      <form onSubmit={submit}>\n        <input value={text} onChange={(e) => setText(e.target.value)} />\n        <button type="submit">Add</button>\n      </form>\n\n      <p id="remaining">\n        {pending} of {tasks.length} not done\n      </p>\n\n      <ul>\n        {tasks.map((t) => (\n          <li key={t.id} className={t.done ? "done" : ""} onClick={() => toggle(t.id)}>\n            {t.text}\n          </li>\n        ))}\n      </ul>\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Tasks />);',
          id:
            'function Tugas() {\n  const [teks, setTeks] = React.useState("");\n  const [daftar, setDaftar] = React.useState([]);\n\n  function kirim(e) {\n    e.preventDefault();\n    const bersih = teks.trim();\n    if (bersih === "") {\n      return;\n    }\n    setDaftar([...daftar, { id: Date.now(), teks: bersih, selesai: false }]);\n    setTeks("");\n  }\n\n  function tandai(id) {\n    setDaftar(daftar.map((t) => (t.id === id ? { ...t, selesai: !t.selesai } : t)));\n  }\n\n  const belum = daftar.filter((t) => !t.selesai).length;\n\n  return (\n    <div>\n      <form onSubmit={kirim}>\n        <input value={teks} onChange={(e) => setTeks(e.target.value)} />\n        <button type="submit">Tambah</button>\n      </form>\n\n      <p id="sisa">\n        {belum} dari {daftar.length} belum selesai\n      </p>\n\n      <ul>\n        {daftar.map((t) => (\n          <li key={t.id} className={t.selesai ? "selesai" : ""} onClick={() => tandai(t.id)}>\n            {t.teks}\n          </li>\n        ))}\n      </ul>\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Tugas />);',
        },
        xp: 50,
      },
    },
  ],
}
