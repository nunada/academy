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
              code: {
                en: 'function Card({ children }) {\n  return <div className="card">{children}</div>;\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(\n  <Card>\n    <h2>Title</h2>\n    <p>Any content</p>\n  </Card>\n);',
                id: 'function Kartu({ children }) {\n  return <div className="kartu">{children}</div>;\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(\n  <Kartu>\n    <h2>Judul</h2>\n    <p>Isi apa pun</p>\n  </Kartu>\n);',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'children plus ordinary props', id: 'children ditambah props biasa' },
              body: {
                en: 'A wrapper usually needs a little configuration of its own alongside the content — a title, a variant. They are just props, and `children` sits among them.',
                id: 'Sebuah pembungkus biasanya butuh sedikit pengaturan sendiri di samping isinya — judul, ragam tampilan. Semuanya sekadar props, dan `children` duduk di antaranya.',
              },
              code: {
                en: 'function Panel({ title, children }) {\n  return (\n    <section className="panel">\n      <h3>{title}</h3>\n      <div className="content">{children}</div>\n    </section>\n  );\n}',
                id: 'function Panel({ judul, children }) {\n  return (\n    <section className="panel">\n      <h3>{judul}</h3>\n      <div className="isi">{children}</div>\n    </section>\n  );\n}',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Where does the content of `<Card><p>Hello</p></Card>` arrive?',
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
                en: 'Write `Panel({ title, children })` rendering a `section.panel` with an `h3` for the title and a `div.content` for the content, then render two panels with different content.',
                id: 'Tulis `Panel({ judul, children })` yang merender `section.panel` dengan `h3` untuk judulnya dan `div.isi` untuk isinya, lalu render dua panel dengan isi berbeda.',
              },
              starter: {
                en: 'function Panel({ title, children }) {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(\n\n);\n',
                id: 'function Panel({ judul, children }) {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(\n\n);\n',
              },
              tests: {
                en: [
                  {
                    name: { en: 'Two panels render', id: 'Dua panel terender' },
                    check: 'assert(all("#root section.panel").length === 2, "should be two .panel, got: " + all("#root section.panel").length);',
                  },
                  {
                    name: { en: 'Each has a title and a body', id: 'Masing-masing punya judul dan isi' },
                    check:
                      'all("#root section.panel").forEach(function (p, i) {\n  assert(p.querySelector("h3"), "panel " + (i + 1) + " needs <h3>");\n  assert(p.querySelector("h3").textContent.trim().length > 0, "panel " + (i + 1) + " title must not be empty");\n  assert(p.querySelector("div.content"), "panel " + (i + 1) + " needs <div className=\\"content\\">");\n});',
                  },
                  {
                    name: { en: 'The content really comes from children', id: 'Isinya benar-benar datang dari children' },
                    check:
                      'var container = document.createElement("div");\ndocument.body.appendChild(container);\nReactDOM.createRoot(container).render(\n  React.createElement(Panel, { title: "Test" }, React.createElement("em", { className: "mark" }, "special content"))\n);\nawait tick(60);\nvar content = container.querySelector("div.content");\nassert(content, "Panel should have div.content");\nassert(content.querySelector("em.mark"), "children should render inside div.content");\nassert(content.textContent.indexOf("special content") !== -1, "the children content should appear");\ncontainer.remove();',
                  },
                ],
                id: [
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
              },
              hints: [
                { en: 'The wrapper never knows what is inside it — that is the point.', id: 'Pembungkusnya tak pernah tahu apa isinya — itulah intinya.' },
                { en: 'Two panels need one wrapper around them.', id: 'Dua panel butuh satu pembungkus di sekelilingnya.' },
                { en: '<Panel title="One"><p>…</p></Panel>', id: '<Panel judul="Satu"><p>…</p></Panel>' },
              ],
              solution: {
                en:
                  'function Panel({ title, children }) {\n  return (\n    <section className="panel">\n      <h3>{title}</h3>\n      <div className="content">{children}</div>\n    </section>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(\n  <>\n    <Panel title="Python">\n      <p>Nine modules.</p>\n    </Panel>\n    <Panel title="React">\n      <p>Four modules.</p>\n    </Panel>\n  </>\n);',
                id:
                  'function Panel({ judul, children }) {\n  return (\n    <section className="panel">\n      <h3>{judul}</h3>\n      <div className="isi">{children}</div>\n    </section>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(\n  <>\n    <Panel judul="Python">\n      <p>Sembilan modul.</p>\n    </Panel>\n    <Panel judul="React">\n      <p>Empat modul.</p>\n    </Panel>\n  </>\n);',
              },
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
              code: {
                en: 'function Row({ student }) {\n  return (\n    <li>\n      {student.name} — {student.score}\n    </li>\n  );\n}\n\nfunction List({ students }) {\n  return (\n    <ul>\n      {students.map((s) => (\n        <Row key={s.id} student={s} />\n      ))}\n    </ul>\n  );\n}',
                id: 'function Baris({ siswa }) {\n  return (\n    <li>\n      {siswa.nama} — {siswa.nilai}\n    </li>\n  );\n}\n\nfunction Daftar({ kelas }) {\n  return (\n    <ul>\n      {kelas.map((s) => (\n        <Baris key={s.id} siswa={s} />\n      ))}\n    </ul>\n  );\n}',
              },
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
                en: '// correct\n// {students.map((s) => <Row key={s.id} student={s} />)}\n\n// wrong: key inside Row\n// return <li key={student.id}>…</li>;',
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
                en: 'If you can give the piece an honest name, it is probably its own component. If the name would be `Part2`, it is not.',
                id: 'Kalau kamu bisa memberi bagian itu nama yang jujur, ia mungkin memang komponen tersendiri. Kalau namanya terpaksa `Bagian2`, berarti bukan.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              react: true,
              html: ROOT,
              prompt: {
                en: 'Split the rendering: write `Row({ student })` returning an `li` reading `Ani — 88` with the class `pass` when the score is 70 or more, and `List({ students })` mapping over the array.',
                id: 'Pecah perenderannya: tulis `Baris({ siswa })` yang mengembalikan `li` bertuliskan `Ani — 88` dengan class `lulus` bila nilainya 70 ke atas, dan `Daftar({ kelas })` yang mem-map array-nya.',
              },
              starter: {
                en:
                  'const students = [\n  { id: 1, name: "Ani", score: 88 },\n  { id: 2, name: "Budi", score: 65 },\n  { id: 3, name: "Citra", score: 70 },\n];\n\nfunction Row({ student }) {\n\n}\n\nfunction List({ students }) {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<List students={students} />);\n',
                id: 'const kelas = [\n  { id: 1, nama: "Ani", nilai: 88 },\n  { id: 2, nama: "Budi", nilai: 65 },\n  { id: 3, nama: "Citra", nilai: 70 },\n];\n\nfunction Baris({ siswa }) {\n\n}\n\nfunction Daftar({ kelas }) {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Daftar kelas={kelas} />);\n',
              },
              tests: {
                en: [
                  {
                    name: { en: 'One row per student', id: 'Satu baris per siswa' },
                    check:
                      'assert(all("#root li").length === students.length, "should be " + students.length + " rows, got: " + all("#root li").length);',
                  },
                  {
                    name: { en: 'Each row reads from its data', id: 'Tiap baris membaca datanya' },
                    check:
                      'var li = all("#root li");\nstudents.forEach(function (s, i) {\n  var expected = s.name + " — " + s.score;\n  assert(li[i].textContent.trim() === expected, "row " + (i + 1) + " should be " + JSON.stringify(expected) + ", got: " + JSON.stringify(li[i].textContent.trim()));\n});',
                  },
                  {
                    name: { en: 'Only passing rows are marked', id: 'Hanya baris yang lulus ditandai' },
                    check:
                      'var li = all("#root li");\nstudents.forEach(function (s, i) {\n  var present = li[i].classList.contains("pass");\n  assert(present === (s.score >= 70), s.name + " (" + s.score + ")" + (s.score >= 70 ? " should" : " should not") + " have the pass class");\n});',
                  },
                  {
                    name: { en: 'Row stands on its own', id: 'Baris berdiri sendiri' },
                    check:
                      'var container = document.createElement("div");\ndocument.body.appendChild(container);\nReactDOM.createRoot(container).render(React.createElement(Row, { student: { id: 9, name: "Solo", score: 50 } }));\nawait tick(60);\nvar li = container.querySelector("li");\nassert(li, "Row should render an <li>");\nassert(li.textContent.trim() === "Solo — 50", "content was: " + JSON.stringify(li.textContent.trim()));\nassert(!li.classList.contains("pass"), "a score of 50 must not carry the pass class");\ncontainer.remove();',
                  },
                  {
                    name: { en: 'No key warning', id: 'Tidak ada peringatan key' },
                    check: 'assert(out().toLowerCase().indexOf("key") === -1, "React warned about key: " + JSON.stringify(out()));',
                  },
                ],
                id: [
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
                    name: { en: 'Row stands on its own', id: 'Baris berdiri sendiri' },
                    check:
                      'var wadah = document.createElement("div");\ndocument.body.appendChild(wadah);\nReactDOM.createRoot(wadah).render(React.createElement(Baris, { siswa: { id: 9, nama: "Solo", nilai: 50 } }));\nawait tick(60);\nvar li = wadah.querySelector("li");\nassert(li, "Baris harus merender sebuah <li>");\nassert(li.textContent.trim() === "Solo — 50", "isinya: " + JSON.stringify(li.textContent.trim()));\nassert(!li.classList.contains("lulus"), "nilai 50 tidak boleh berkelas lulus");\nwadah.remove();',
                  },
                  {
                    name: { en: 'No key warning', id: 'Tidak ada peringatan key' },
                    check: 'assert(out().toLowerCase().indexOf("key") === -1, "React memperingatkan soal key: " + JSON.stringify(out()));',
                  },
                ],
              },
              hints: [
                { en: 'Row knows about one student; List knows about the array.', id: 'Baris tahu tentang satu siswa; Daftar tahu tentang array-nya.' },
                { en: 'The key goes on <Row /> in the map, not on the li inside it.', id: 'key diletakkan pada <Baris /> di dalam map, bukan pada li di dalamnya.' },
                { en: 'className={student.score >= 70 ? "pass" : ""}', id: 'className={siswa.nilai >= 70 ? "lulus" : ""}' },
              ],
              solution: {
                en:
                  'const students = [\n  { id: 1, name: "Ani", score: 88 },\n  { id: 2, name: "Budi", score: 65 },\n  { id: 3, name: "Citra", score: 70 },\n];\n\nfunction Row({ student }) {\n  return (\n    <li className={student.score >= 70 ? "pass" : ""}>\n      {student.name} — {student.score}\n    </li>\n  );\n}\n\nfunction List({ students }) {\n  return (\n    <ul>\n      {students.map((s) => (\n        <Row key={s.id} student={s} />\n      ))}\n    </ul>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<List students={students} />);',
                id:
                  'const kelas = [\n  { id: 1, nama: "Ani", nilai: 88 },\n  { id: 2, nama: "Budi", nilai: 65 },\n  { id: 3, nama: "Citra", nilai: 70 },\n];\n\nfunction Baris({ siswa }) {\n  return (\n    <li className={siswa.nilai >= 70 ? "lulus" : ""}>\n      {siswa.nama} — {siswa.nilai}\n    </li>\n  );\n}\n\nfunction Daftar({ kelas }) {\n  return (\n    <ul>\n      {kelas.map((s) => (\n        <Baris key={s.id} siswa={s} />\n      ))}\n    </ul>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Daftar kelas={kelas} />);',
              },
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
          { en: '`Collapsible({ title, children })` renders a `section.collapsible`.', id: '`Lipat({ judul, children })` merender `section.lipat`.' },
          { en: 'Inside: a `button` showing the title, and the content in a `div.content`.', id: 'Di dalamnya: sebuah `button` yang menampilkan judulnya, dan isinya dalam `div.isi`.' },
          { en: 'It starts closed: no `div.content` is rendered at all.', id: 'Ia mulai tertutup: tidak ada `div.isi` yang dirender sama sekali.' },
          { en: 'Clicking the button opens it; clicking again closes it.', id: 'Mengklik tombolnya membukanya; mengklik lagi menutupnya.' },
          { en: 'Render two panels, and opening one must not affect the other.', id: 'Render dua panel, dan membuka satu tidak boleh memengaruhi yang lain.' },
        ],
        starter: {
          en: 'function Collapsible({ title, children }) {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(\n\n);\n',
          id: 'function Lipat({ judul, children }) {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(\n\n);\n',
        },
        tests: {
          en: [
            {
              name: { en: 'Two panels, both closed', id: 'Dua panel, keduanya tertutup' },
              check:
                'var p = all("#root section.collapsible");\nassert(p.length === 2, "should be two .collapsible, got: " + p.length);\nassert(all("#root div.content").length === 0, "both should start closed — no div.content");\np.forEach(function (x, i) {\n  assert(x.querySelector("button"), "panel " + (i + 1) + " needs <button>");\n  assert(x.querySelector("button").textContent.trim().length > 0, "the button should show the title");\n});',
            },
            {
              name: { en: 'Clicking opens it', id: 'Mengklik membukanya' },
              check:
                'var p = all("#root section.collapsible");\nawait click(p[0].querySelector("button"));\nassert(all("#root section.collapsible")[0].querySelector("div.content"), "the first panel should be open after a click");\nassert(all("#root section.collapsible")[0].querySelector("div.content").textContent.trim().length > 0, "the content must not be empty");',
            },
            {
              name: { en: 'The panels are independent', id: 'Kedua panel saling bebas' },
              check:
                'var p = all("#root section.collapsible");\nassert(p[1].querySelector("div.content") === null, "opening the first panel must not open the second one too");\nawait click(p[1].querySelector("button"));\nassert(all("#root section.collapsible")[1].querySelector("div.content"), "the second panel should open on its own");\nassert(all("#root section.collapsible")[0].querySelector("div.content"), "the first panel should stay open");',
            },
            {
              name: { en: 'Clicking again closes it', id: 'Mengklik lagi menutupnya' },
              check:
                'var p = all("#root section.collapsible");\nawait click(p[0].querySelector("button"));\nassert(all("#root section.collapsible")[0].querySelector("div.content") === null, "a second click should close it again");',
            },
            {
              name: { en: 'It wraps whatever it is given', id: 'Ia membungkus apa pun yang diberikan' },
              check:
                'var container = document.createElement("div");\ndocument.body.appendChild(container);\nReactDOM.createRoot(container).render(\n  React.createElement(Collapsible, { title: "Test" }, React.createElement("em", { className: "mark" }, "secret"))\n);\nawait tick(60);\nawait click(container.querySelector("button"));\nassert(container.querySelector("div.content em.mark"), "children should render as-is inside div.content");\ncontainer.remove();',
            },
          ],
          id: [
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
        },
        hints: [
          { en: 'The open/closed flag is state inside Collapsible, so each panel keeps its own.', id: 'Penanda buka/tutupnya adalah state di dalam Lipat, sehingga tiap panel menyimpannya sendiri.' },
          { en: 'Closed means rendering nothing at all, not hiding with CSS — the check looks for the element.', id: 'Tertutup berarti tidak merender apa pun, bukan menyembunyikan dengan CSS — pemeriksaannya mencari elemennya.' },
          { en: '{open && <div className="content">{children}</div>}', id: '{buka && <div className="isi">{children}</div>}' },
          { en: 'Toggle with the functional form: setOpen((o) => !o)', id: 'Balikkan dengan bentuk fungsional: setBuka((b) => !b)' },
        ],
        solution: {
          en:
            'function Collapsible({ title, children }) {\n  const [open, setOpen] = React.useState(false);\n\n  return (\n    <section className="collapsible">\n      <button onClick={() => setOpen((o) => !o)}>{title}</button>\n      {open && <div className="content">{children}</div>}\n    </section>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(\n  <>\n    <Collapsible title="Python">\n      <p>Nine modules, 1700 XP.</p>\n    </Collapsible>\n    <Collapsible title="React">\n      <p>Four modules.</p>\n    </Collapsible>\n  </>\n);',
          id:
            'function Lipat({ judul, children }) {\n  const [buka, setBuka] = React.useState(false);\n\n  return (\n    <section className="lipat">\n      <button onClick={() => setBuka((b) => !b)}>{judul}</button>\n      {buka && <div className="isi">{children}</div>}\n    </section>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(\n  <>\n    <Lipat judul="Python">\n      <p>Sembilan modul, 1700 XP.</p>\n    </Lipat>\n    <Lipat judul="React">\n      <p>Empat modul.</p>\n    </Lipat>\n  </>\n);',
        },
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
                en: '// overkill\n// const [count, setCount] = React.useState(0);\n// React.useEffect(() => { setCount(list.length); }, [list]);\n\n// enough\nconst count = list.length;\nconst passed = list.filter((s) => s.score >= 70);',
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
              code: {
                en: 'function Search({ items }) {\n  const [query, setQuery] = React.useState("");\n  const result = items.filter((x) => x.toLowerCase().includes(query.toLowerCase()));\n\n  return (\n    <div>\n      <input value={query} onChange={(e) => setQuery(e.target.value)} />\n      <ul>\n        {result.map((x) => (\n          <li key={x}>{x}</li>\n        ))}\n      </ul>\n    </div>\n  );\n}',
                id: 'function Cari({ semua }) {\n  const [kata, setKata] = React.useState("");\n  const hasil = semua.filter((x) => x.toLowerCase().includes(kata.toLowerCase()));\n\n  return (\n    <div>\n      <input value={kata} onChange={(e) => setKata(e.target.value)} />\n      <ul>\n        {hasil.map((x) => (\n          <li key={x}>{x}</li>\n        ))}\n      </ul>\n    </div>\n  );\n}',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'You have `list` in state and want its length on screen. What do you do?',
                id: 'Kamu punya `daftar` di state dan ingin menampilkan panjangnya. Apa yang kamu lakukan?',
              },
              options: [
                { en: 'Read list.length while rendering', id: 'Baca daftar.length saat merender' },
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
                en: 'Build `Search` with one state: the query. Show a filtered `li` per matching city (case-insensitive), and `p#count` reading `2 of 4`.',
                id: 'Bangun `Cari` dengan satu state: kata kuncinya. Tampilkan `li` tersaring per kota yang cocok (tanpa memedulikan besar-kecil huruf), dan `p#jumlah` bertuliskan `2 dari 4`.',
              },
              starter: {
                en: 'const cities = ["Surabaya", "Malang", "Kediri", "Madiun"];\n\nfunction Search() {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Search />);\n',
                id: 'const kota = ["Surabaya", "Malang", "Kediri", "Madiun"];\n\nfunction Cari() {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Cari />);\n',
              },
              tests: {
                en: [
                  {
                    name: { en: 'Everything shows at first', id: 'Semuanya tampil di awal' },
                    check:
                      'assert(sel("input"), "no <input> yet");\nassert(all("#root li").length === 4, "should start with four items, got: " + all("#root li").length);\nassert(text("#count") === "4 of 4", "#count should be \\"4 of 4\\", got: " + JSON.stringify(text("#count")));',
                  },
                  {
                    name: { en: 'Typing filters the list', id: 'Mengetik menyaring daftarnya' },
                    check:
                      'var i = sel("input");\nvar setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i), "value").set;\nsetter.call(i, "ma");\ni.dispatchEvent(new Event("input", { bubbles: true }));\nawait tick(30);\nvar content = all("#root li").map(function (e) { return e.textContent.trim(); });\nassert(content.join(",") === "Malang,Madiun", "searching \\"ma\\" should give Malang,Madiun — got: " + JSON.stringify(content));\nassert(text("#count") === "2 of 4", "#count should be \\"2 of 4\\", got: " + JSON.stringify(text("#count")));',
                  },
                  {
                    name: { en: 'Case does not matter', id: 'Besar-kecil huruf tidak berpengaruh' },
                    check:
                      'var i = sel("input");\nvar setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i), "value").set;\nsetter.call(i, "SURA");\ni.dispatchEvent(new Event("input", { bubbles: true }));\nawait tick(30);\nassert(all("#root li").length === 1, "SURA should still find Surabaya, got: " + all("#root li").length);',
                  },
                  {
                    name: { en: 'Clearing brings them all back', id: 'Mengosongkannya mengembalikan semuanya' },
                    check:
                      'var i = sel("input");\nvar setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i), "value").set;\nsetter.call(i, "");\ni.dispatchEvent(new Event("input", { bubbles: true }));\nawait tick(30);\nassert(all("#root li").length === 4, "clearing it should return to four, got: " + all("#root li").length);\nassert(error() === null, "there was an error: " + error());',
                  },
                ],
                id: [
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
              },
              hints: [
                { en: 'One state only. The filtered list is a plain const in the component body.', id: 'Hanya satu state. Daftar tersaringnya adalah const biasa di badan komponennya.' },
                { en: 'Lowercase both sides before comparing.', id: 'Kecilkan kedua sisinya sebelum membandingkan.' },
                { en: 'cities.filter((c) => c.toLowerCase().includes(query.toLowerCase()))', id: 'kota.filter((k) => k.toLowerCase().includes(kata.toLowerCase()))' },
              ],
              solution: {
                en:
                  'const cities = ["Surabaya", "Malang", "Kediri", "Madiun"];\n\nfunction Search() {\n  const [query, setQuery] = React.useState("");\n  const result = cities.filter((c) => c.toLowerCase().includes(query.toLowerCase()));\n\n  return (\n    <div>\n      <input value={query} onChange={(e) => setQuery(e.target.value)} />\n      <p id="count">\n        {result.length} of {cities.length}\n      </p>\n      <ul>\n        {result.map((c) => (\n          <li key={c}>{c}</li>\n        ))}\n      </ul>\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Search />);',
                id:
                  'const kota = ["Surabaya", "Malang", "Kediri", "Madiun"];\n\nfunction Cari() {\n  const [kata, setKata] = React.useState("");\n  const hasil = kota.filter((k) => k.toLowerCase().includes(kata.toLowerCase()));\n\n  return (\n    <div>\n      <input value={kata} onChange={(e) => setKata(e.target.value)} />\n      <p id="jumlah">\n        {hasil.length} dari {kota.length}\n      </p>\n      <ul>\n        {hasil.map((k) => (\n          <li key={k}>{k}</li>\n        ))}\n      </ul>\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Cari />);',
              },
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
              code: {
                en: 'function Title({ name }) {\n  React.useEffect(() => {\n    document.title = name;\n  }, [name]);\n\n  return <h1>{name}</h1>;\n}',
                id: 'function Judul({ nama }) {\n  React.useEffect(() => {\n    document.title = nama;\n  }, [nama]);\n\n  return <h1>{nama}</h1>;\n}',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The dependency array decides when', id: 'Array dependensi menentukan kapannya' },
              body: {
                en: '`[]` runs it once, after the first render. `[nama]` runs it again whenever `nama` changes. Leaving the array out entirely runs it after **every** render — usually a mistake, and often an infinite loop when the effect sets state.',
                id: '`[]` menjalankannya sekali, setelah render pertama. `[nama]` menjalankannya lagi setiap `nama` berubah. Menghilangkan array-nya sama sekali menjalankannya setelah **tiap** render — biasanya keliru, dan sering jadi perulangan tanpa henti bila efeknya menyetel state.',
              },
              code: {
                en: 'React.useEffect(() => {\n  console.log("just once");\n}, []);',
                id: 'React.useEffect(() => {\n  console.log("sekali saja");\n}, []);',
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Clean up what you started', id: 'Bersihkan yang kamu mulai' },
              body: {
                en: 'Return a function and React calls it before the next run, and when the component goes away. A timer without cleanup keeps firing after the component is gone, on state that no longer exists.',
                id: 'Kembalikan sebuah fungsi, maka React memanggilnya sebelum jalan berikutnya, dan saat komponennya lenyap. Pengatur waktu tanpa pembersihan terus berdetak setelah komponennya hilang, atas state yang sudah tidak ada.',
              },
              code: {
                en: 'React.useEffect(() => {\n  const id = setInterval(() => setSeconds((s) => s + 1), 1000);\n  return () => clearInterval(id);\n}, []);',
                id: 'React.useEffect(() => {\n  const id = setInterval(() => setDetik((d) => d + 1), 1000);\n  return () => clearInterval(id);\n}, []);',
              },
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
              template: {
                en: 'React.useEffect(() => {\n  const id = setInterval(increment, 1000);\n  ___ () => clearInterval(id);\n}, ___);',
                id: 'React.useEffect(() => {\n  const id = setInterval(naik, 1000);\n  ___ () => clearInterval(id);\n}, ___);',
              },
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
                en: 'Build `Tracker` with a state `count` starting at 0, a button `Add`, and an effect that writes `Count: 3` into `document.title` whenever the count changes.',
                id: 'Bangun `Lacak` dengan state `jumlah` mulai dari 0, tombol `Tambah`, dan sebuah efek yang menulis `Jumlah: 3` ke `document.title` setiap hitungannya berubah.',
              },
              starter: {
                en: 'function Tracker() {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Tracker />);\n',
                id: 'function Lacak() {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Lacak />);\n',
              },
              tests: {
                en: [
                  {
                    name: { en: 'The title is set on first render', id: 'Judulnya disetel pada render pertama' },
                    check:
                      'await tick(40);\nassert(doc.title === "Count: 0", "the initial title should be \\"Count: 0\\", got: " + JSON.stringify(doc.title));',
                  },
                  {
                    name: { en: 'It follows the count', id: 'Ia mengikuti hitungannya' },
                    check:
                      'var before = Number(doc.title.replace("Count: ", ""));\nawait click("button");\nawait tick(40);\nassert(doc.title === "Count: " + (before + 1), "after a click the title should be \\"Count: " + (before + 1) + "\\", got: " + JSON.stringify(doc.title));',
                  },
                  {
                    name: { en: 'It keeps following', id: 'Ia terus mengikuti' },
                    check:
                      'var before = Number(doc.title.replace("Count: ", ""));\nawait click("button");\nawait click("button");\nawait tick(40);\nassert(doc.title === "Count: " + (before + 2), "the title should be \\"Count: " + (before + 2) + "\\", got: " + JSON.stringify(doc.title));',
                  },
                  {
                    name: { en: 'No runaway loop', id: 'Tidak ada perulangan liar' },
                    check:
                      'assert(error() === null, "there was an error: " + error());\nassert(logs().length < 50, "the effect looks like it is looping forever — check the dependency array");',
                  },
                ],
                id: [
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
              },
              hints: [
                { en: 'The effect depends on the count, so the count goes in the array.', id: 'Efeknya bergantung pada hitungannya, jadi hitungannya masuk ke array-nya.' },
                { en: 'An empty array would set the title once and never again.', id: 'Array kosong akan menyetel judulnya sekali dan tak pernah lagi.' },
                { en: 'React.useEffect(() => { document.title = `Count: ${count}`; }, [count]);', id: 'React.useEffect(() => { document.title = `Jumlah: ${jumlah}`; }, [jumlah]);' },
              ],
              solution: {
                en:
                  'function Tracker() {\n  const [count, setCount] = React.useState(0);\n\n  React.useEffect(() => {\n    document.title = `Count: ${count}`;\n  }, [count]);\n\n  return (\n    <div>\n      <p id="count">{count}</p>\n      <button onClick={() => setCount((n) => n + 1)}>Add</button>\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Tracker />);',
                id:
                  'function Lacak() {\n  const [jumlah, setJumlah] = React.useState(0);\n\n  React.useEffect(() => {\n    document.title = `Jumlah: ${jumlah}`;\n  }, [jumlah]);\n\n  return (\n    <div>\n      <p id="angka">{jumlah}</p>\n      <button onClick={() => setJumlah((n) => n + 1)}>Tambah</button>\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Lacak />);',
              },
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
          { en: 'A checkbox `input[type=checkbox]` narrows to courses with `ready: true`.', id: 'Sebuah checkbox `input[type=checkbox]` mempersempit ke kursus dengan `siap: true`.' },
          { en: 'One `li` per match, with a `key`.', id: 'Satu `li` per hasil, ber-`key`.' },
          { en: '`p#count` reads `2 of 5`, derived — never stored in state.', id: '`p#jumlah` bertuliskan `2 dari 5`, hasil turunan — jangan pernah disimpan di state.' },
          { en: 'When nothing matches, render `<p className="empty">No results</p>` and no list.', id: 'Saat tidak ada yang cocok, render `<p className="kosong">Tidak ada hasil</p>` dan tanpa daftar.' },
          { en: 'An effect keeps `document.title` as `Catalog (2)`.', id: 'Sebuah efek menjaga `document.title` tetap `Katalog (2)`.' },
        ],
        starter: {
          en: 'const courses = [\n  { id: 1, name: "Python", ready: true },\n  { id: 2, name: "HTML", ready: true },\n  { id: 3, name: "CSS", ready: true },\n  { id: 4, name: "React", ready: false },\n  { id: 5, name: "SQL", ready: false },\n];\n\nfunction Catalog() {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Catalog />);\n',
          id: 'const kursus = [\n  { id: 1, nama: "Python", siap: true },\n  { id: 2, nama: "HTML", siap: true },\n  { id: 3, nama: "CSS", siap: true },\n  { id: 4, nama: "React", siap: false },\n  { id: 5, nama: "SQL", siap: false },\n];\n\nfunction Katalog() {\n\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Katalog />);\n',
        },
        tests: {
          en: [
            {
              name: { en: 'Everything shows at first', id: 'Semuanya tampil di awal' },
              check:
                'function textInput() { return all("input").filter(function (i) { return i.type !== "checkbox"; })[0]; }\nassert(textInput(), "no text input yet");\nassert(sel("input[type=checkbox]"), "no checkbox yet");\nassert(all("#root li").length === 5, "should start with five items, got: " + all("#root li").length);\nassert(text("#count") === "5 of 5", "#count should be \\"5 of 5\\", got: " + JSON.stringify(text("#count")));',
            },
            {
              name: { en: 'The text filter works', id: 'Penyaring teksnya berfungsi' },
              check:
                'function textInput() { return all("input").filter(function (i) { return i.type !== "checkbox"; })[0]; }\nasync function type(v) {\n  var i = textInput();\n  var setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i), "value").set;\n  setter.call(i, v);\n  i.dispatchEvent(new Event("input", { bubbles: true }));\n  await tick(30);\n}\nawait type("s");\nvar content = all("#root li").map(function (e) { return e.textContent.trim(); });\nassert(content.indexOf("CSS") !== -1 && content.indexOf("SQL") !== -1, "searching \\"s\\" should find CSS and SQL, got: " + JSON.stringify(content));\nassert(text("#count") === content.length + " of 5", "#count should follow the results, got: " + JSON.stringify(text("#count")));\nawait type("");',
            },
            {
              name: { en: 'The checkbox narrows further', id: 'Checkbox-nya mempersempit lagi' },
              check:
                'var c = sel("input[type=checkbox]");\nawait click(c);\nawait tick(30);\nvar content = all("#root li").map(function (e) { return e.textContent.trim(); });\nassert(content.length === 3, "only three courses are ready, got: " + content.length + " (" + content.join(",") + ")");\nassert(content.indexOf("React") === -1, "React is not ready and must not appear");\nassert(text("#count") === "3 of 5", "#count should be \\"3 of 5\\", got: " + JSON.stringify(text("#count")));\nawait click(c);\nawait tick(30);',
            },
            {
              name: { en: 'Both filters combine', id: 'Kedua penyaring bergabung' },
              check:
                'function textInput() { return all("input").filter(function (i) { return i.type !== "checkbox"; })[0]; }\nvar i = textInput();\nvar setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i), "value").set;\nsetter.call(i, "s");\ni.dispatchEvent(new Event("input", { bubbles: true }));\nawait tick(30);\nawait click(sel("input[type=checkbox]"));\nawait tick(30);\nvar content = all("#root li").map(function (e) { return e.textContent.trim(); });\nassert(content.join(",") === "CSS", "\\"s\\" plus ready-only should leave just CSS, got: " + JSON.stringify(content));\nawait click(sel("input[type=checkbox]"));\nawait tick(30);',
            },
            {
              name: { en: 'The empty state appears', id: 'Keadaan kosongnya muncul' },
              check:
                'function textInput() { return all("input").filter(function (i) { return i.type !== "checkbox"; })[0]; }\nvar i = textInput();\nvar setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i), "value").set;\nsetter.call(i, "zzz");\ni.dispatchEvent(new Event("input", { bubbles: true }));\nawait tick(30);\nassert(sel(".empty"), "with no results there should be a <p className=\\"empty\\">");\nassert(text(".empty") === "No results", "text was: " + JSON.stringify(text(".empty")));\nassert(all("#root li").length === 0, "there must be no items when empty");\nassert(text("#count") === "0 of 5", "#count should be \\"0 of 5\\", got: " + JSON.stringify(text("#count")));',
            },
            {
              name: { en: 'The title tracks the count', id: 'Judulnya mengikuti hitungannya' },
              check:
                'await tick(40);\nassert(doc.title === "Catalog (0)", "the title should be \\"Catalog (0)\\" when there are no results, got: " + JSON.stringify(doc.title));\nfunction textInput() { return all("input").filter(function (i) { return i.type !== "checkbox"; })[0]; }\nvar i = textInput();\nvar setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i), "value").set;\nsetter.call(i, "");\ni.dispatchEvent(new Event("input", { bubbles: true }));\nawait tick(40);\nassert(doc.title === "Catalog (5)", "the title should be \\"Catalog (5)\\", got: " + JSON.stringify(doc.title));\nassert(error() === null, "there was an error: " + error());',
            },
          ],
          id: [
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
        },
        hints: [
          { en: 'Two states, and everything else is computed in the component body.', id: 'Dua state, dan sisanya dihitung di badan komponennya.' },
          { en: 'Chain the two filters: the text one, then the ready one.', id: 'Rangkai kedua penyaringnya: yang teks, lalu yang siap.' },
          { en: 'A checkbox is controlled with `checked` and `onChange`, not `value`.', id: 'Checkbox dikendalikan dengan `checked` dan `onChange`, bukan `value`.' },
          { en: 'The effect depends on the result count, so that is what goes in the array.', id: 'Efeknya bergantung pada jumlah hasilnya, jadi itulah yang masuk ke array-nya.' },
        ],
        solution: {
          en:
            'const courses = [\n  { id: 1, name: "Python", ready: true },\n  { id: 2, name: "HTML", ready: true },\n  { id: 3, name: "CSS", ready: true },\n  { id: 4, name: "React", ready: false },\n  { id: 5, name: "SQL", ready: false },\n];\n\nfunction Catalog() {\n  const [query, setQuery] = React.useState("");\n  const [onlyReady, setOnlyReady] = React.useState(false);\n\n  const result = courses\n    .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))\n    .filter((c) => (onlyReady ? c.ready : true));\n\n  React.useEffect(() => {\n    document.title = `Catalog (${result.length})`;\n  }, [result.length]);\n\n  return (\n    <div>\n      <input value={query} onChange={(e) => setQuery(e.target.value)} />\n      <label>\n        <input type="checkbox" checked={onlyReady} onChange={(e) => setOnlyReady(e.target.checked)} />\n        Only ready\n      </label>\n\n      <p id="count">\n        {result.length} of {courses.length}\n      </p>\n\n      {result.length === 0 ? (\n        <p className="empty">No results</p>\n      ) : (\n        <ul>\n          {result.map((c) => (\n            <li key={c.id}>{c.name}</li>\n          ))}\n        </ul>\n      )}\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Catalog />);',
          id:
            'const kursus = [\n  { id: 1, nama: "Python", siap: true },\n  { id: 2, nama: "HTML", siap: true },\n  { id: 3, nama: "CSS", siap: true },\n  { id: 4, nama: "React", siap: false },\n  { id: 5, nama: "SQL", siap: false },\n];\n\nfunction Katalog() {\n  const [kata, setKata] = React.useState("");\n  const [hanyaSiap, setHanyaSiap] = React.useState(false);\n\n  const hasil = kursus\n    .filter((k) => k.nama.toLowerCase().includes(kata.toLowerCase()))\n    .filter((k) => (hanyaSiap ? k.siap : true));\n\n  React.useEffect(() => {\n    document.title = `Katalog (${hasil.length})`;\n  }, [hasil.length]);\n\n  return (\n    <div>\n      <input value={kata} onChange={(e) => setKata(e.target.value)} />\n      <label>\n        <input type="checkbox" checked={hanyaSiap} onChange={(e) => setHanyaSiap(e.target.checked)} />\n        Hanya yang siap\n      </label>\n\n      <p id="jumlah">\n        {hasil.length} dari {kursus.length}\n      </p>\n\n      {hasil.length === 0 ? (\n        <p className="kosong">Tidak ada hasil</p>\n      ) : (\n        <ul>\n          {hasil.map((k) => (\n            <li key={k.id}>{k.nama}</li>\n          ))}\n        </ul>\n      )}\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.querySelector("#root")).render(<Katalog />);',
        },
        xp: 50,
      },
    },
  ],
}
