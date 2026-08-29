import type { Module } from '../types'

/** Module 1 — JSX, components, props, lists and conditions.
 *
 *  Every step renders into `<div id="root">`, and React and ReactDOM are already
 *  globals on the page. The JSX is transpiled in the app before the frame is
 *  built, so a syntax error is reported as a syntax error rather than silence. */

const ROOT = '<div id="root"></div>'

export const module1: Module = {
  id: 'react-m1',
  title: { en: 'Components and JSX', id: 'Komponen dan JSX' },
  summary: {
    en: 'Describe a piece of interface, give it inputs, and repeat it over data.',
    id: 'Menjelaskan sepotong antarmuka, memberinya masukan, dan mengulangnya atas data.',
  },
  submodules: [
    /* -------------------------------------------------- 1.1 JSX and components */
    {
      id: 'react-m1-s1',
      title: { en: 'Your First Component', id: 'Komponen Pertamamu' },
      summary: {
        en: 'JSX, a function that returns it, and the props that feed it.',
        id: 'JSX, sebuah fungsi yang mengembalikannya, dan props yang memberinya masukan.',
      },
      lessons: [
        {
          id: 'react-m1-s1-l1',
          title: { en: 'JSX is not HTML', id: 'JSX bukan HTML' },
          goal: { en: 'Render markup from JavaScript.', id: 'Merender markup dari JavaScript.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Markup that lives in a script', id: 'Markup yang tinggal di dalam skrip' },
              body: {
                en: 'JSX looks like HTML but it is JavaScript — it compiles down to function calls before the browser ever sees it. That is why you can hold it in a variable, return it from a function, and put it in an array.',
                id: 'JSX tampak seperti HTML tetapi ia JavaScript — ia dikompilasi menjadi pemanggilan fungsi sebelum peramban melihatnya. Karena itulah kamu bisa menyimpannya di variabel, mengembalikannya dari fungsi, dan menaruhnya di dalam array.',
              },
              code: 'const judul = <h1>Halo, React</h1>;\n\nReactDOM.createRoot(document.querySelector("#root")).render(judul);',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Braces let JavaScript back in', id: 'Kurung kurawal mengembalikan JavaScript' },
              body: {
                en: 'Inside JSX, `{ }` means "evaluate this expression and put the result here". Any expression works — a variable, a calculation, a function call. A statement like `if` does not, because a statement has no value.',
                id: 'Di dalam JSX, `{ }` berarti "hitung ekspresi ini dan taruh hasilnya di sini". Ekspresi apa pun bisa — variabel, perhitungan, pemanggilan fungsi. Pernyataan seperti `if` tidak bisa, karena pernyataan tidak punya nilai.',
              },
              code: 'const nama = "Ani";\nconst nilai = 88;\n\nconst kartu = (\n  <p>\n    {nama} mendapat {nilai + 2}\n  </p>\n);\n\nReactDOM.createRoot(document.querySelector("#root")).render(kartu);',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Three rules that catch everyone', id: 'Tiga aturan yang menjerat semua orang' },
              body: {
                en: 'One: every tag closes, including `<br />`. Two: there must be a single root — wrap siblings in a `<div>` or an empty `<> </>`. Three: `class` is a reserved word in JavaScript, so JSX spells it `className`, and `for` becomes `htmlFor`.',
                id: 'Satu: setiap tag ditutup, termasuk `<br />`. Dua: harus ada satu akar tunggal — bungkus elemen bersaudara dalam `<div>` atau `<> </>` kosong. Tiga: `class` adalah kata kunci JavaScript, jadi JSX menuliskannya `className`, dan `for` menjadi `htmlFor`.',
              },
              code: {
                en: '// wrong: two roots\n// const x = <h1>A</h1><p>B</p>;\n\n// correct\nconst x = (\n  <>\n    <h1 className="judul">A</h1>\n    <p>B</p>\n  </>\n);',
                id: '// salah: dua akar\n// const x = <h1>A</h1><p>B</p>;\n\n// benar\nconst x = (\n  <>\n    <h1 className="judul">A</h1>\n    <p>B</p>\n  </>\n);',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'Why does JSX use `className`?', id: 'Kenapa JSX memakai `className`?' },
              options: [
                { en: '`class` is a reserved word in JavaScript', id: '`class` adalah kata kunci di JavaScript' },
                { en: 'React renames every attribute', id: 'React mengganti nama semua atribut' },
                { en: 'It is faster', id: 'Ia lebih cepat' },
                { en: '`class` only works in CSS', id: '`class` hanya berlaku di CSS' },
              ],
              answer: 0,
              explain: {
                en: 'JSX compiles to JavaScript objects, and `class` cannot be a plain property name there without care. The rendered HTML still gets a normal `class`.',
                id: 'JSX dikompilasi menjadi object JavaScript, dan `class` tak bisa jadi nama properti biasa di situ tanpa kerepotan. HTML hasilnya tetap mendapat `class` biasa.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: { en: 'Put the value into the markup.', id: 'Masukkan nilainya ke dalam markup.' },
              template: 'const nama = "Ani";\nconst el = <p>Halo, ___nama___</p>;',
              blanks: ['{', '}'],
              explain: {
                en: 'Braces switch back into JavaScript. Without them you would get the literal text "nama".',
                id: 'Kurung kurawal mengembalikanmu ke JavaScript. Tanpa itu kamu mendapat teks harfiah "nama".',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              react: true,
              html: ROOT,
              prompt: {
                en: 'Render an `h1` with the class `judul` reading `Nunada Academy`, and below it a `p` reading `Ada 4 kursus` — with the 4 coming from a `const jumlah = 4`.',
                id: 'Render sebuah `h1` ber-class `judul` bertuliskan `Nunada Academy`, dan di bawahnya sebuah `p` bertuliskan `Ada 4 kursus` — dengan angka 4 berasal dari `const jumlah = 4`.',
              },
              starter: 'const jumlah = 4;\n\nReactDOM.createRoot(document.querySelector("#root")).render(\n\n);\n',
              tests: [
                {
                  name: { en: 'The heading renders with its class', id: 'Judulnya terender dengan class-nya' },
                  check:
                    'assert(sel("#root h1"), "belum ada <h1> di dalam #root");\nassert(text("#root h1") === "Nunada Academy", "teks h1: " + JSON.stringify(text("#root h1")));\nassert(sel("#root h1").className === "judul", "h1 butuh className=\\"judul\\", sekarang: " + JSON.stringify(sel("#root h1").className));',
                },
                {
                  name: { en: 'The paragraph reads the variable', id: 'Paragrafnya membaca variabelnya' },
                  check:
                    'assert(sel("#root p"), "belum ada <p>");\nassert(text("#root p") === "Ada 4 kursus", "teks p: " + JSON.stringify(text("#root p")));\nassert(typeof jumlah !== "undefined" && jumlah === 4, "nilai 4 harus datang dari const jumlah");',
                },
                {
                  name: { en: 'Nothing threw', id: 'Tidak ada yang error' },
                  check: 'assert(error() === null, "ada error: " + error());',
                },
              ],
              hints: [
                { en: 'Two elements need one wrapper — a fragment `<> </>` is enough.', id: 'Dua elemen butuh satu pembungkus — fragment `<> </>` sudah cukup.' },
                { en: 'The class attribute is written className in JSX.', id: 'Atribut class ditulis className di JSX.' },
                { en: '<p>Ada {jumlah} kursus</p>', id: '<p>Ada {jumlah} kursus</p>' },
              ],
              solution:
                'const jumlah = 4;\n\nReactDOM.createRoot(document.querySelector("#root")).render(\n  <>\n    <h1 className="judul">Nunada Academy</h1>\n    <p>Ada {jumlah} kursus</p>\n  </>\n);',
            },
          ],
        },
        {
          id: 'react-m1-s1-l2',
          title: { en: 'Components and props', id: 'Komponen dan props' },
          goal: { en: 'Write a reusable piece of interface.', id: 'Menulis sepotong antarmuka yang bisa dipakai ulang.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A component is a function', id: 'Komponen adalah sebuah fungsi' },
              body: {
                en: 'It takes data and returns JSX. The name must start with a capital letter — that is how JSX tells your component apart from a plain `<div>`. Written lowercase, React would look for an HTML tag by that name and render nothing.',
                id: 'Ia menerima data dan mengembalikan JSX. Namanya harus diawali huruf kapital — begitulah JSX membedakan komponenmu dari `<div>` biasa. Ditulis huruf kecil, React akan mencari tag HTML bernama itu dan tidak merender apa pun.',
              },
              code: 'function Sapaan() {\n  return <h1>Halo!</h1>;\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Sapaan />);',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Props are the inputs', id: 'Props adalah masukannya' },
              body: {
                en: 'Attributes on your component arrive as one object. Destructuring it in the signature keeps the body readable, and makes the inputs visible at a glance.',
                id: 'Atribut pada komponenmu tiba sebagai satu object. Membongkarnya di tanda tangan fungsi menjaga badannya tetap terbaca, dan membuat masukannya terlihat sekilas.',
              },
              code: 'function Sapaan({ nama, umur }) {\n  return (\n    <p>\n      {nama}, {umur} tahun\n    </p>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Sapaan nama="Ani" umur={17} />);',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Quotes for text, braces for anything else', id: 'Kutip untuk teks, kurawal untuk selainnya' },
              body: {
                en: '`nama="Ani"` passes the string. `umur={17}` passes the number — without braces it would be the string `"17"`. Anything that is not a plain string needs braces.',
                id: '`nama="Ani"` mengoper string-nya. `umur={17}` mengoper angkanya — tanpa kurawal ia akan menjadi string `"17"`. Apa pun yang bukan string biasa butuh kurawal.',
              },
              code: '<Kartu nama="Ani" umur={17} aktif={true} nilai={[80, 90]} />',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'You wrote `function kartu() {...}` and `<kartu />` renders nothing. Why?',
                id: 'Kamu menulis `function kartu() {...}` dan `<kartu />` tidak merender apa pun. Kenapa?',
              },
              options: [
                { en: 'Lowercase means React looks for an HTML tag named kartu', id: 'Huruf kecil membuat React mencari tag HTML bernama kartu' },
                { en: 'A component must be an arrow function', id: 'Komponen harus arrow function' },
                { en: 'It needs to be exported', id: 'Ia harus di-export' },
                { en: 'Components cannot take zero props', id: 'Komponen tidak boleh tanpa props' },
              ],
              answer: 0,
              explain: {
                en: 'Capitalise it. This is the single most common silent failure in React.',
                id: 'Kapitalkan namanya. Ini kegagalan senyap paling umum di React.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: { en: 'Assemble a component and render it.', id: 'Susun sebuah komponen dan render ia.' },
              lines: [
                'function Kartu({ nama }) {',
                '  return <p>{nama}</p>;',
                '}',
                '',
                'ReactDOM.createRoot(document.querySelector("#root")).render(<Kartu nama="Ani" />);',
              ],
              explain: {
                en: 'The component must be defined before it is rendered, and the prop is passed as an attribute.',
                id: 'Komponennya harus didefinisikan sebelum dirender, dan prop-nya dioper sebagai atribut.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              react: true,
              html: ROOT,
              prompt: {
                en: 'Write `Kursus({ nama, modul })` rendering `<li>` with the text `Python — 9 modul`, and render three of them inside a `ul`.',
                id: 'Tulis `Kursus({ nama, modul })` yang merender `<li>` bertuliskan `Python — 9 modul`, lalu render tiga di antaranya di dalam sebuah `ul`.',
              },
              starter: 'function Kursus({ nama, modul }) {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(\n\n);\n',
              tests: [
                {
                  name: { en: 'Three list items render', id: 'Tiga item daftar terender' },
                  check:
                    'assert(sel("#root ul"), "belum ada <ul>");\nassert(all("#root ul li").length === 3, "harus tiga <li>, sekarang: " + all("#root ul li").length);',
                },
                {
                  name: { en: 'The component uses both props', id: 'Komponennya memakai kedua props' },
                  check:
                    'var isi = all("#root li").map(function (e) { return e.textContent.trim(); });\nisi.forEach(function (t, i) {\n  assert(/^.+ — \\d+ modul$/.test(t), "item ke-" + (i + 1) + " harus berbentuk \\"Nama — N modul\\", sekarang: " + JSON.stringify(t));\n});',
                },
                {
                  name: { en: 'The items differ, so props really flow', id: 'Itemnya berbeda, jadi props benar-benar mengalir' },
                  check:
                    'var isi = all("#root li").map(function (e) { return e.textContent.trim(); });\nvar unik = isi.filter(function (v, i) { return isi.indexOf(v) === i; });\nassert(unik.length === 3, "ketiga item harus berbeda — oper props yang berbeda, sekarang: " + JSON.stringify(isi));',
                },
              ],
              hints: [
                { en: 'The component returns one li; the render call places three of them.', id: 'Komponennya mengembalikan satu li; pemanggilan render menaruh tiga di antaranya.' },
                { en: 'The number is passed with braces: modul={9}', id: 'Angkanya dioper dengan kurawal: modul={9}' },
                { en: 'return <li>{nama} — {modul} modul</li>;', id: 'return <li>{nama} — {modul} modul</li>;' },
              ],
              solution:
                'function Kursus({ nama, modul }) {\n  return (\n    <li>\n      {nama} — {modul} modul\n    </li>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(\n  <ul>\n    <Kursus nama="Python" modul={9} />\n    <Kursus nama="HTML" modul={4} />\n    <Kursus nama="CSS" modul={4} />\n  </ul>\n);',
            },
          ],
        },
      ],
      project: {
        id: 'react-m1-s1-p',
        runtime: 'web',
        react: true,
        html: ROOT,
        title: { en: 'Profile card', id: 'Kartu profil' },
        brief: {
          en: 'One component, used twice, with different data each time.',
          id: 'Satu komponen, dipakai dua kali, dengan data berbeda tiap kalinya.',
        },
        requirements: [
          { en: 'Write `Profil({ nama, peran, kursus })`.', id: 'Tulis `Profil({ nama, peran, kursus })`.' },
          { en: 'It renders a `div` with the class `kartu`.', id: 'Ia merender sebuah `div` ber-class `kartu`.' },
          { en: 'Inside: an `h2` with the name, a `p` with the class `peran`, and a `p` reading `4 kursus`.', id: 'Di dalamnya: `h2` berisi nama, `p` ber-class `peran`, dan `p` bertuliskan `4 kursus`.' },
          { en: 'Render two cards with different data.', id: 'Render dua kartu dengan data berbeda.' },
        ],
        starter: 'function Profil({ nama, peran, kursus }) {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(\n\n);\n',
        tests: [
          {
            name: { en: 'Two cards render', id: 'Dua kartu terender' },
            check: 'assert(all("#root .kartu").length === 2, "harus dua .kartu, sekarang: " + all("#root .kartu").length);',
          },
          {
            name: { en: 'Each card has its three parts', id: 'Tiap kartu punya tiga bagiannya' },
            check:
              'all("#root .kartu").forEach(function (k, i) {\n  assert(k.querySelector("h2"), "kartu ke-" + (i + 1) + " butuh <h2>");\n  assert(k.querySelector("h2").textContent.trim().length > 0, "nama tidak boleh kosong");\n  assert(k.querySelector("p.peran"), "kartu ke-" + (i + 1) + " butuh <p className=\\"peran\\">");\n  assert(k.querySelectorAll("p").length >= 2, "kartu ke-" + (i + 1) + " butuh dua paragraf");\n});',
          },
          {
            name: { en: 'The course count reads from its prop', id: 'Jumlah kursusnya dibaca dari prop-nya' },
            check:
              'all("#root .kartu").forEach(function (k, i) {\n  var teks = k.textContent;\n  assert(/\\d+ kursus/.test(teks), "kartu ke-" + (i + 1) + " harus memuat \\"N kursus\\", isinya: " + JSON.stringify(teks));\n});',
          },
          {
            name: { en: 'The two cards really differ', id: 'Kedua kartunya benar-benar berbeda' },
            check:
              'var k = all("#root .kartu");\nassert(k[0].textContent.trim() !== k[1].textContent.trim(), "kedua kartu harus menerima data berbeda");',
          },
          {
            name: { en: 'Nothing threw', id: 'Tidak ada yang error' },
            check: 'assert(error() === null, "ada error: " + error());',
          },
        ],
        hints: [
          { en: 'The component is written once; the render call decides what goes in it.', id: 'Komponennya ditulis sekali; pemanggilan render yang menentukan isinya.' },
          { en: 'Two cards need a wrapper — a fragment works.', id: 'Dua kartu butuh pembungkus — fragment sudah cukup.' },
          { en: 'className, not class, on every element.', id: 'className, bukan class, di tiap elemen.' },
        ],
        solution:
          'function Profil({ nama, peran, kursus }) {\n  return (\n    <div className="kartu">\n      <h2>{nama}</h2>\n      <p className="peran">{peran}</p>\n      <p>{kursus} kursus</p>\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(\n  <>\n    <Profil nama="Ani" peran="Siswa" kursus={4} />\n    <Profil nama="Budi" peran="Pengajar" kursus={9} />\n  </>\n);',
        xp: 50,
      },
    },

    /* ---------------------------------------------- 1.2 lists and conditions */
    {
      id: 'react-m1-s2',
      title: { en: 'Lists and Conditions', id: 'Daftar dan Kondisi' },
      summary: {
        en: 'Turn an array into elements, and show a piece only when it applies.',
        id: 'Mengubah array menjadi elemen, dan menampilkan sesuatu hanya saat relevan.',
      },
      lessons: [
        {
          id: 'react-m1-s2-l1',
          title: { en: 'Rendering a list', id: 'Merender daftar' },
          goal: { en: 'Map data to elements.', id: 'Memetakan data menjadi elemen.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'map is the whole trick', id: 'map adalah seluruh triknya' },
              body: {
                en: 'There is no loop syntax in JSX. You return an array of elements instead, and `map` is what produces it — the same `map` from the JavaScript course, returning JSX rather than numbers.',
                id: 'Tidak ada sintaks perulangan di JSX. Kamu justru mengembalikan array berisi elemen, dan `map`-lah yang menghasilkannya — `map` yang sama dari kursus JavaScript, hanya mengembalikan JSX alih-alih angka.',
              },
              code: 'const kota = ["Surabaya", "Malang", "Kediri"];\n\nfunction Daftar() {\n  return (\n    <ul>\n      {kota.map((k) => (\n        <li key={k}>{k}</li>\n      ))}\n    </ul>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Daftar />);',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'key tells React which is which', id: 'key memberi tahu React yang mana yang mana' },
              body: {
                en: 'When the list changes, React compares the new elements to the old ones. `key` is how it recognises an item it has seen before, so it can move it rather than rebuild it. Use something stable from the data — an id. The array index works only while nothing is ever inserted, removed or reordered.',
                id: 'Saat daftarnya berubah, React membandingkan elemen baru dengan yang lama. `key` adalah caranya mengenali item yang pernah ia lihat, sehingga ia bisa memindahkannya alih-alih membangunnya ulang. Pakai sesuatu yang stabil dari datanya — sebuah id. Indeks array hanya aman selama tidak pernah ada penyisipan, penghapusan, atau penyusunan ulang.',
              },
              code: 'const siswa = [\n  { id: 1, nama: "Ani" },\n  { id: 2, nama: "Budi" },\n];\n\nconst daftar = siswa.map((s) => <li key={s.id}>{s.nama}</li>);',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Why prefer an id over the array index as a key?',
                id: 'Kenapa id lebih baik daripada indeks array sebagai key?',
              },
              options: [
                { en: 'The index shifts when an item is inserted or removed', id: 'Indeks bergeser saat item disisipkan atau dihapus' },
                { en: 'Indexes are slower', id: 'Indeks lebih lambat' },
                { en: 'React forbids numbers as keys', id: 'React melarang angka sebagai key' },
                { en: 'There is no difference', id: 'Tidak ada bedanya' },
              ],
              answer: 0,
              explain: {
                en: 'After a shift, index 0 names a different item than before, and React reuses the wrong element — typing in a list of inputs is where this bites.',
                id: 'Setelah bergeser, indeks 0 menamai item yang berbeda dari sebelumnya, dan React memakai ulang elemen yang keliru — mengetik di daftar berisi input adalah tempat ini menggigit.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              react: true,
              html: ROOT,
              prompt: {
                en: 'Given the `kursus` array, render one `li` per course reading `Python (9)`, each with a `key` taken from `id`.',
                id: 'Dengan array `kursus` yang diberikan, render satu `li` per kursus bertuliskan `Python (9)`, masing-masing ber-`key` yang diambil dari `id`.',
              },
              starter:
                'const kursus = [\n  { id: 1, nama: "Python", modul: 9 },\n  { id: 2, nama: "HTML", modul: 4 },\n  { id: 3, nama: "CSS", modul: 4 },\n];\n\nfunction Daftar() {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Daftar />);\n',
              tests: [
                {
                  name: { en: 'One item per course', id: 'Satu item per kursus' },
                  check:
                    'assert(all("#root li").length === kursus.length, "harus " + kursus.length + " item, sekarang: " + all("#root li").length);',
                },
                {
                  name: { en: 'Each reads from the data', id: 'Tiap item membaca dari datanya' },
                  check:
                    'var isi = all("#root li").map(function (e) { return e.textContent.trim(); });\nkursus.forEach(function (k, i) {\n  var mau = k.nama + " (" + k.modul + ")";\n  assert(isi[i] === mau, "item ke-" + (i + 1) + " harus " + JSON.stringify(mau) + ", sekarang: " + JSON.stringify(isi[i]));\n});',
                },
                {
                  name: { en: 'No key warning was logged', id: 'Tidak ada peringatan key' },
                  check:
                    'assert(out().toLowerCase().indexOf("key") === -1, "React memperingatkan soal key — beri key={k.id} pada tiap item. Pesan: " + JSON.stringify(out()));',
                },
              ],
              hints: [
                { en: 'The component returns a ul with the mapped array inside braces.', id: 'Komponennya mengembalikan ul dengan array hasil map di dalam kurawal.' },
                { en: 'kursus.map((k) => …) returns one element per course.', id: 'kursus.map((k) => …) mengembalikan satu elemen per kursus.' },
                { en: '<li key={k.id}>{k.nama} ({k.modul})</li>', id: '<li key={k.id}>{k.nama} ({k.modul})</li>' },
              ],
              solution:
                'const kursus = [\n  { id: 1, nama: "Python", modul: 9 },\n  { id: 2, nama: "HTML", modul: 4 },\n  { id: 3, nama: "CSS", modul: 4 },\n];\n\nfunction Daftar() {\n  return (\n    <ul>\n      {kursus.map((k) => (\n        <li key={k.id}>\n          {k.nama} ({k.modul})\n        </li>\n      ))}\n    </ul>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Daftar />);',
            },
          ],
        },
        {
          id: 'react-m1-s2-l2',
          title: { en: 'Showing something conditionally', id: 'Menampilkan secara bersyarat' },
          goal: { en: 'Render a piece only when it applies.', id: 'Merender sesuatu hanya bila relevan.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: '&& for "show it or do not"', id: '&& untuk "tampilkan atau tidak"' },
              body: {
                en: 'When the left side is true, the right side is rendered; when it is false, nothing is. React quietly ignores `false`, `null` and `undefined`, which is what makes this read cleanly.',
                id: 'Ketika sisi kirinya benar, sisi kanannya dirender; ketika salah, tidak ada apa-apa. React diam-diam mengabaikan `false`, `null`, dan `undefined`, dan itulah yang membuat ini terbaca rapi.',
              },
              code: 'function Kartu({ nama, baru }) {\n  return (\n    <div>\n      <h2>{nama}</h2>\n      {baru && <span className="lencana">Baru</span>}\n    </div>\n  );\n}',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The zero trap', id: 'Jebakan angka nol' },
              body: {
                en: 'React ignores `false` but it *renders* `0`. So `{jumlah && <p>…</p>}` puts a bare `0` on the page when the count is zero. Compare explicitly — `{jumlah > 0 && …}` — and the problem never appears.',
                id: 'React mengabaikan `false` tetapi ia *merender* `0`. Jadi `{jumlah && <p>…</p>}` menaruh angka `0` telanjang di halaman saat jumlahnya nol. Bandingkan secara eksplisit — `{jumlah > 0 && …}` — dan masalahnya tak pernah muncul.',
              },
              code: {
                en: 'const jumlah = 0;\n\n// puts a 0 on the page\n// {jumlah && <p>Ada isinya</p>}\n\n// correct\n// {jumlah > 0 && <p>Ada isinya</p>}',
                id: 'const jumlah = 0;\n\n// menampilkan 0 di halaman\n// {jumlah && <p>Ada isinya</p>}\n\n// benar\n// {jumlah > 0 && <p>Ada isinya</p>}',
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'A ternary when there are two outcomes', id: 'Ternary saat ada dua kemungkinan' },
              body: {
                en: '`&&` shows something or nothing. When you need one thing *or* another, use a ternary — it is an expression, so it fits inside JSX where an `if` would not.',
                id: '`&&` menampilkan sesuatu atau tidak sama sekali. Ketika kamu butuh satu hal *atau* yang lain, pakai ternary — ia sebuah ekspresi, jadi muat di dalam JSX tempat `if` tidak muat.',
              },
              code: 'function Status({ siap }) {\n  return <p>{siap ? "Siap" : "Segera hadir"}</p>;\n}',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: '`{pesan.length && <p>{pesan}</p>}` with an empty string renders what?',
                id: '`{pesan.length && <p>{pesan}</p>}` dengan string kosong merender apa?',
              },
              options: [
                { en: 'A bare 0 on the page', id: 'Angka 0 telanjang di halaman' },
                { en: 'Nothing', id: 'Tidak ada apa-apa' },
                { en: 'An empty paragraph', id: 'Paragraf kosong' },
                { en: 'An error', id: 'Error' },
              ],
              answer: 0,
              explain: {
                en: 'length is 0, and React renders the number 0. Write `pesan.length > 0 &&` instead.',
                id: 'length bernilai 0, dan React merender angka 0. Tulis `pesan.length > 0 &&` sebagai gantinya.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              react: true,
              html: ROOT,
              prompt: {
                en: 'Render one `li` per course. A ready course shows `Python — siap`; an unready one shows `React — segera`. Additionally, courses with `baru: true` get a `<span className="baru">Baru</span>` inside their item.',
                id: 'Render satu `li` per kursus. Kursus yang siap menampilkan `Python — siap`; yang belum menampilkan `React — segera`. Selain itu, kursus dengan `baru: true` mendapat `<span className="baru">Baru</span>` di dalam itemnya.',
              },
              starter:
                'const kursus = [\n  { id: 1, nama: "Python", siap: true, baru: false },\n  { id: 2, nama: "CSS", siap: true, baru: true },\n  { id: 3, nama: "React", siap: false, baru: false },\n];\n\nfunction Daftar() {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Daftar />);\n',
              tests: [
                {
                  name: { en: 'Every course is listed', id: 'Semua kursus terdaftar' },
                  check: 'assert(all("#root li").length === 3, "harus tiga item, sekarang: " + all("#root li").length);',
                },
                {
                  name: { en: 'Ready and unready read differently', id: 'Yang siap dan belum terbaca berbeda' },
                  check:
                    'var li = all("#root li");\nkursus.forEach(function (k, i) {\n  var teks = li[i].textContent;\n  var mau = k.siap ? "siap" : "segera";\n  assert(teks.indexOf(k.nama) !== -1, "item ke-" + (i + 1) + " harus menyebut " + k.nama);\n  assert(teks.indexOf(mau) !== -1, k.nama + " harus bertuliskan " + mau + ", isinya: " + JSON.stringify(teks.trim()));\n});',
                },
                {
                  name: { en: 'Only the new one is badged', id: 'Hanya yang baru diberi lencana' },
                  check:
                    'var li = all("#root li");\nkursus.forEach(function (k, i) {\n  var ada = li[i].querySelector("span.baru") !== null;\n  assert(ada === k.baru, k.nama + (k.baru ? " harus" : " tidak boleh") + " punya lencana Baru");\n});',
                },
                {
                  name: { en: 'Nothing stray was rendered', id: 'Tidak ada yang tercetak liar' },
                  check:
                    'assert(sel("#root").textContent.indexOf("false") === -1, "jangan merender nilai boolean ke halaman");\nassert(error() === null, "ada error: " + error());',
                },
              ],
              hints: [
                { en: 'The ready/unready word is two outcomes — a ternary.', id: 'Kata siap/segera adalah dua kemungkinan — pakai ternary.' },
                { en: 'The badge is show-or-nothing — use &&.', id: 'Lencananya tampil-atau-tidak — pakai &&.' },
                { en: '{k.baru && <span className="baru">Baru</span>}', id: '{k.baru && <span className="baru">Baru</span>}' },
              ],
              solution:
                'const kursus = [\n  { id: 1, nama: "Python", siap: true, baru: false },\n  { id: 2, nama: "CSS", siap: true, baru: true },\n  { id: 3, nama: "React", siap: false, baru: false },\n];\n\nfunction Daftar() {\n  return (\n    <ul>\n      {kursus.map((k) => (\n        <li key={k.id}>\n          {k.nama} — {k.siap ? "siap" : "segera"}\n          {k.baru && <span className="baru">Baru</span>}\n        </li>\n      ))}\n    </ul>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Daftar />);',
            },
          ],
        },
      ],
      project: {
        id: 'react-m1-s2-p',
        runtime: 'web',
        react: true,
        html: ROOT,
        title: { en: 'Course catalogue', id: 'Katalog kursus' },
        brief: {
          en: 'A catalogue built from data: a summary line, a list, and an empty state.',
          id: 'Katalog yang dibangun dari data: baris ringkasan, sebuah daftar, dan keadaan kosong.',
        },
        requirements: [
          { en: 'Write `Katalog({ daftar })` and render it with the given array.', id: 'Tulis `Katalog({ daftar })` dan render ia dengan array yang diberikan.' },
          { en: 'A `p` with the class `ringkas` reading `3 kursus, 2 siap`.', id: 'Sebuah `p` ber-class `ringkas` bertuliskan `3 kursus, 2 siap`.' },
          { en: 'One `article` per course, each with a `key`, an `h3` with the name, and a `p` with the module count.', id: 'Satu `article` per kursus, masing-masing ber-`key`, dengan `h3` berisi nama, dan `p` berisi jumlah modul.' },
          { en: 'Unready courses get the class `belum` on their `article`.', id: 'Kursus yang belum siap mendapat class `belum` pada `article`-nya.' },
          { en: 'Given an empty array, render only `<p className="kosong">Belum ada kursus</p>` — no summary, no articles.', id: 'Dengan array kosong, render hanya `<p className="kosong">Belum ada kursus</p>` — tanpa ringkasan, tanpa article.' },
        ],
        starter:
          'const kursus = [\n  { id: 1, nama: "Python", modul: 9, siap: true },\n  { id: 2, nama: "HTML", modul: 4, siap: true },\n  { id: 3, nama: "React", modul: 0, siap: false },\n];\n\nfunction Katalog({ daftar }) {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Katalog daftar={kursus} />);\n',
        tests: [
          {
            name: { en: 'The summary is counted', id: 'Ringkasannya dihitung' },
            check:
              'var siap = kursus.filter(function (k) { return k.siap; }).length;\nvar mau = kursus.length + " kursus, " + siap + " siap";\nassert(sel("#root p.ringkas"), "belum ada <p className=\\"ringkas\\">");\nassert(text("#root p.ringkas") === mau, "ringkasannya harus " + JSON.stringify(mau) + ", sekarang: " + JSON.stringify(text("#root p.ringkas")));',
          },
          {
            name: { en: 'One article per course', id: 'Satu article per kursus' },
            check:
              'var art = all("#root article");\nassert(art.length === kursus.length, "harus " + kursus.length + " article, sekarang: " + art.length);\nart.forEach(function (a, i) {\n  assert(a.querySelector("h3"), "article ke-" + (i + 1) + " butuh <h3>");\n  assert(a.querySelector("h3").textContent.trim() === kursus[i].nama, "judul article ke-" + (i + 1) + " harus " + kursus[i].nama);\n  assert(a.textContent.indexOf(String(kursus[i].modul)) !== -1, "article " + kursus[i].nama + " harus menyebut jumlah modulnya");\n});',
          },
          {
            name: { en: 'Only the unready one is marked', id: 'Hanya yang belum siap yang ditandai' },
            check:
              'var art = all("#root article");\nkursus.forEach(function (k, i) {\n  var ada = art[i].classList.contains("belum");\n  assert(ada === !k.siap, k.nama + (k.siap ? " tidak boleh" : " harus") + " punya class belum");\n});',
          },
          {
            name: { en: 'No key warning', id: 'Tidak ada peringatan key' },
            check: 'assert(out().toLowerCase().indexOf("key") === -1, "React memperingatkan soal key: " + JSON.stringify(out()));',
          },
          {
            name: { en: 'The empty state stands alone', id: 'Keadaan kosongnya berdiri sendiri' },
            check:
              '// checks are not transpiled, so the component is rendered through the API\nvar wadah = document.createElement("div");\ndocument.body.appendChild(wadah);\nReactDOM.createRoot(wadah).render(React.createElement(Katalog, { daftar: [] }));\nawait tick(60);\nassert(wadah.querySelector("p.kosong"), "array kosong harus merender <p className=\\"kosong\\">");\nassert(wadah.querySelector("p.kosong").textContent.trim() === "Belum ada kursus", "teksnya: " + JSON.stringify(wadah.querySelector("p.kosong").textContent.trim()));\nassert(wadah.querySelectorAll("article").length === 0, "tidak boleh ada article saat kosong");\nassert(wadah.querySelector("p.ringkas") === null, "tidak boleh ada ringkasan saat kosong");\nwadah.remove();',
          },
        ],
        hints: [
          { en: 'Guard the empty case first and return early — the rest of the component then assumes there is data.', id: 'Amankan kasus kosong lebih dulu lalu return awal — sisa komponennya kemudian boleh menganggap datanya ada.' },
          { en: 'The summary counts with filter, exactly as in the JavaScript course.', id: 'Ringkasannya menghitung dengan filter, persis seperti di kursus JavaScript.' },
          { en: 'A class that is sometimes there: className={k.siap ? "" : "belum"}', id: 'Class yang kadang ada: className={k.siap ? "" : "belum"}' },
          { en: 'The check renders your component with an empty array, so it must handle that itself.', id: 'Pemeriksaannya merender komponenmu dengan array kosong, jadi ia harus menanganinya sendiri.' },
        ],
        solution:
          'const kursus = [\n  { id: 1, nama: "Python", modul: 9, siap: true },\n  { id: 2, nama: "HTML", modul: 4, siap: true },\n  { id: 3, nama: "React", modul: 0, siap: false },\n];\n\nfunction Katalog({ daftar }) {\n  if (daftar.length === 0) {\n    return <p className="kosong">Belum ada kursus</p>;\n  }\n\n  const siap = daftar.filter((k) => k.siap).length;\n\n  return (\n    <div>\n      <p className="ringkas">\n        {daftar.length} kursus, {siap} siap\n      </p>\n      {daftar.map((k) => (\n        <article key={k.id} className={k.siap ? "" : "belum"}>\n          <h3>{k.nama}</h3>\n          <p>{k.modul} modul</p>\n        </article>\n      ))}\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Katalog daftar={kursus} />);',
        xp: 50,
      },
    },
  ],
}
