import type { Module } from '../types'

/** Module 3 — composition, then effects.
 *
 *  The effects lesson leans hard on one idea: most of what beginners reach for
 *  useEffect to do should just be computed during render. The exercises reward
 *  deriving rather than storing. */

const ROOT = '<div id="root"></div>'

export const module3: Module = {
  id: 'react-m3',
  title: { en: 'Composition and Effects', id: 'Komposisi dan Efek' },
  summary: {
    en: 'Build components out of components, and reach outside React when you must.',
    id: 'Membangun komponen dari komponen, dan menjangkau ke luar React saat memang perlu.',
  },
  submodules: [
    /* -------------------------------------------------------- 3.1 composition */
    {
      id: 'react-m3-s1',
      title: { en: 'Composition', id: 'Komposisi' },
      summary: {
        en: 'children, and knowing when to split a component in two.',
        id: 'children, dan tahu kapan sebuah komponen sebaiknya dipecah dua.',
      },
      lessons: [
        {
          id: 'react-m3-s1-l1',
          title: { en: 'The children prop', id: 'Prop children' },
          goal: { en: 'Write a component that wraps other markup.', id: 'Menulis komponen yang membungkus markup lain.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Whatever you put inside arrives as children', id: 'Apa pun yang kamu taruh di dalamnya tiba sebagai children' },
              body: {
                en: 'A component used with an opening and closing tag receives everything between them as the prop `children`. That is what lets you write a wrapper once and put anything at all inside it.',
                id: 'Komponen yang dipakai dengan tag pembuka dan penutup menerima semua yang ada di antaranya sebagai prop `children`. Itulah yang membuatmu bisa menulis pembungkus sekali dan mengisinya dengan apa pun.',
              },
              code: 'function Kartu({ children }) {\n  return <div className="kartu">{children}</div>;\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(\n  <Kartu>\n    <h2>Judul</h2>\n    <p>Isi apa pun</p>\n  </Kartu>\n);',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'children plus ordinary props', id: 'children ditambah props biasa' },
              body: {
                en: 'A wrapper usually needs a little configuration of its own alongside the content — a title, a variant. They are just props, and `children` sits among them.',
                id: 'Sebuah pembungkus biasanya butuh sedikit pengaturan sendiri di samping isinya — judul, ragam tampilan. Semuanya sekadar props, dan `children` duduk di antaranya.',
              },
              code: 'function Panel({ judul, children }) {\n  return (\n    <section className="panel">\n      <h3>{judul}</h3>\n      <div className="isi">{children}</div>\n    </section>\n  );\n}',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Where does the content of `<Kartu><p>Halo</p></Kartu>` arrive?',
                id: 'Di mana isi dari `<Kartu><p>Halo</p></Kartu>` tiba?',
              },
              options: [
                { en: 'As the prop `children`', id: 'Sebagai prop `children`' },
                { en: 'As the prop `content`', id: 'Sebagai prop `content`' },
                { en: 'It is discarded', id: 'Ia dibuang' },
                { en: 'As an argument after props', id: 'Sebagai argumen setelah props' },
              ],
              answer: 0,
              explain: {
                en: '`children` is a normal prop with a reserved name, filled in by JSX.',
                id: '`children` adalah prop biasa dengan nama khusus, diisi oleh JSX.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              react: true,
              html: ROOT,
              prompt: {
                en: 'Write `Panel({ judul, children })` rendering a `section.panel` with an `h3` for the title and a `div.isi` for the content, then render two panels with different content.',
                id: 'Tulis `Panel({ judul, children })` yang merender `section.panel` dengan `h3` untuk judulnya dan `div.isi` untuk isinya, lalu render dua panel dengan isi berbeda.',
              },
              starter:
                'function Panel({ judul, children }) {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(\n\n);\n',
              tests: [
                {
                  name: { en: 'Two panels render', id: 'Dua panel terender' },
                  check: 'assert(all("#root section.panel").length === 2, "harus dua .panel, sekarang: " + all("#root section.panel").length);',
                },
                {
                  name: { en: 'Each has a title and a body', id: 'Masing-masing punya judul dan isi' },
                  check:
                    'all("#root section.panel").forEach(function (p, i) {\n  assert(p.querySelector("h3"), "panel ke-" + (i + 1) + " butuh <h3>");\n  assert(p.querySelector("h3").textContent.trim().length > 0, "judul panel ke-" + (i + 1) + " tidak boleh kosong");\n  assert(p.querySelector("div.isi"), "panel ke-" + (i + 1) + " butuh <div className=\\"isi\\">");\n});',
                },
                {
                  name: { en: 'The content really comes from children', id: 'Isinya benar-benar datang dari children' },
                  check:
                    'var wadah = document.createElement("div");\ndocument.body.appendChild(wadah);\nReactDOM.createRoot(wadah).render(\n  React.createElement(Panel, { judul: "Uji" }, React.createElement("em", { className: "tanda" }, "isi khusus"))\n);\nawait tick(60);\nvar isi = wadah.querySelector("div.isi");\nassert(isi, "Panel harus punya div.isi");\nassert(isi.querySelector("em.tanda"), "children harus dirender di dalam div.isi");\nassert(isi.textContent.indexOf("isi khusus") !== -1, "isi children harus muncul");\nwadah.remove();',
                },
              ],
              hints: [
                { en: 'The wrapper never knows what is inside it — that is the point.', id: 'Pembungkusnya tak pernah tahu apa isinya — itulah intinya.' },
                { en: 'Two panels need one wrapper around them.', id: 'Dua panel butuh satu pembungkus di sekelilingnya.' },
                { en: '<Panel judul="Satu"><p>…</p></Panel>', id: '<Panel judul="Satu"><p>…</p></Panel>' },
              ],
              solution:
                'function Panel({ judul, children }) {\n  return (\n    <section className="panel">\n      <h3>{judul}</h3>\n      <div className="isi">{children}</div>\n    </section>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(\n  <>\n    <Panel judul="Python">\n      <p>Sembilan modul.</p>\n    </Panel>\n    <Panel judul="React">\n      <p>Empat modul.</p>\n    </Panel>\n  </>\n);',
            },
          ],
        },
        {
          id: 'react-m3-s1-l2',
          title: { en: 'Splitting a component', id: 'Memecah sebuah komponen' },
          goal: { en: 'Know when one component should be two.', id: 'Tahu kapan satu komponen sebaiknya jadi dua.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Split when a piece has its own job', id: 'Pecah saat sebuah bagian punya tugasnya sendiri' },
              body: {
                en: 'Not by line count. Split when part of the markup answers a different question — a row inside a list, a badge, a form. Each piece then gets a name, and the parent reads as a summary of what the screen contains.',
                id: 'Bukan berdasarkan jumlah baris. Pecah saat sebagian markup-nya menjawab pertanyaan yang berbeda — satu baris dalam daftar, sebuah lencana, sebuah formulir. Tiap bagian lalu punya nama, dan induknya terbaca sebagai ringkasan isi layarnya.',
              },
              code: 'function Baris({ siswa }) {\n  return (\n    <li>\n      {siswa.nama} — {siswa.nilai}\n    </li>\n  );\n}\n\nfunction Daftar({ kelas }) {\n  return (\n    <ul>\n      {kelas.map((s) => (\n        <Baris key={s.id} siswa={s} />\n      ))}\n    </ul>\n  );\n}',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The key stays on the outside', id: 'key tetap di sisi luar' },
              body: {
                en: 'When the mapped element is your own component, `key` goes on the component in the list — not inside it. React needs it where the array is, and putting it on the inner element does nothing.',
                id: 'Ketika elemen hasil map adalah komponenmu sendiri, `key` diletakkan pada komponen di dalam daftarnya — bukan di dalam komponennya. React membutuhkannya di tempat array-nya berada, dan menaruhnya di elemen dalam tidak berpengaruh apa pun.',
              },
              code: {
                en: '// correct\n// {kelas.map((s) => <Baris key={s.id} siswa={s} />)}\n\n// wrong: key inside Baris\n// return <li key={siswa.id}>…</li>;',
                id: '// benar\n// {kelas.map((s) => <Baris key={s.id} siswa={s} />)}\n\n// salah: key di dalam Baris\n// return <li key={siswa.id}>…</li>;',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'When is it worth splitting a component out?',
                id: 'Kapan sebuah komponen layak dipecah keluar?',
              },
              options: [
                { en: 'When a part answers a different question and can be named', id: 'Saat sebuah bagian menjawab pertanyaan berbeda dan bisa dinamai' },
                { en: 'Whenever it passes 20 lines', id: 'Setiap kali melewati 20 baris' },
                { en: 'Whenever it has state', id: 'Setiap kali ia punya state' },
                { en: 'Never — one file is simpler', id: 'Tidak pernah — satu berkas lebih sederhana' },
              ],
              answer: 0,
              explain: {
                en: 'If you can give the piece an honest name, it is probably its own component. If the name would be `Bagian2`, it is not.',
                id: 'Kalau kamu bisa memberi bagian itu nama yang jujur, ia mungkin memang komponen tersendiri. Kalau namanya terpaksa `Bagian2`, berarti bukan.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              react: true,
              html: ROOT,
              prompt: {
                en: 'Split the rendering: write `Baris({ siswa })` returning an `li` reading `Ani — 88` with the class `lulus` when the score is 70 or more, and `Daftar({ kelas })` mapping over the array.',
                id: 'Pecah perenderannya: tulis `Baris({ siswa })` yang mengembalikan `li` bertuliskan `Ani — 88` dengan class `lulus` bila nilainya 70 ke atas, dan `Daftar({ kelas })` yang mem-map array-nya.',
              },
              starter:
                'const kelas = [\n  { id: 1, nama: "Ani", nilai: 88 },\n  { id: 2, nama: "Budi", nilai: 65 },\n  { id: 3, nama: "Citra", nilai: 70 },\n];\n\nfunction Baris({ siswa }) {\n\n}\n\nfunction Daftar({ kelas }) {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Daftar kelas={kelas} />);\n',
              tests: [
                {
                  name: { en: 'One row per student', id: 'Satu baris per siswa' },
                  check:
                    'assert(all("#root li").length === kelas.length, "harus " + kelas.length + " baris, sekarang: " + all("#root li").length);',
                },
                {
                  name: { en: 'Each row reads from its data', id: 'Tiap baris membaca datanya' },
                  check:
                    'var li = all("#root li");\nkelas.forEach(function (s, i) {\n  var mau = s.nama + " — " + s.nilai;\n  assert(li[i].textContent.trim() === mau, "baris ke-" + (i + 1) + " harus " + JSON.stringify(mau) + ", sekarang: " + JSON.stringify(li[i].textContent.trim()));\n});',
                },
                {
                  name: { en: 'Only passing rows are marked', id: 'Hanya baris yang lulus ditandai' },
                  check:
                    'var li = all("#root li");\nkelas.forEach(function (s, i) {\n  var ada = li[i].classList.contains("lulus");\n  assert(ada === (s.nilai >= 70), s.nama + " (" + s.nilai + ")" + (s.nilai >= 70 ? " harus" : " tidak boleh") + " punya class lulus");\n});',
                },
                {
                  name: { en: 'Baris stands on its own', id: 'Baris berdiri sendiri' },
                  check:
                    'var wadah = document.createElement("div");\ndocument.body.appendChild(wadah);\nReactDOM.createRoot(wadah).render(React.createElement(Baris, { siswa: { id: 9, nama: "Solo", nilai: 50 } }));\nawait tick(60);\nvar li = wadah.querySelector("li");\nassert(li, "Baris harus merender sebuah <li>");\nassert(li.textContent.trim() === "Solo — 50", "isinya: " + JSON.stringify(li.textContent.trim()));\nassert(!li.classList.contains("lulus"), "nilai 50 tidak boleh berkelas lulus");\nwadah.remove();',
                },
                {
                  name: { en: 'No key warning', id: 'Tidak ada peringatan key' },
                  check: 'assert(out().toLowerCase().indexOf("key") === -1, "React memperingatkan soal key: " + JSON.stringify(out()));',
                },
              ],
              hints: [
                { en: 'Baris knows about one student; Daftar knows about the array.', id: 'Baris tahu tentang satu siswa; Daftar tahu tentang array-nya.' },
                { en: 'The key goes on <Baris /> in the map, not on the li inside it.', id: 'key diletakkan pada <Baris /> di dalam map, bukan pada li di dalamnya.' },
                { en: 'className={siswa.nilai >= 70 ? "lulus" : ""}', id: 'className={siswa.nilai >= 70 ? "lulus" : ""}' },
              ],
              solution:
                'const kelas = [\n  { id: 1, nama: "Ani", nilai: 88 },\n  { id: 2, nama: "Budi", nilai: 65 },\n  { id: 3, nama: "Citra", nilai: 70 },\n];\n\nfunction Baris({ siswa }) {\n  return (\n    <li className={siswa.nilai >= 70 ? "lulus" : ""}>\n      {siswa.nama} — {siswa.nilai}\n    </li>\n  );\n}\n\nfunction Daftar({ kelas }) {\n  return (\n    <ul>\n      {kelas.map((s) => (\n        <Baris key={s.id} siswa={s} />\n      ))}\n    </ul>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Daftar kelas={kelas} />);',
            },
          ],
        },
      ],
      project: {
        id: 'react-m3-s1-p',
        runtime: 'web',
        react: true,
        html: ROOT,
        title: { en: 'Collapsible panel', id: 'Panel yang bisa dilipat' },
        brief: {
          en: 'A wrapper with its own state, holding content it knows nothing about.',
          id: 'Sebuah pembungkus dengan state-nya sendiri, memuat isi yang sama sekali tak ia ketahui.',
        },
        requirements: [
          { en: '`Lipat({ judul, children })` renders a `section.lipat`.', id: '`Lipat({ judul, children })` merender `section.lipat`.' },
          { en: 'Inside: a `button` showing the title, and the content in a `div.isi`.', id: 'Di dalamnya: sebuah `button` yang menampilkan judulnya, dan isinya dalam `div.isi`.' },
          { en: 'It starts closed: no `div.isi` is rendered at all.', id: 'Ia mulai tertutup: tidak ada `div.isi` yang dirender sama sekali.' },
          { en: 'Clicking the button opens it; clicking again closes it.', id: 'Mengklik tombolnya membukanya; mengklik lagi menutupnya.' },
          { en: 'Render two panels, and opening one must not affect the other.', id: 'Render dua panel, dan membuka satu tidak boleh memengaruhi yang lain.' },
        ],
        starter:
          'function Lipat({ judul, children }) {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(\n\n);\n',
        tests: [
          {
            name: { en: 'Two panels, both closed', id: 'Dua panel, keduanya tertutup' },
            check:
              'var p = all("#root section.lipat");\nassert(p.length === 2, "harus dua .lipat, sekarang: " + p.length);\nassert(all("#root div.isi").length === 0, "keduanya harus mulai tertutup — tidak ada div.isi");\np.forEach(function (x, i) {\n  assert(x.querySelector("button"), "panel ke-" + (i + 1) + " butuh <button>");\n  assert(x.querySelector("button").textContent.trim().length > 0, "tombolnya harus menampilkan judul");\n});',
          },
          {
            name: { en: 'Clicking opens it', id: 'Mengklik membukanya' },
            check:
              'var p = all("#root section.lipat");\nawait click(p[0].querySelector("button"));\nassert(all("#root section.lipat")[0].querySelector("div.isi"), "panel pertama harus terbuka setelah diklik");\nassert(all("#root section.lipat")[0].querySelector("div.isi").textContent.trim().length > 0, "isinya tidak boleh kosong");',
          },
          {
            name: { en: 'The panels are independent', id: 'Kedua panel saling bebas' },
            check:
              'var p = all("#root section.lipat");\nassert(p[1].querySelector("div.isi") === null, "membuka panel pertama tidak boleh ikut membuka yang kedua");\nawait click(p[1].querySelector("button"));\nassert(all("#root section.lipat")[1].querySelector("div.isi"), "panel kedua harus bisa dibuka sendiri");\nassert(all("#root section.lipat")[0].querySelector("div.isi"), "panel pertama harus tetap terbuka");',
          },
          {
            name: { en: 'Clicking again closes it', id: 'Mengklik lagi menutupnya' },
            check:
              'var p = all("#root section.lipat");\nawait click(p[0].querySelector("button"));\nassert(all("#root section.lipat")[0].querySelector("div.isi") === null, "klik kedua harus menutupnya kembali");',
          },
          {
            name: { en: 'It wraps whatever it is given', id: 'Ia membungkus apa pun yang diberikan' },
            check:
              'var wadah = document.createElement("div");\ndocument.body.appendChild(wadah);\nReactDOM.createRoot(wadah).render(\n  React.createElement(Lipat, { judul: "Uji" }, React.createElement("em", { className: "tanda" }, "rahasia"))\n);\nawait tick(60);\nawait click(wadah.querySelector("button"));\nassert(wadah.querySelector("div.isi em.tanda"), "children harus dirender apa adanya di dalam div.isi");\nwadah.remove();',
          },
        ],
        hints: [
          { en: 'The open/closed flag is state inside Lipat, so each panel keeps its own.', id: 'Penanda buka/tutupnya adalah state di dalam Lipat, sehingga tiap panel menyimpannya sendiri.' },
          { en: 'Closed means rendering nothing at all, not hiding with CSS — the check looks for the element.', id: 'Tertutup berarti tidak merender apa pun, bukan menyembunyikan dengan CSS — pemeriksaannya mencari elemennya.' },
          { en: '{buka && <div className="isi">{children}</div>}', id: '{buka && <div className="isi">{children}</div>}' },
          { en: 'Toggle with the functional form: setBuka((b) => !b)', id: 'Balikkan dengan bentuk fungsional: setBuka((b) => !b)' },
        ],
        solution:
          'function Lipat({ judul, children }) {\n  const [buka, setBuka] = React.useState(false);\n\n  return (\n    <section className="lipat">\n      <button onClick={() => setBuka((b) => !b)}>{judul}</button>\n      {buka && <div className="isi">{children}</div>}\n    </section>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(\n  <>\n    <Lipat judul="Python">\n      <p>Sembilan modul, 1700 XP.</p>\n    </Lipat>\n    <Lipat judul="React">\n      <p>Empat modul.</p>\n    </Lipat>\n  </>\n);',
        xp: 50,
      },
    },

    /* ----------------------------------------------------------- 3.2 useEffect */
    {
      id: 'react-m3-s2',
      title: { en: 'Effects', id: 'Efek' },
      summary: {
        en: 'Reaching outside React — and the far more common case where you should not.',
        id: 'Menjangkau ke luar React — dan kasus yang jauh lebih sering, saat kamu justru tidak perlu.',
      },
      lessons: [
        {
          id: 'react-m3-s2-l1',
          title: { en: 'Derive, do not store', id: 'Turunkan, jangan simpan' },
          goal: { en: 'Compute during render instead of syncing state.', id: 'Menghitung saat render alih-alih menyinkronkan state.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Most "effects" are just expressions', id: 'Sebagian besar "efek" hanyalah ekspresi' },
              body: {
                en: 'If a value can be worked out from state and props, work it out while rendering. Storing it in a second state and keeping the two in step with an effect gives you two things that can disagree, and an extra render every time.',
                id: 'Kalau sebuah nilai bisa dihitung dari state dan props, hitunglah saat merender. Menyimpannya di state kedua lalu menjaga keduanya seiring dengan efek memberimu dua hal yang bisa berselisih, dan satu render tambahan setiap kali.',
              },
              code: {
                en: '// overkill\n// const [jumlah, setJumlah] = React.useState(0);\n// React.useEffect(() => { setJumlah(daftar.length); }, [daftar]);\n\n// enough\nconst jumlah = daftar.length;\nconst lulus = daftar.filter((s) => s.nilai >= 70);',
                id: '// berlebihan\n// const [jumlah, setJumlah] = React.useState(0);\n// React.useEffect(() => { setJumlah(daftar.length); }, [daftar]);\n\n// cukup\nconst jumlah = daftar.length;\nconst lulus = daftar.filter((s) => s.nilai >= 70);',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Filtering is derived too', id: 'Penyaringan juga hasil turunan' },
              body: {
                en: 'A search box needs one piece of state: the query. The filtered list is computed from it on every render — never stored, never stale.',
                id: 'Kotak pencarian butuh satu state: kata kuncinya. Daftar hasil saringannya dihitung darinya di tiap render — tak pernah disimpan, tak pernah basi.',
              },
              code: 'function Cari({ semua }) {\n  const [kata, setKata] = React.useState("");\n  const hasil = semua.filter((x) => x.toLowerCase().includes(kata.toLowerCase()));\n\n  return (\n    <div>\n      <input value={kata} onChange={(e) => setKata(e.target.value)} />\n      <ul>\n        {hasil.map((x) => (\n          <li key={x}>{x}</li>\n        ))}\n      </ul>\n    </div>\n  );\n}',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'You have `daftar` in state and want its length on screen. What do you do?',
                id: 'Kamu punya `daftar` di state dan ingin menampilkan panjangnya. Apa yang kamu lakukan?',
              },
              options: [
                { en: 'Read daftar.length while rendering', id: 'Baca daftar.length saat merender' },
                { en: 'Keep a second state and sync it in an effect', id: 'Simpan state kedua dan sinkronkan lewat efek' },
                { en: 'Store it in a ref', id: 'Simpan di sebuah ref' },
                { en: 'Recount it on every click', id: 'Hitung ulang di tiap klik' },
              ],
              answer: 0,
              explain: {
                en: 'It is one expression. A synced state can only ever be equal or wrong.',
                id: 'Itu satu ekspresi saja. State yang disinkronkan paling banter hanya sama — atau salah.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              react: true,
              html: ROOT,
              prompt: {
                en: 'Build `Cari` with one state: the query. Show a filtered `li` per matching city (case-insensitive), and `p#jumlah` reading `2 dari 4`.',
                id: 'Bangun `Cari` dengan satu state: kata kuncinya. Tampilkan `li` tersaring per kota yang cocok (tanpa memedulikan besar-kecil huruf), dan `p#jumlah` bertuliskan `2 dari 4`.',
              },
              starter:
                'const kota = ["Surabaya", "Malang", "Kediri", "Madiun"];\n\nfunction Cari() {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Cari />);\n',
              tests: [
                {
                  name: { en: 'Everything shows at first', id: 'Semuanya tampil di awal' },
                  check:
                    'assert(sel("input"), "belum ada <input>");\nassert(all("#root li").length === 4, "awalnya harus empat item, sekarang: " + all("#root li").length);\nassert(text("#jumlah") === "4 dari 4", "#jumlah harus \\"4 dari 4\\", sekarang: " + JSON.stringify(text("#jumlah")));',
                },
                {
                  name: { en: 'Typing filters the list', id: 'Mengetik menyaring daftarnya' },
                  check:
                    'var i = sel("input");\nvar setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i), "value").set;\nsetter.call(i, "ma");\ni.dispatchEvent(new Event("input", { bubbles: true }));\nawait tick(30);\nvar isi = all("#root li").map(function (e) { return e.textContent.trim(); });\nassert(isi.join(",") === "Malang,Madiun", "mencari \\"ma\\" harus memberi Malang,Madiun — sekarang: " + JSON.stringify(isi));\nassert(text("#jumlah") === "2 dari 4", "#jumlah harus \\"2 dari 4\\", sekarang: " + JSON.stringify(text("#jumlah")));',
                },
                {
                  name: { en: 'Case does not matter', id: 'Besar-kecil huruf tidak berpengaruh' },
                  check:
                    'var i = sel("input");\nvar setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i), "value").set;\nsetter.call(i, "SURA");\ni.dispatchEvent(new Event("input", { bubbles: true }));\nawait tick(30);\nassert(all("#root li").length === 1, "SURA harus tetap menemukan Surabaya, sekarang: " + all("#root li").length);',
                },
                {
                  name: { en: 'Clearing brings them all back', id: 'Mengosongkannya mengembalikan semuanya' },
                  check:
                    'var i = sel("input");\nvar setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i), "value").set;\nsetter.call(i, "");\ni.dispatchEvent(new Event("input", { bubbles: true }));\nawait tick(30);\nassert(all("#root li").length === 4, "dikosongkan harus kembali empat, sekarang: " + all("#root li").length);\nassert(error() === null, "ada error: " + error());',
                },
              ],
              hints: [
                { en: 'One state only. The filtered list is a plain const in the component body.', id: 'Hanya satu state. Daftar tersaringnya adalah const biasa di badan komponennya.' },
                { en: 'Lowercase both sides before comparing.', id: 'Kecilkan kedua sisinya sebelum membandingkan.' },
                { en: 'kota.filter((k) => k.toLowerCase().includes(kata.toLowerCase()))', id: 'kota.filter((k) => k.toLowerCase().includes(kata.toLowerCase()))' },
              ],
              solution:
                'const kota = ["Surabaya", "Malang", "Kediri", "Madiun"];\n\nfunction Cari() {\n  const [kata, setKata] = React.useState("");\n  const hasil = kota.filter((k) => k.toLowerCase().includes(kata.toLowerCase()));\n\n  return (\n    <div>\n      <input value={kata} onChange={(e) => setKata(e.target.value)} />\n      <p id="jumlah">\n        {hasil.length} dari {kota.length}\n      </p>\n      <ul>\n        {hasil.map((k) => (\n          <li key={k}>{k}</li>\n        ))}\n      </ul>\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Cari />);',
            },
          ],
        },
        {
          id: 'react-m3-s2-l2',
          title: { en: 'When an effect is right', id: 'Kapan efek memang tepat' },
          goal: { en: 'Synchronise with something outside React.', id: 'Menyelaraskan dengan sesuatu di luar React.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Effects are for the world outside', id: 'Efek untuk dunia di luar sana' },
              body: {
                en: 'Setting the document title, starting a timer, subscribing to an event — things that are not rendering, and that React cannot undo for you. That is what `useEffect` is for.',
                id: 'Menyetel judul dokumen, memulai pengatur waktu, berlangganan sebuah kejadian — hal-hal yang bukan perenderan, dan yang tak bisa dibatalkan React untukmu. Untuk itulah `useEffect` ada.',
              },
              code: 'function Judul({ nama }) {\n  React.useEffect(() => {\n    document.title = nama;\n  }, [nama]);\n\n  return <h1>{nama}</h1>;\n}',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The dependency array decides when', id: 'Array dependensi menentukan kapannya' },
              body: {
                en: '`[]` runs it once, after the first render. `[nama]` runs it again whenever `nama` changes. Leaving the array out entirely runs it after **every** render — usually a mistake, and often an infinite loop when the effect sets state.',
                id: '`[]` menjalankannya sekali, setelah render pertama. `[nama]` menjalankannya lagi setiap `nama` berubah. Menghilangkan array-nya sama sekali menjalankannya setelah **tiap** render — biasanya keliru, dan sering jadi perulangan tanpa henti bila efeknya menyetel state.',
              },
              code: 'React.useEffect(() => {\n  console.log("sekali saja");\n}, []);',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Clean up what you started', id: 'Bersihkan yang kamu mulai' },
              body: {
                en: 'Return a function and React calls it before the next run, and when the component goes away. A timer without cleanup keeps firing after the component is gone, on state that no longer exists.',
                id: 'Kembalikan sebuah fungsi, maka React memanggilnya sebelum jalan berikutnya, dan saat komponennya lenyap. Pengatur waktu tanpa pembersihan terus berdetak setelah komponennya hilang, atas state yang sudah tidak ada.',
              },
              code: 'React.useEffect(() => {\n  const id = setInterval(() => setDetik((d) => d + 1), 1000);\n  return () => clearInterval(id);\n}, []);',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'An effect with no dependency array sets state. What happens?',
                id: 'Sebuah efek tanpa array dependensi menyetel state. Apa yang terjadi?',
              },
              options: [
                { en: 'An endless loop: set, render, run, set…', id: 'Perulangan tanpa henti: setel, render, jalan, setel…' },
                { en: 'It runs once', id: 'Ia berjalan sekali' },
                { en: 'React ignores it', id: 'React mengabaikannya' },
                { en: 'It runs only on unmount', id: 'Ia hanya jalan saat komponennya dilepas' },
              ],
              answer: 0,
              explain: {
                en: 'Every render runs the effect, which sets state, which renders. The array is what stops it.',
                id: 'Tiap render menjalankan efeknya, yang menyetel state, yang merender lagi. Array itulah yang menghentikannya.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: { en: 'Run it once, and clean it up.', id: 'Jalankan sekali, dan bersihkan.' },
              template: 'React.useEffect(() => {\n  const id = setInterval(naik, 1000);\n  ___ () => clearInterval(id);\n}, ___);',
              blanks: ['return', '[]'],
              explain: {
                en: 'The returned function is the cleanup; the empty array means "after the first render only".',
                id: 'Fungsi yang dikembalikan adalah pembersihannya; array kosong berarti "hanya setelah render pertama".',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              react: true,
              html: ROOT,
              prompt: {
                en: 'Build `Lacak` with a state `jumlah` starting at 0, a button `Tambah`, and an effect that writes `Jumlah: 3` into `document.title` whenever the count changes.',
                id: 'Bangun `Lacak` dengan state `jumlah` mulai dari 0, tombol `Tambah`, dan sebuah efek yang menulis `Jumlah: 3` ke `document.title` setiap hitungannya berubah.',
              },
              starter: 'function Lacak() {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Lacak />);\n',
              tests: [
                {
                  name: { en: 'The title is set on first render', id: 'Judulnya disetel pada render pertama' },
                  check:
                    'await tick(40);\nassert(doc.title === "Jumlah: 0", "judul awal harus \\"Jumlah: 0\\", sekarang: " + JSON.stringify(doc.title));',
                },
                {
                  name: { en: 'It follows the count', id: 'Ia mengikuti hitungannya' },
                  check:
                    'var sebelum = Number(doc.title.replace("Jumlah: ", ""));\nawait click("button");\nawait tick(40);\nassert(doc.title === "Jumlah: " + (sebelum + 1), "setelah klik judulnya harus \\"Jumlah: " + (sebelum + 1) + "\\", sekarang: " + JSON.stringify(doc.title));',
                },
                {
                  name: { en: 'It keeps following', id: 'Ia terus mengikuti' },
                  check:
                    'var sebelum = Number(doc.title.replace("Jumlah: ", ""));\nawait click("button");\nawait click("button");\nawait tick(40);\nassert(doc.title === "Jumlah: " + (sebelum + 2), "judulnya harus \\"Jumlah: " + (sebelum + 2) + "\\", sekarang: " + JSON.stringify(doc.title));',
                },
                {
                  name: { en: 'No runaway loop', id: 'Tidak ada perulangan liar' },
                  check:
                    'assert(error() === null, "ada error: " + error());\nassert(logs().length < 50, "efeknya tampak berjalan berulang tanpa henti — periksa array dependensinya");',
                },
              ],
              hints: [
                { en: 'The effect depends on the count, so the count goes in the array.', id: 'Efeknya bergantung pada hitungannya, jadi hitungannya masuk ke array-nya.' },
                { en: 'An empty array would set the title once and never again.', id: 'Array kosong akan menyetel judulnya sekali dan tak pernah lagi.' },
                { en: 'React.useEffect(() => { document.title = `Jumlah: ${jumlah}`; }, [jumlah]);', id: 'React.useEffect(() => { document.title = `Jumlah: ${jumlah}`; }, [jumlah]);' },
              ],
              solution:
                'function Lacak() {\n  const [jumlah, setJumlah] = React.useState(0);\n\n  React.useEffect(() => {\n    document.title = `Jumlah: ${jumlah}`;\n  }, [jumlah]);\n\n  return (\n    <div>\n      <p id="angka">{jumlah}</p>\n      <button onClick={() => setJumlah((n) => n + 1)}>Tambah</button>\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Lacak />);',
            },
          ],
        },
      ],
      project: {
        id: 'react-m3-s2-p',
        runtime: 'web',
        react: true,
        html: ROOT,
        title: { en: 'Searchable catalogue', id: 'Katalog yang bisa dicari' },
        brief: {
          en: 'A search box, a derived list, a derived count — and exactly one effect, where it belongs.',
          id: 'Kotak pencarian, daftar turunan, hitungan turunan — dan tepat satu efek, di tempat yang memang tepat.',
        },
        requirements: [
          { en: 'One state for the query, one for the "ready only" checkbox.', id: 'Satu state untuk kata kuncinya, satu untuk checkbox "hanya yang siap".' },
          { en: 'An `input` filters by name, case-insensitively.', id: 'Sebuah `input` menyaring berdasarkan nama, tanpa memedulikan besar-kecil huruf.' },
          { en: 'A checkbox `input[type=checkbox]` narrows to courses with `siap: true`.', id: 'Sebuah checkbox `input[type=checkbox]` mempersempit ke kursus dengan `siap: true`.' },
          { en: 'One `li` per match, with a `key`.', id: 'Satu `li` per hasil, ber-`key`.' },
          { en: '`p#jumlah` reads `2 dari 5`, derived — never stored in state.', id: '`p#jumlah` bertuliskan `2 dari 5`, hasil turunan — jangan pernah disimpan di state.' },
          { en: 'When nothing matches, render `<p className="kosong">Tidak ada hasil</p>` and no list.', id: 'Saat tidak ada yang cocok, render `<p className="kosong">Tidak ada hasil</p>` dan tanpa daftar.' },
          { en: 'An effect keeps `document.title` as `Katalog (2)`.', id: 'Sebuah efek menjaga `document.title` tetap `Katalog (2)`.' },
        ],
        starter:
          'const kursus = [\n  { id: 1, nama: "Python", siap: true },\n  { id: 2, nama: "HTML", siap: true },\n  { id: 3, nama: "CSS", siap: true },\n  { id: 4, nama: "React", siap: false },\n  { id: 5, nama: "SQL", siap: false },\n];\n\nfunction Katalog() {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Katalog />);\n',
        tests: [
          {
            name: { en: 'Everything shows at first', id: 'Semuanya tampil di awal' },
            check:
              'function teksInput() { return all("input").filter(function (i) { return i.type !== "checkbox"; })[0]; }\nassert(teksInput(), "belum ada input teks");\nassert(sel("input[type=checkbox]"), "belum ada checkbox");\nassert(all("#root li").length === 5, "awalnya harus lima item, sekarang: " + all("#root li").length);\nassert(text("#jumlah") === "5 dari 5", "#jumlah harus \\"5 dari 5\\", sekarang: " + JSON.stringify(text("#jumlah")));',
          },
          {
            name: { en: 'The text filter works', id: 'Penyaring teksnya berfungsi' },
            check:
              'function teksInput() { return all("input").filter(function (i) { return i.type !== "checkbox"; })[0]; }\nasync function ketik(v) {\n  var i = teksInput();\n  var setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i), "value").set;\n  setter.call(i, v);\n  i.dispatchEvent(new Event("input", { bubbles: true }));\n  await tick(30);\n}\nawait ketik("s");\nvar isi = all("#root li").map(function (e) { return e.textContent.trim(); });\nassert(isi.indexOf("CSS") !== -1 && isi.indexOf("SQL") !== -1, "mencari \\"s\\" harus menemukan CSS dan SQL, sekarang: " + JSON.stringify(isi));\nassert(text("#jumlah") === isi.length + " dari 5", "#jumlah harus mengikuti hasilnya, sekarang: " + JSON.stringify(text("#jumlah")));\nawait ketik("");',
          },
          {
            name: { en: 'The checkbox narrows further', id: 'Checkbox-nya mempersempit lagi' },
            check:
              'var c = sel("input[type=checkbox]");\nawait click(c);\nawait tick(30);\nvar isi = all("#root li").map(function (e) { return e.textContent.trim(); });\nassert(isi.length === 3, "hanya tiga kursus yang siap, sekarang: " + isi.length + " (" + isi.join(",") + ")");\nassert(isi.indexOf("React") === -1, "React belum siap dan tidak boleh muncul");\nassert(text("#jumlah") === "3 dari 5", "#jumlah harus \\"3 dari 5\\", sekarang: " + JSON.stringify(text("#jumlah")));\nawait click(c);\nawait tick(30);',
          },
          {
            name: { en: 'Both filters combine', id: 'Kedua penyaring bergabung' },
            check:
              'function teksInput() { return all("input").filter(function (i) { return i.type !== "checkbox"; })[0]; }\nvar i = teksInput();\nvar setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i), "value").set;\nsetter.call(i, "s");\ni.dispatchEvent(new Event("input", { bubbles: true }));\nawait tick(30);\nawait click(sel("input[type=checkbox]"));\nawait tick(30);\nvar isi = all("#root li").map(function (e) { return e.textContent.trim(); });\nassert(isi.join(",") === "CSS", "\\"s\\" ditambah hanya-yang-siap harus menyisakan CSS, sekarang: " + JSON.stringify(isi));\nawait click(sel("input[type=checkbox]"));\nawait tick(30);',
          },
          {
            name: { en: 'The empty state appears', id: 'Keadaan kosongnya muncul' },
            check:
              'function teksInput() { return all("input").filter(function (i) { return i.type !== "checkbox"; })[0]; }\nvar i = teksInput();\nvar setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i), "value").set;\nsetter.call(i, "zzz");\ni.dispatchEvent(new Event("input", { bubbles: true }));\nawait tick(30);\nassert(sel(".kosong"), "tanpa hasil harus ada <p className=\\"kosong\\">");\nassert(text(".kosong") === "Tidak ada hasil", "teksnya: " + JSON.stringify(text(".kosong")));\nassert(all("#root li").length === 0, "tidak boleh ada item saat kosong");\nassert(text("#jumlah") === "0 dari 5", "#jumlah harus \\"0 dari 5\\", sekarang: " + JSON.stringify(text("#jumlah")));',
          },
          {
            name: { en: 'The title tracks the count', id: 'Judulnya mengikuti hitungannya' },
            check:
              'await tick(40);\nassert(doc.title === "Katalog (0)", "judul harus \\"Katalog (0)\\" saat tak ada hasil, sekarang: " + JSON.stringify(doc.title));\nfunction teksInput() { return all("input").filter(function (i) { return i.type !== "checkbox"; })[0]; }\nvar i = teksInput();\nvar setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i), "value").set;\nsetter.call(i, "");\ni.dispatchEvent(new Event("input", { bubbles: true }));\nawait tick(40);\nassert(doc.title === "Katalog (5)", "judul harus \\"Katalog (5)\\", sekarang: " + JSON.stringify(doc.title));\nassert(error() === null, "ada error: " + error());',
          },
        ],
        hints: [
          { en: 'Two states, and everything else is computed in the component body.', id: 'Dua state, dan sisanya dihitung di badan komponennya.' },
          { en: 'Chain the two filters: the text one, then the ready one.', id: 'Rangkai kedua penyaringnya: yang teks, lalu yang siap.' },
          { en: 'A checkbox is controlled with `checked` and `onChange`, not `value`.', id: 'Checkbox dikendalikan dengan `checked` dan `onChange`, bukan `value`.' },
          { en: 'The effect depends on the result count, so that is what goes in the array.', id: 'Efeknya bergantung pada jumlah hasilnya, jadi itulah yang masuk ke array-nya.' },
        ],
        solution:
          'const kursus = [\n  { id: 1, nama: "Python", siap: true },\n  { id: 2, nama: "HTML", siap: true },\n  { id: 3, nama: "CSS", siap: true },\n  { id: 4, nama: "React", siap: false },\n  { id: 5, nama: "SQL", siap: false },\n];\n\nfunction Katalog() {\n  const [kata, setKata] = React.useState("");\n  const [hanyaSiap, setHanyaSiap] = React.useState(false);\n\n  const hasil = kursus\n    .filter((k) => k.nama.toLowerCase().includes(kata.toLowerCase()))\n    .filter((k) => (hanyaSiap ? k.siap : true));\n\n  React.useEffect(() => {\n    document.title = `Katalog (${hasil.length})`;\n  }, [hasil.length]);\n\n  return (\n    <div>\n      <input value={kata} onChange={(e) => setKata(e.target.value)} />\n      <label>\n        <input type="checkbox" checked={hanyaSiap} onChange={(e) => setHanyaSiap(e.target.checked)} />\n        Hanya yang siap\n      </label>\n\n      <p id="jumlah">\n        {hasil.length} dari {kursus.length}\n      </p>\n\n      {hasil.length === 0 ? (\n        <p className="kosong">Tidak ada hasil</p>\n      ) : (\n        <ul>\n          {hasil.map((k) => (\n            <li key={k.id}>{k.nama}</li>\n          ))}\n        </ul>\n      )}\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Katalog />);',
        xp: 50,
      },
    },
  ],
}
