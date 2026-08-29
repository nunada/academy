import type { Module } from '../types'

/** Module 4 — the closing module: a custom hook, and one app that uses
 *  everything the course covered. */

const ROOT = '<div id="root"></div>'

export const module4: Module = {
  id: 'react-m4',
  title: { en: 'A Whole App', id: 'Aplikasi Utuh' },
  summary: {
    en: 'Package logic into a hook, and put the pieces together.',
    id: 'Mengemas logika menjadi sebuah hook, dan menyatukan semua bagiannya.',
  },
  submodules: [
    {
      id: 'react-m4-s1',
      title: { en: 'Putting It Together', id: 'Menyatukannya' },
      summary: {
        en: 'Custom hooks, and the shape of a small application.',
        id: 'Custom hook, dan bentuk sebuah aplikasi kecil.',
      },
      lessons: [
        {
          id: 'react-m4-s1-l1',
          title: { en: 'Your own hook', id: 'Hook buatanmu sendiri' },
          goal: { en: 'Move stateful logic out of a component.', id: 'Memindahkan logika ber-state keluar dari komponen.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A hook is a function that uses hooks', id: 'Hook adalah fungsi yang memakai hook' },
              body: {
                en: 'There is no special syntax. Write a function whose name starts with `use`, call the built-in hooks inside it, and return whatever the component needs. The `use` prefix is what tells React — and the linter — to treat it as a hook.',
                id: 'Tidak ada sintaks khusus. Tulis sebuah fungsi yang namanya diawali `use`, panggil hook bawaan di dalamnya, dan kembalikan apa pun yang dibutuhkan komponennya. Awalan `use` itulah yang memberi tahu React — dan linter — untuk memperlakukannya sebagai hook.',
              },
              code: 'function usePenghitung(awal = 0) {\n  const [nilai, setNilai] = React.useState(awal);\n\n  const naik = () => setNilai((n) => n + 1);\n  const atur = () => setNilai(awal);\n\n  return { nilai, naik, atur };\n}',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Each call gets its own state', id: 'Tiap pemanggilan mendapat state-nya sendiri' },
              body: {
                en: 'Calling the same hook in two components gives two independent pieces of state. A hook shares *logic*, never data — sharing data is what props and context are for.',
                id: 'Memanggil hook yang sama di dua komponen memberi dua state yang saling bebas. Hook berbagi *logika*, bukan data — berbagi data adalah tugas props dan context.',
              },
              code: 'function Dua() {\n  const a = usePenghitung();\n  const b = usePenghitung(10);\n\n  return (\n    <div>\n      <button onClick={a.naik}>{a.nilai}</button>\n      <button onClick={b.naik}>{b.nilai}</button>\n    </div>\n  );\n}',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Hooks run in the same order every time', id: 'Hook berjalan dengan urutan sama setiap kali' },
              body: {
                en: 'React matches each `useState` to its value by call order, so a hook inside an `if` or a loop breaks that alignment. Always call them at the top level of a component or another hook.',
                id: 'React mencocokkan tiap `useState` dengan nilainya berdasarkan urutan pemanggilan, jadi hook di dalam `if` atau perulangan merusak keselarasan itu. Selalu panggil di tingkat atas sebuah komponen atau hook lain.',
              },
              code: {
                en: '// wrong\n// if (siap) { const [x] = React.useState(0); }\n\n// correct: hook at the top, condition follows\n// const [x, setX] = React.useState(0);\n// if (siap) { … }',
                id: '// salah\n// if (siap) { const [x] = React.useState(0); }\n\n// benar: hook di atas, kondisi menyusul\n// const [x, setX] = React.useState(0);\n// if (siap) { … }',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Two components call the same custom hook. What do they share?',
                id: 'Dua komponen memanggil custom hook yang sama. Apa yang mereka bagi?',
              },
              options: [
                { en: 'The logic, not the state', id: 'Logikanya, bukan state-nya' },
                { en: 'Both the logic and the state', id: 'Logika dan state-nya' },
                { en: 'The state, not the logic', id: 'State-nya, bukan logikanya' },
                { en: 'Nothing', id: 'Tidak ada' },
              ],
              answer: 0,
              explain: {
                en: 'Each call runs its own useState, so each component has its own value.',
                id: 'Tiap pemanggilan menjalankan useState-nya sendiri, jadi tiap komponen punya nilainya sendiri.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              react: true,
              html: ROOT,
              prompt: {
                en: 'Write `useDaftar(awal)` returning `{ item, tambah, hapus }` — `tambah(teks)` appends, `hapus(i)` removes by index — and a component that uses it with an input and a list.',
                id: 'Tulis `useDaftar(awal)` yang mengembalikan `{ item, tambah, hapus }` — `tambah(teks)` menambahkan, `hapus(i)` menghapus berdasarkan indeks — dan sebuah komponen yang memakainya dengan input dan daftar.',
              },
              starter:
                'function useDaftar(awal = []) {\n\n}\n\nfunction Aplikasi() {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Aplikasi />);\n',
              tests: [
                {
                  name: { en: 'The hook returns the right shape', id: 'Hook-nya mengembalikan bentuk yang benar' },
                  check:
                    'var hasil = null;\nfunction Sonde() {\n  hasil = useDaftar(["a"]);\n  return null;\n}\nvar wadah = document.createElement("div");\ndocument.body.appendChild(wadah);\nReactDOM.createRoot(wadah).render(React.createElement(Sonde));\nawait tick(60);\nassert(hasil, "useDaftar harus mengembalikan sesuatu");\nassert(Array.isArray(hasil.item), "item harus array, sekarang: " + typeof hasil.item);\nassert(hasil.item.join(",") === "a", "nilai awalnya harus dipakai, sekarang: " + JSON.stringify(hasil.item));\nassert(typeof hasil.tambah === "function" && typeof hasil.hapus === "function", "tambah dan hapus harus fungsi");\nwadah.remove();',
                },
                {
                  name: { en: 'Each call keeps its own state', id: 'Tiap pemanggilan menyimpan state-nya sendiri' },
                  check:
                    'var a = null, b = null;\nfunction Sonde() {\n  a = useDaftar(["x"]);\n  b = useDaftar([]);\n  return null;\n}\nvar wadah = document.createElement("div");\ndocument.body.appendChild(wadah);\nReactDOM.createRoot(wadah).render(React.createElement(Sonde));\nawait tick(60);\nassert(a.item.length === 1 && b.item.length === 0, "dua pemanggilan harus saling bebas");\nwadah.remove();',
                },
                {
                  name: { en: 'The UI adds through the hook', id: 'Antarmukanya menambah lewat hook-nya' },
                  check:
                    'async function ketikKirim(teks) {\n  var i = sel("#root input");\n  var setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i), "value").set;\n  setter.call(i, teks);\n  i.dispatchEvent(new Event("input", { bubbles: true }));\n  await tick(20);\n  var f = sel("#root form");\n  if (f) f.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));\n  else await click("#root button");\n  await tick(40);\n}\nassert(sel("#root input"), "belum ada input");\nvar sebelum = all("#root li").length;\nawait ketikKirim("Belajar");\nassert(all("#root li").length === sebelum + 1, "satu item harus bertambah, sekarang: " + all("#root li").length);',
                },
                {
                  name: { en: 'Removing works too', id: 'Penghapusan juga berfungsi' },
                  check:
                    'var hasil = null;\nfunction Sonde() {\n  hasil = useDaftar(["a", "b", "c"]);\n  return React.createElement("span", null, hasil.item.join(","));\n}\nvar wadah = document.createElement("div");\ndocument.body.appendChild(wadah);\nReactDOM.createRoot(wadah).render(React.createElement(Sonde));\nawait tick(60);\nhasil.hapus(1);\nawait tick(60);\nassert(wadah.querySelector("span").textContent === "a,c", "hapus(1) harus membuang item kedua, sekarang: " + JSON.stringify(wadah.querySelector("span").textContent));\nwadah.remove();',
                },
              ],
              hints: [
                { en: 'The hook holds the state; the component only renders.', id: 'Hook-nya menyimpan state-nya; komponennya hanya merender.' },
                { en: 'tambah builds a new array with the spread, never push.', id: 'tambah membangun array baru dengan operator sebar, jangan push.' },
                { en: 'hapus filters by index: item.filter((_, n) => n !== i)', id: 'hapus menyaring berdasarkan indeks: item.filter((_, n) => n !== i)' },
              ],
              solution:
                'function useDaftar(awal = []) {\n  const [item, setItem] = React.useState(awal);\n\n  const tambah = (teks) => setItem((d) => [...d, teks]);\n  const hapus = (i) => setItem((d) => d.filter((_, n) => n !== i));\n\n  return { item, tambah, hapus };\n}\n\nfunction Aplikasi() {\n  const { item, tambah, hapus } = useDaftar([]);\n  const [teks, setTeks] = React.useState("");\n\n  function kirim(e) {\n    e.preventDefault();\n    const bersih = teks.trim();\n    if (bersih === "") return;\n    tambah(bersih);\n    setTeks("");\n  }\n\n  return (\n    <div>\n      <form onSubmit={kirim}>\n        <input value={teks} onChange={(e) => setTeks(e.target.value)} />\n        <button type="submit">Tambah</button>\n      </form>\n      <ul>\n        {item.map((t, i) => (\n          <li key={i} onClick={() => hapus(i)}>\n            {t}\n          </li>\n        ))}\n      </ul>\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Aplikasi />);',
            },
          ],
        },
        {
          id: 'react-m4-s1-l2',
          title: { en: 'The shape of an app', id: 'Bentuk sebuah aplikasi' },
          goal: { en: 'Decide where each piece belongs.', id: 'Menentukan tempat tiap bagiannya.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'One owner per piece of state', id: 'Satu pemilik untuk tiap state' },
              body: {
                en: 'Put each value in the lowest component that needs it, and no lower. Too high and unrelated parts re-render for nothing; too low and you end up copying it sideways, where the copies drift.',
                id: 'Taruh tiap nilai di komponen terendah yang membutuhkannya, dan tidak lebih rendah. Terlalu tinggi membuat bagian tak terkait ikut render sia-sia; terlalu rendah membuatmu menyalinnya menyamping, dan salinannya akan berselisih.',
              },
              code: {
                en: '// list state is owned by App, because two children need it\n// "currently typing" state is owned by the form alone',
                id: '// state daftar dimiliki App, karena dua anak membutuhkannya\n// state "sedang diketik" dimiliki formulir saja',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Presentational components take props only', id: 'Komponen tampilan hanya menerima props' },
              body: {
                en: 'A component that receives data and callbacks, and holds no state, is easy to reason about and easy to test — the check can render it on its own with made-up props. Keep the state in one place above them.',
                id: 'Komponen yang menerima data dan callback, tanpa menyimpan state, mudah dipahami dan mudah diuji — pemeriksaannya bisa merendernya sendiri dengan props karangan. Simpan state-nya di satu tempat di atas mereka.',
              },
              code: 'function Baris({ tugas, onTandai }) {\n  return (\n    <li className={tugas.selesai ? "selesai" : ""} onClick={() => onTandai(tugas.id)}>\n      {tugas.teks}\n    </li>\n  );\n}',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Only the form needs the half-typed text. Where does that state go?',
                id: 'Hanya formulirnya yang butuh teks setengah jadi. Di mana state itu ditaruh?',
              },
              options: [
                { en: 'In the form component', id: 'Di komponen formulirnya' },
                { en: 'In the top-level App', id: 'Di App tingkat atas' },
                { en: 'In each list row', id: 'Di tiap baris daftarnya' },
                { en: 'In a global variable', id: 'Di variabel global' },
              ],
              answer: 0,
              explain: {
                en: 'Lifting it higher would re-render the whole list on every keystroke, for nothing.',
                id: 'Mengangkatnya lebih tinggi akan merender ulang seluruh daftar di tiap ketukan tombol, sia-sia.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              react: true,
              html: ROOT,
              prompt: {
                en: 'Split a small app: `Form({ onTambah })` owning its own text state, `Daftar({ item })` rendering the list, and `Aplikasi` owning the array and wiring them together.',
                id: 'Pecah sebuah aplikasi kecil: `Form({ onTambah })` yang memiliki state teksnya sendiri, `Daftar({ item })` yang merender daftarnya, dan `Aplikasi` yang memiliki array-nya dan merangkai keduanya.',
              },
              starter:
                'function Form({ onTambah }) {\n\n}\n\nfunction Daftar({ item }) {\n\n}\n\nfunction Aplikasi() {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Aplikasi />);\n',
              tests: [
                {
                  name: { en: 'The app renders both parts', id: 'Aplikasinya merender kedua bagiannya' },
                  check:
                    'assert(sel("#root input"), "belum ada input");\nassert(sel("#root ul"), "belum ada <ul>");',
                },
                {
                  name: { en: 'Submitting reaches the parent', id: 'Submit sampai ke induknya' },
                  check:
                    'async function kirim(teks) {\n  var i = sel("#root input");\n  var setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i), "value").set;\n  setter.call(i, teks);\n  i.dispatchEvent(new Event("input", { bubbles: true }));\n  await tick(20);\n  var f = sel("#root form");\n  if (f) f.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));\n  else await click("#root button");\n  await tick(40);\n}\nvar sebelum = all("#root li").length;\nawait kirim("Satu");\nassert(all("#root li").length === sebelum + 1, "item harus bertambah, sekarang: " + all("#root li").length);\nassert(all("#root li")[all("#root li").length - 1].textContent.trim() === "Satu", "isi item terakhir salah");',
                },
                {
                  name: { en: 'Daftar is presentational', id: 'Daftar hanya menampilkan' },
                  check:
                    'var wadah = document.createElement("div");\ndocument.body.appendChild(wadah);\nReactDOM.createRoot(wadah).render(React.createElement(Daftar, { item: ["a", "b"] }));\nawait tick(60);\nassert(wadah.querySelectorAll("li").length === 2, "Daftar harus merender satu li per item, sekarang: " + wadah.querySelectorAll("li").length);\nassert(wadah.querySelector("input") === null, "Daftar tidak boleh berisi input — itu tugas Form");\nwadah.remove();',
                },
                {
                  name: { en: 'Form owns only its own text', id: 'Form hanya memiliki teksnya sendiri' },
                  check:
                    'var diterima = [];\nvar wadah = document.createElement("div");\ndocument.body.appendChild(wadah);\nReactDOM.createRoot(wadah).render(React.createElement(Form, { onTambah: function (t) { diterima.push(t); } }));\nawait tick(60);\nvar i = wadah.querySelector("input");\nassert(i, "Form harus merender sebuah input");\nassert(wadah.querySelector("li") === null, "Form tidak boleh merender daftar");\nvar setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i), "value").set;\nsetter.call(i, "Dari form");\ni.dispatchEvent(new Event("input", { bubbles: true }));\nawait tick(20);\nvar f = wadah.querySelector("form");\nif (f) f.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));\nelse wadah.querySelector("button").click();\nawait tick(40);\nassert(diterima.length === 1 && diterima[0] === "Dari form", "Form harus memanggil onTambah dengan teksnya, diterima: " + JSON.stringify(diterima));\nwadah.remove();',
                },
              ],
              hints: [
                { en: 'The array lives in Aplikasi; the half-typed text lives in Form.', id: 'Array-nya tinggal di Aplikasi; teks setengah jadi tinggal di Form.' },
                { en: 'Form never sees the array, and Daftar never sees the input.', id: 'Form tak pernah melihat array-nya, dan Daftar tak pernah melihat input-nya.' },
                { en: 'Aplikasi passes onTambah down and receives the finished text back.', id: 'Aplikasi mengoper onTambah ke bawah dan menerima teks jadinya kembali.' },
              ],
              solution:
                'function Form({ onTambah }) {\n  const [teks, setTeks] = React.useState("");\n\n  function kirim(e) {\n    e.preventDefault();\n    const bersih = teks.trim();\n    if (bersih === "") return;\n    onTambah(bersih);\n    setTeks("");\n  }\n\n  return (\n    <form onSubmit={kirim}>\n      <input value={teks} onChange={(e) => setTeks(e.target.value)} />\n      <button type="submit">Tambah</button>\n    </form>\n  );\n}\n\nfunction Daftar({ item }) {\n  return (\n    <ul>\n      {item.map((t, i) => (\n        <li key={i}>{t}</li>\n      ))}\n    </ul>\n  );\n}\n\nfunction Aplikasi() {\n  const [item, setItem] = React.useState([]);\n\n  return (\n    <div>\n      <Form onTambah={(t) => setItem([...item, t])} />\n      <Daftar item={item} />\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Aplikasi />);',
            },
          ],
        },
      ],
      project: {
        id: 'react-m4-s1-p',
        runtime: 'web',
        react: true,
        html: ROOT,
        title: { en: 'Task manager', id: 'Pengelola tugas' },
        brief: {
          en: 'Everything at once: split components, lifted state, derived counts, a filter, and a custom hook.',
          id: 'Semuanya sekaligus: komponen terpisah, state terangkat, hitungan turunan, penyaring, dan sebuah custom hook.',
        },
        requirements: [
          { en: '`useTugas()` returns `{ tugas, tambah, tandai, hapus }` and owns the array.', id: '`useTugas()` mengembalikan `{ tugas, tambah, tandai, hapus }` dan memiliki array-nya.' },
          { en: '`Form({ onTambah })` owns its own text state and refuses empty entries.', id: '`Form({ onTambah })` memiliki state teksnya sendiri dan menolak masukan kosong.' },
          { en: 'Each task is an `li` with a `key`; clicking it toggles the class `selesai`.', id: 'Tiap tugas adalah `li` ber-`key`; mengkliknya menyalakan-mematikan class `selesai`.' },
          { en: 'Each `li` contains a `button.hapus` that removes just that task.', id: 'Tiap `li` memuat `button.hapus` yang menghapus hanya tugas itu.' },
          { en: 'Three filter buttons — `Semua`, `Aktif`, `Selesai` — narrow what is listed.', id: 'Tiga tombol penyaring — `Semua`, `Aktif`, `Selesai` — mempersempit yang ditampilkan.' },
          { en: '`p#sisa` reads `2 dari 3 belum selesai`, counted from all tasks, not the filtered view.', id: '`p#sisa` bertuliskan `2 dari 3 belum selesai`, dihitung dari seluruh tugas, bukan dari tampilan tersaring.' },
        ],
        starter:
          'function useTugas() {\n\n}\n\nfunction Form({ onTambah }) {\n\n}\n\nfunction Aplikasi() {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Aplikasi />);\n',
        tests: [
          {
            name: { en: 'Adding works and clears the field', id: 'Penambahan berfungsi dan mengosongkan isian' },
            check:
              'async function kirim(teks) {\n  var i = sel("#root input");\n  var setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i), "value").set;\n  setter.call(i, teks);\n  i.dispatchEvent(new Event("input", { bubbles: true }));\n  await tick(20);\n  var f = sel("#root form");\n  if (f) f.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));\n  else await click("#root form button, #root button");\n  await tick(40);\n}\nassert(sel("#root input"), "belum ada input");\nawait kirim("Satu");\nawait kirim("Dua");\nawait kirim("Tiga");\nassert(all("#root li").length === 3, "harus tiga tugas, sekarang: " + all("#root li").length);\nassert(sel("#root input").value === "", "input harus dikosongkan");',
          },
          {
            name: { en: 'Empty entries are refused', id: 'Masukan kosong ditolak' },
            check:
              'async function kirim(teks) {\n  var i = sel("#root input");\n  var setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i), "value").set;\n  setter.call(i, teks);\n  i.dispatchEvent(new Event("input", { bubbles: true }));\n  await tick(20);\n  var f = sel("#root form");\n  if (f) f.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));\n  await tick(40);\n}\nvar sebelum = all("#root li").length;\nawait kirim("");\nawait kirim("   ");\nassert(all("#root li").length === sebelum, "kosong dan spasi tidak boleh menambah");',
          },
          {
            name: { en: 'Clicking toggles, and the count follows', id: 'Klik menandai, dan hitungannya mengikuti' },
            check:
              'function harusnya() {\n  var li = all("#root li");\n  var belum = li.filter(function (e) { return !e.classList.contains("selesai"); }).length;\n  return belum + " dari " + li.length + " belum selesai";\n}\nassert(sel("#sisa"), "belum ada <p id=\\"sisa\\">");\nassert(text("#sisa") === harusnya(), "#sisa harus " + JSON.stringify(harusnya()) + ", sekarang: " + JSON.stringify(text("#sisa")));\nawait click(all("#root li")[0]);\nassert(all("#root li")[0].classList.contains("selesai"), "klik harus menandai selesai");\nassert(text("#sisa") === harusnya(), "#sisa harus ikut berubah, sekarang: " + JSON.stringify(text("#sisa")));',
          },
          {
            name: { en: 'The filters narrow the list', id: 'Penyaringnya mempersempit daftar' },
            check:
              'function tombol(t) { return all("#root button").filter(function (b) { return b.textContent.trim() === t; })[0]; }\nassert(tombol("Semua") && tombol("Aktif") && tombol("Selesai"), "butuh tombol Semua, Aktif, dan Selesai");\nawait click(tombol("Aktif"));\nassert(all("#root li").length === 2, "Aktif harus menyisakan 2 tugas, sekarang: " + all("#root li").length);\nall("#root li").forEach(function (e) { assert(!e.classList.contains("selesai"), "Aktif tidak boleh menampilkan yang selesai"); });\nawait click(tombol("Selesai"));\nassert(all("#root li").length === 1, "Selesai harus menyisakan 1 tugas, sekarang: " + all("#root li").length);\nawait click(tombol("Semua"));\nassert(all("#root li").length === 3, "Semua harus menampilkan ketiganya, sekarang: " + all("#root li").length);',
          },
          {
            name: { en: 'The count ignores the filter', id: 'Hitungannya mengabaikan penyaring' },
            check:
              'function tombol(t) { return all("#root button").filter(function (b) { return b.textContent.trim() === t; })[0]; }\nawait click(tombol("Aktif"));\nassert(text("#sisa") === "2 dari 3 belum selesai", "#sisa harus menghitung semua tugas meski disaring, sekarang: " + JSON.stringify(text("#sisa")));\nawait click(tombol("Semua"));',
          },
          {
            name: { en: 'Delete removes just one', id: 'Hapus membuang satu saja' },
            check:
              'var sebelum = all("#root li").length;\nvar sasaran = all("#root li")[1].textContent;\nvar tombolHapus = all("#root li")[1].querySelector("button.hapus");\nassert(tombolHapus, "tiap li butuh <button className=\\"hapus\\">");\nawait click(tombolHapus);\nassert(all("#root li").length === sebelum - 1, "harus berkurang satu, sekarang: " + all("#root li").length);\nvar sisa = all("#root li").map(function (e) { return e.textContent; });\nassert(sisa.indexOf(sasaran) === -1, "yang terhapus harus yang diklik");',
          },
          {
            name: { en: 'The hook owns the data', id: 'Hook-nya memiliki datanya' },
            check:
              'var api = null;\nfunction Sonde() {\n  api = useTugas();\n  return null;\n}\nvar wadah = document.createElement("div");\ndocument.body.appendChild(wadah);\nReactDOM.createRoot(wadah).render(React.createElement(Sonde));\nawait tick(60);\nassert(api, "useTugas harus mengembalikan sesuatu");\nassert(Array.isArray(api.tugas), "tugas harus array");\n["tambah", "tandai", "hapus"].forEach(function (k) {\n  assert(typeof api[k] === "function", k + " harus fungsi");\n});\napi.tambah("Uji");\nawait tick(60);\nassert(api.tugas.length >= 0, "tambah tidak boleh melempar");\nwadah.remove();\nassert(error() === null, "ada error: " + error());',
          },
        ],
        hints: [
          { en: 'The hook owns the array and the three operations; the components only render and call back.', id: 'Hook-nya memiliki array dan ketiga operasinya; komponennya hanya merender dan memanggil balik.' },
          { en: 'The filter is state in Aplikasi, and the visible list is derived from it — never a second array in state.', id: 'Penyaringnya adalah state di Aplikasi, dan daftar yang tampak diturunkan darinya — jangan pernah jadi array kedua di state.' },
          { en: 'The delete button sits inside the li, so stop its click from also toggling: e.stopPropagation().', id: 'Tombol hapusnya ada di dalam li, jadi cegah kliknya ikut menandai: e.stopPropagation().' },
          { en: '#sisa counts from the full array, not from what the filter shows.', id: '#sisa menghitung dari array penuhnya, bukan dari yang ditampilkan penyaring.' },
        ],
        solution:
          'function useTugas() {\n  const [tugas, setTugas] = React.useState([]);\n\n  const tambah = (teks) => setTugas((d) => [...d, { id: Date.now() + Math.random(), teks, selesai: false }]);\n  const tandai = (id) => setTugas((d) => d.map((t) => (t.id === id ? { ...t, selesai: !t.selesai } : t)));\n  const hapus = (id) => setTugas((d) => d.filter((t) => t.id !== id));\n\n  return { tugas, tambah, tandai, hapus };\n}\n\nfunction Form({ onTambah }) {\n  const [teks, setTeks] = React.useState("");\n\n  function kirim(e) {\n    e.preventDefault();\n    const bersih = teks.trim();\n    if (bersih === "") return;\n    onTambah(bersih);\n    setTeks("");\n  }\n\n  return (\n    <form onSubmit={kirim}>\n      <input value={teks} onChange={(e) => setTeks(e.target.value)} />\n      <button type="submit">Tambah</button>\n    </form>\n  );\n}\n\nfunction Aplikasi() {\n  const { tugas, tambah, tandai, hapus } = useTugas();\n  const [saring, setSaring] = React.useState("Semua");\n\n  const tampak = tugas.filter((t) => {\n    if (saring === "Aktif") return !t.selesai;\n    if (saring === "Selesai") return t.selesai;\n    return true;\n  });\n\n  const belum = tugas.filter((t) => !t.selesai).length;\n\n  return (\n    <div>\n      <Form onTambah={tambah} />\n\n      <div>\n        {["Semua", "Aktif", "Selesai"].map((s) => (\n          <button key={s} onClick={() => setSaring(s)}>\n            {s}\n          </button>\n        ))}\n      </div>\n\n      <p id="sisa">\n        {belum} dari {tugas.length} belum selesai\n      </p>\n\n      <ul>\n        {tampak.map((t) => (\n          <li key={t.id} className={t.selesai ? "selesai" : ""} onClick={() => tandai(t.id)}>\n            {t.teks}\n            <button\n              className="hapus"\n              onClick={(e) => {\n                e.stopPropagation();\n                hapus(t.id);\n              }}\n            >\n              x\n            </button>\n          </li>\n        ))}\n      </ul>\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Aplikasi />);',
        xp: 80,
      },
    },
  ],
}
