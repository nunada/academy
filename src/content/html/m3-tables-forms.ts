import type { Module } from '../types'

/** Module 3 — the two structures learners most often build badly:
 *  tables used for layout, and inputs with no label attached to them. */
export const module3: Module = {
  id: 'html-m3',
  title: { en: 'Tables and Forms', id: 'Tabel dan Formulir' },
  summary: {
    en: 'Present real data, and collect it back from the reader.',
    id: 'Menyajikan data nyata, dan mengumpulkannya kembali dari pembaca.',
  },
  submodules: [
    /* ------------------------------------------------------------ 3.1 tables */
    {
      id: 'html-m3-s1',
      title: { en: 'Tables', id: 'Tabel' },
      summary: {
        en: 'Rows, cells, and the headers that make them readable.',
        id: 'Baris, sel, dan header yang membuatnya terbaca.',
      },
      lessons: [
        {
          id: 'html-m3-s1-l1',
          title: { en: 'Rows and cells', id: 'Baris dan sel' },
          goal: { en: 'Build a table from data.', id: 'Membangun tabel dari data.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A table is rows of cells', id: 'Tabel adalah baris berisi sel' },
              body: {
                en: '`<table>` holds `<tr>` rows, and each row holds `<td>` cells. You never write columns — columns are what you get when every row has its cells in the same order.',
                id: '`<table>` memuat baris `<tr>`, dan tiap baris memuat sel `<td>`. Kamu tidak pernah menulis kolom — kolom muncul dengan sendirinya saat tiap baris menaruh selnya dalam urutan sama.',
              },
              code: '<table>\n  <tr>\n    <td>Ani</td>\n    <td>80</td>\n  </tr>\n  <tr>\n    <td>Budi</td>\n    <td>65</td>\n  </tr>\n</table>',
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'th says what a column means', id: 'th menyatakan arti sebuah kolom' },
              body: {
                en: 'A header cell is `<th>`, not a bold `<td>`. It is what a screen reader repeats before each value, so a listener hears "Nilai: 80" instead of a bare number.',
                id: 'Sel header adalah `<th>`, bukan `<td>` yang ditebalkan. Itulah yang diulang pembaca layar sebelum tiap nilai, sehingga pendengar mendengar "Nilai: 80" alih-alih angka telanjang.',
              },
              code: '<table>\n  <tr>\n    <th>Nama</th>\n    <th>Nilai</th>\n  </tr>\n  <tr>\n    <td>Ani</td>\n    <td>80</td>\n  </tr>\n</table>',
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Tables are for data, not layout', id: 'Tabel untuk data, bukan tata letak' },
              body: {
                en: 'Old sites used tables to place things on the page. Do not. A table announces "this is a grid of related values", and using it for layout tells every screen reader a lie. Layout is CSS.',
                id: 'Situs lama memakai tabel untuk menempatkan sesuatu di halaman. Jangan. Tabel mengumumkan "ini kisi nilai yang saling berkaitan", dan memakainya untuk tata letak berarti membohongi setiap pembaca layar. Tata letak itu urusan CSS.',
              },
              code: '<table>\n  <caption>Nilai ujian kelas 10A</caption>\n  <tr><th>Nama</th><th>Nilai</th></tr>\n  <tr><td>Ani</td><td>80</td></tr>\n</table>',
              preview: true,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A table has 3 rows and 4 columns. How many `<tr>` elements?',
                id: 'Sebuah tabel punya 3 baris dan 4 kolom. Berapa elemen `<tr>`?',
              },
              options: [
                { en: '3', id: '3' },
                { en: '4', id: '4' },
                { en: '12', id: '12' },
                { en: '7', id: '7' },
              ],
              answer: 0,
              explain: {
                en: 'tr means "table row". Each of the 3 rows then holds 4 cells.',
                id: 'tr berarti "baris tabel". Tiap dari 3 baris itu lalu memuat 4 sel.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: { en: 'Make the first row a header row.', id: 'Jadikan baris pertama sebagai baris header.' },
              template: '<table>\n  <tr>\n    <___>Nama</th>\n    <th>Kota___th>\n  </tr>\n</table>',
              blanks: ['th', '</'],
              explain: {
                en: 'Header cells use th at both ends; td is for ordinary data.',
                id: 'Sel header memakai th di kedua ujungnya; td untuk data biasa.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              prompt: {
                en: 'Build a table with a header row `Barang` / `Harga`, then two data rows: `Pensil` `3000` and `Buku` `15000`.',
                id: 'Bangun tabel dengan baris header `Barang` / `Harga`, lalu dua baris data: `Pensil` `3000` dan `Buku` `15000`.',
              },
              starter: '<table>\n\n</table>\n',
              tests: [
                {
                  name: { en: 'Three rows', id: 'Tiga baris' },
                  check: 'assert(all("table tr").length === 3, "harus tiga <tr>, ada: " + all("table tr").length);',
                },
                {
                  name: { en: 'The first row uses header cells', id: 'Baris pertama memakai sel header' },
                  check:
                    'var th = all("table tr")[0].querySelectorAll("th");\nassert(th.length === 2, "baris pertama harus punya dua <th>");\nassert(th[0].textContent.trim() === "Barang", "header pertama: Barang");\nassert(th[1].textContent.trim() === "Harga", "header kedua: Harga");',
                },
                {
                  name: { en: 'The data rows are right', id: 'Baris datanya benar' },
                  check:
                    'var r = all("table tr");\nvar mau = [["Pensil", "3000"], ["Buku", "15000"]];\nfor (var i = 0; i < 2; i++) {\n  var td = r[i + 1].querySelectorAll("td");\n  assert(td.length === 2, "baris data harus punya dua <td>");\n  assert(td[0].textContent.trim() === mau[i][0], "sel harus: " + mau[i][0]);\n  assert(td[1].textContent.trim() === mau[i][1], "sel harus: " + mau[i][1]);\n}',
                },
              ],
              hints: [
                { en: 'Three tr in total: one header row and two data rows.', id: 'Total tiga tr: satu baris header dan dua baris data.' },
                { en: 'The header row uses th; the data rows use td.', id: 'Baris headernya memakai th; baris datanya memakai td.' },
              ],
              solution:
                '<table>\n  <tr>\n    <th>Barang</th>\n    <th>Harga</th>\n  </tr>\n  <tr>\n    <td>Pensil</td>\n    <td>3000</td>\n  </tr>\n  <tr>\n    <td>Buku</td>\n    <td>15000</td>\n  </tr>\n</table>',
            },
          ],
        },
        {
          id: 'html-m3-s1-l2',
          title: { en: 'Head, body, and spans', id: 'Kepala, badan, dan rentang' },
          goal: { en: 'Label the parts of a table.', id: 'Melabeli bagian-bagian tabel.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'caption, thead, tbody', id: 'caption, thead, tbody' },
              body: {
                en: '`<caption>` is the table\'s title and must come first. `<thead>` groups the header row and `<tbody>` the data — which lets a long table keep its headers visible while the rest scrolls.',
                id: '`<caption>` adalah judul tabelnya dan harus berada paling depan. `<thead>` mengelompokkan baris header dan `<tbody>` mengelompokkan datanya — yang membuat tabel panjang tetap menampilkan headernya saat sisanya digulir.',
              },
              code: '<table>\n  <caption>Nilai Ujian</caption>\n  <thead>\n    <tr><th>Nama</th><th>Nilai</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Ani</td><td>80</td></tr>\n    <tr><td>Budi</td><td>65</td></tr>\n  </tbody>\n</table>',
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'One cell over several columns', id: 'Satu sel melintasi beberapa kolom' },
              body: {
                en: '`colspan` makes a cell span columns, `rowspan` makes it span rows. The catch: a row with a spanning cell has *fewer* cells written, because one is doing two jobs.',
                id: '`colspan` membuat sebuah sel melintasi kolom, `rowspan` melintasi baris. Jebakannya: baris dengan sel melintang punya *lebih sedikit* sel yang ditulis, karena satu sel mengerjakan dua tugas.',
              },
              code: '<table>\n  <tr><th>Nama</th><th>Nilai</th></tr>\n  <tr><td>Ani</td><td>80</td></tr>\n  <tr><td colspan="2">Rata-rata: 80</td></tr>\n</table>',
              preview: true,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A table has 3 columns. A row uses one cell with `colspan="2"`. How many cells are written in that row?',
                id: 'Sebuah tabel punya 3 kolom. Satu baris memakai sel ber-`colspan="2"`. Berapa sel yang ditulis di baris itu?',
              },
              options: [
                { en: '2', id: '2' },
                { en: '3', id: '3' },
                { en: '1', id: '1' },
                { en: '4', id: '4' },
              ],
              answer: 0,
              explain: {
                en: 'The spanning cell fills two columns, so only one more cell is needed for the third.',
                id: 'Sel melintangnya mengisi dua kolom, jadi cukup satu sel lagi untuk kolom ketiga.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              prompt: {
                en: 'Build a table with the caption `Daftar Nilai`, a `thead` with `Nama` / `Nilai`, a `tbody` with one row `Ani` `80`, and a final row in the tbody spanning both columns with the text `Total: 80`.',
                id: 'Bangun tabel dengan caption `Daftar Nilai`, sebuah `thead` berisi `Nama` / `Nilai`, sebuah `tbody` berisi satu baris `Ani` `80`, dan baris terakhir di tbody yang melintasi kedua kolom bertuliskan `Total: 80`.',
              },
              starter: '<table>\n\n</table>\n',
              tests: [
                {
                  name: { en: 'The caption comes first', id: 'Caption berada paling depan' },
                  check:
                    'var cap = sel("table > caption");\nassert(cap, "belum ada <caption> di dalam <table>");\nassert(cap.textContent.trim() === "Daftar Nilai", "caption harus: Daftar Nilai");\nassert(sel("table").firstElementChild === cap, "caption harus menjadi anak pertama <table>");',
                },
                {
                  name: { en: 'thead holds the header row', id: 'thead memuat baris header' },
                  check:
                    'var th = all("table thead th");\nassert(th.length === 2, "thead harus punya dua <th>");\nassert(th[0].textContent.trim() === "Nama");\nassert(th[1].textContent.trim() === "Nilai");',
                },
                {
                  name: { en: 'tbody holds the data row', id: 'tbody memuat baris data' },
                  check:
                    'var r = all("table tbody tr");\nassert(r.length === 2, "tbody harus punya dua baris, ada: " + r.length);\nvar td = r[0].querySelectorAll("td");\nassert(td[0].textContent.trim() === "Ani" && td[1].textContent.trim() === "80", "baris data harus Ani / 80");',
                },
                {
                  name: { en: 'The last row spans both columns', id: 'Baris terakhir melintasi kedua kolom' },
                  check:
                    'var akhir = all("table tbody tr")[1].querySelectorAll("td");\nassert(akhir.length === 1, "baris terakhir cukup satu sel, ada: " + akhir.length);\nassert(akhir[0].getAttribute("colspan") === "2", "sel itu butuh colspan=\\"2\\"");\nassert(akhir[0].textContent.trim() === "Total: 80", "isinya harus: Total: 80");',
                },
              ],
              hints: [
                { en: 'Order inside table: caption, thead, tbody.', id: 'Urutan di dalam table: caption, thead, tbody.' },
                { en: 'The total row lives inside tbody, not after it.', id: 'Baris totalnya ada di dalam tbody, bukan setelahnya.' },
                { en: '<td colspan="2">Total: 80</td>', id: '<td colspan="2">Total: 80</td>' },
              ],
              solution:
                '<table>\n  <caption>Daftar Nilai</caption>\n  <thead>\n    <tr><th>Nama</th><th>Nilai</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Ani</td><td>80</td></tr>\n    <tr><td colspan="2">Total: 80</td></tr>\n  </tbody>\n</table>',
            },
          ],
        },
      ],
      project: {
        id: 'html-m3-s1-p',
        runtime: 'web',
        title: { en: 'Class timetable', id: 'Jadwal pelajaran' },
        brief: {
          en: 'A readable timetable — headers that mean something, and a caption.',
          id: 'Jadwal yang terbaca — header yang bermakna, dan sebuah caption.',
        },
        requirements: [
          { en: 'Full document with the title `Jadwal`.', id: 'Dokumen lengkap dengan judul `Jadwal`.' },
          { en: 'A table with the caption `Jadwal Pelajaran`.', id: 'Sebuah tabel dengan caption `Jadwal Pelajaran`.' },
          { en: 'A `thead` with three headers: `Jam`, `Senin`, `Selasa`.', id: 'Sebuah `thead` dengan tiga header: `Jam`, `Senin`, `Selasa`.' },
          { en: 'A `tbody` with exactly three rows of three cells each.', id: 'Sebuah `tbody` dengan tepat tiga baris, masing-masing tiga sel.' },
          { en: 'The first cell of every body row is a `th` — it labels the row.', id: 'Sel pertama tiap baris badan adalah `th` — ia melabeli barisnya.' },
        ],
        starter:
          '<!doctype html>\n<html lang="id">\n  <head>\n    <meta charset="utf-8">\n    <title>Jadwal</title>\n  </head>\n  <body>\n\n  </body>\n</html>\n',
        tests: [
          {
            name: { en: 'Caption and column headers', id: 'Caption dan header kolom' },
            check:
              'assert(text("table > caption") === "Jadwal Pelajaran", "caption harus: Jadwal Pelajaran");\nvar th = all("table thead th");\nassert(th.length === 3, "thead harus punya tiga <th>, ada: " + th.length);\nvar mau = ["Jam", "Senin", "Selasa"];\nfor (var i = 0; i < 3; i++) assert(th[i].textContent.trim() === mau[i], "header ke-" + (i + 1) + " harus: " + mau[i]);',
          },
          {
            name: { en: 'Three body rows', id: 'Tiga baris badan' },
            check: 'assert(all("table tbody tr").length === 3, "tbody harus punya tiga baris, ada: " + all("table tbody tr").length);',
          },
          {
            name: { en: 'Each row has three cells', id: 'Tiap baris punya tiga sel' },
            check:
              'all("table tbody tr").forEach(function (r, i) {\n  var n = r.querySelectorAll("th, td").length;\n  assert(n === 3, "baris ke-" + (i + 1) + " harus punya tiga sel, ada: " + n);\n});',
          },
          {
            name: { en: 'Every row is labelled by a th', id: 'Tiap baris dilabeli sebuah th' },
            check:
              'all("table tbody tr").forEach(function (r, i) {\n  var pertama = r.querySelector("th, td");\n  assert(pertama.tagName === "TH", "sel pertama baris ke-" + (i + 1) + " harus <th>, bukan <td>");\n  assert(pertama.textContent.trim().length > 0, "label baris tidak boleh kosong");\n});',
          },
        ],
        hints: [
          { en: 'The row label being a th is what makes the table readable aloud.', id: 'Label baris berupa th itulah yang membuat tabelnya terbaca saat dibacakan.' },
          { en: 'A body row looks like: <tr><th>07.00</th><td>Matematika</td><td>Bahasa</td></tr>', id: 'Baris badannya berbentuk: <tr><th>07.00</th><td>Matematika</td><td>Bahasa</td></tr>' },
          { en: 'Order inside the table: caption, thead, tbody.', id: 'Urutan di dalam tabel: caption, thead, tbody.' },
        ],
        solution:
          '<!doctype html>\n<html lang="id">\n  <head>\n    <meta charset="utf-8">\n    <title>Jadwal</title>\n  </head>\n  <body>\n    <table>\n      <caption>Jadwal Pelajaran</caption>\n      <thead>\n        <tr><th>Jam</th><th>Senin</th><th>Selasa</th></tr>\n      </thead>\n      <tbody>\n        <tr><th>07.00</th><td>Matematika</td><td>Bahasa</td></tr>\n        <tr><th>09.00</th><td>Fisika</td><td>Sejarah</td></tr>\n        <tr><th>11.00</th><td>Informatika</td><td>Olahraga</td></tr>\n      </tbody>\n    </table>\n  </body>\n</html>',
        xp: 50,
      },
    },

    /* ------------------------------------------------------------- 3.2 forms */
    {
      id: 'html-m3-s2',
      title: { en: 'Forms', id: 'Formulir' },
      summary: {
        en: 'Inputs, and the labels without which they are guesswork.',
        id: 'Input, dan label yang tanpanya semua jadi tebak-tebakan.',
      },
      lessons: [
        {
          id: 'html-m3-s2-l1',
          title: { en: 'Inputs and labels', id: 'Input dan label' },
          goal: { en: 'Collect text, correctly labelled.', id: 'Mengumpulkan teks, dengan label yang benar.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'One tag, many types', id: 'Satu tag, banyak tipe' },
              body: {
                en: '`<input>` is a single self-closing tag whose `type` decides what it becomes: `text`, `email`, `number`, `password`, `date`, `checkbox`. Choosing the right type gives phones the right keyboard for free.',
                id: '`<input>` adalah satu tag tanpa penutup yang `type`-nya menentukan wujudnya: `text`, `email`, `number`, `password`, `date`, `checkbox`. Memilih tipe yang tepat memberi papan ketik yang tepat di ponsel, gratis.',
              },
              code: '<input type="text" placeholder="Nama">\n<input type="email" placeholder="Email">\n<input type="number" placeholder="Umur">',
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A label must be attached, not just nearby', id: 'Label harus melekat, bukan sekadar berdekatan' },
              body: {
                en: 'Text sitting next to a box is not a label. `<label for="x">` attached to `<input id="x">` is — and then clicking the words focuses the field, and a screen reader reads the two together. `placeholder` is a hint, never a replacement: it vanishes the moment typing starts.',
                id: 'Teks yang duduk di sebelah kotak bukanlah label. `<label for="x">` yang melekat pada `<input id="x">` barulah label — dan mengklik kata-katanya akan memfokuskan isiannya, serta pembaca layar membacakan keduanya bersama. `placeholder` itu petunjuk, bukan pengganti: ia lenyap begitu pengguna mulai mengetik.',
              },
              code: '<label for="nama">Nama lengkap</label>\n<input type="text" id="nama" name="nama">',
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'name is what gets sent', id: 'name adalah yang terkirim' },
              body: {
                en: '`id` connects the label to the field; `name` is the key the value travels under when the form is submitted. A field with no `name` sends nothing at all.',
                id: '`id` menghubungkan label ke isiannya; `name` adalah kunci yang menyertai nilainya saat formulir dikirim. Isian tanpa `name` tidak mengirim apa pun.',
              },
              code: '<form>\n  <label for="email">Email</label>\n  <input type="email" id="email" name="email" required>\n</form>',
              preview: true,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What connects `<label for="umur">` to its field?',
                id: 'Apa yang menghubungkan `<label for="umur">` dengan isiannya?',
              },
              options: [
                { en: 'The input\'s id="umur"', id: 'Atribut id="umur" pada input' },
                { en: 'The input\'s name="umur"', id: 'Atribut name="umur" pada input' },
                { en: 'Being next to each other', id: 'Letaknya bersebelahan' },
                { en: 'The input\'s type', id: 'Atribut type pada input' },
              ],
              answer: 0,
              explain: {
                en: '`for` points at an `id`. name matters when the form is sent, not for the label.',
                id: '`for` menunjuk sebuah `id`. name berperan saat formulir dikirim, bukan untuk labelnya.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: { en: 'Attach the label to the field.', id: 'Lekatkan labelnya ke isian.' },
              template: '<label ___="kota">Kota</label>\n<input type="text" ___="kota" name="kota">',
              blanks: ['for', 'id'],
              explain: {
                en: 'for on the label must match id on the input, exactly.',
                id: 'for pada label harus sama persis dengan id pada input.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              prompt: {
                en: 'Inside a `form`, add a labelled text field for `Nama` (id and name `nama`) and a labelled email field for `Email` (id and name `email`), with the email required.',
                id: 'Di dalam sebuah `form`, tambahkan isian teks berlabel `Nama` (id dan name `nama`) serta isian email berlabel `Email` (id dan name `email`), dengan email wajib diisi.',
              },
              starter: '<form>\n\n</form>\n',
              tests: [
                {
                  name: { en: 'Both fields exist with the right types', id: 'Kedua isian ada dengan tipe yang benar' },
                  check:
                    'var n = sel("form input#nama");\nvar e = sel("form input#email");\nassert(n, "belum ada input dengan id nama");\nassert(e, "belum ada input dengan id email");\nassert(n.getAttribute("type") === "text", "nama harus type=text");\nassert(e.getAttribute("type") === "email", "email harus type=email");',
                },
                {
                  name: { en: 'Both are labelled', id: 'Keduanya berlabel' },
                  check:
                    'var ln = sel(\'label[for="nama"]\');\nvar le = sel(\'label[for="email"]\');\nassert(ln, "butuh <label for=\\"nama\\">");\nassert(le, "butuh <label for=\\"email\\">");\nassert(ln.textContent.trim() === "Nama", "label harus: Nama");\nassert(le.textContent.trim() === "Email", "label harus: Email");',
                },
                {
                  name: { en: 'Both send a value, and email is required', id: 'Keduanya mengirim nilai, dan email wajib' },
                  check:
                    'assert(attr("#nama", "name") === "nama", "input nama butuh name=nama");\nassert(attr("#email", "name") === "email", "input email butuh name=email");\nassert(sel("#email").hasAttribute("required"), "email harus required");',
                },
              ],
              hints: [
                { en: 'Each field is two elements: a label, then the input.', id: 'Tiap isian terdiri dari dua elemen: sebuah label, lalu input-nya.' },
                { en: 'The input needs three attributes: type, id, name.', id: 'Input-nya butuh tiga atribut: type, id, name.' },
                { en: '`required` is written on its own, with no value.', id: '`required` ditulis sendirian, tanpa nilai.' },
              ],
              solution:
                '<form>\n  <label for="nama">Nama</label>\n  <input type="text" id="nama" name="nama">\n\n  <label for="email">Email</label>\n  <input type="email" id="email" name="email" required>\n</form>',
            },
          ],
        },
        {
          id: 'html-m3-s2-l2',
          title: { en: 'Choices and buttons', id: 'Pilihan dan tombol' },
          goal: { en: 'Offer options and submit the form.', id: 'Menawarkan pilihan dan mengirim formulir.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'select for one of many', id: 'select untuk satu dari banyak' },
              body: {
                en: '`<select>` holds `<option>` elements. The `value` is what gets sent; the text between the tags is what the reader sees. They are often different, and that is fine.',
                id: '`<select>` memuat elemen `<option>`. `value`-nya yang terkirim; teks di antara tagnya yang dilihat pembaca. Keduanya sering berbeda, dan itu wajar.',
              },
              code: '<label for="kelas">Kelas</label>\n<select id="kelas" name="kelas">\n  <option value="10">Kelas 10</option>\n  <option value="11">Kelas 11</option>\n</select>',
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'radio for one, checkbox for many', id: 'radio untuk satu, checkbox untuk banyak' },
              body: {
                en: 'Radio buttons that share a `name` become one group where only one can be chosen. Checkboxes are independent. Each still needs its own `id` and its own label.',
                id: 'Tombol radio yang berbagi `name` menjadi satu grup di mana hanya satu yang bisa dipilih. Checkbox berdiri sendiri-sendiri. Masing-masing tetap butuh `id` dan labelnya sendiri.',
              },
              code: '<input type="radio" id="l" name="jk" value="L">\n<label for="l">Laki-laki</label>\n<input type="radio" id="p" name="jk" value="P">\n<label for="p">Perempuan</label>',
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'textarea and the submit button', id: 'textarea dan tombol kirim' },
              body: {
                en: '`<textarea>` is for long text and, unlike `<input>`, has a closing tag. `<button type="submit">` sends the form. Say what it does — "Kirim pesan" beats "Submit".',
                id: '`<textarea>` untuk teks panjang dan, tidak seperti `<input>`, punya tag penutup. `<button type="submit">` mengirim formulirnya. Sebutkan tindakannya — "Kirim pesan" lebih baik daripada "Submit".',
              },
              code: '<label for="pesan">Pesan</label>\n<textarea id="pesan" name="pesan" rows="3"></textarea>\n<button type="submit">Kirim pesan</button>',
              preview: true,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Two radio buttons must be mutually exclusive. What must they share?',
                id: 'Dua tombol radio harus saling meniadakan. Apa yang harus mereka bagi bersama?',
              },
              options: [
                { en: 'The same name', id: 'name yang sama' },
                { en: 'The same id', id: 'id yang sama' },
                { en: 'The same value', id: 'value yang sama' },
                { en: 'The same label', id: 'label yang sama' },
              ],
              answer: 0,
              explain: {
                en: 'The shared name makes the group. Sharing an id would be invalid — an id must be unique.',
                id: 'name yang sama membentuk grupnya. Berbagi id justru tidak sah — id harus unik.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              prompt: {
                en: 'Add a labelled `select` with id and name `kota` offering `Surabaya` (value `sby`) and `Malang` (value `mlg`), plus a submit button reading `Kirim`.',
                id: 'Tambahkan `select` berlabel dengan id dan name `kota` yang menawarkan `Surabaya` (value `sby`) dan `Malang` (value `mlg`), ditambah tombol kirim bertuliskan `Kirim`.',
              },
              starter: '<form>\n\n</form>\n',
              tests: [
                {
                  name: { en: 'A labelled select', id: 'Select yang berlabel' },
                  check:
                    'var s = sel("form select#kota");\nassert(s, "belum ada <select id=\\"kota\\">");\nassert(s.getAttribute("name") === "kota", "select butuh name=kota");\nassert(sel(\'label[for="kota"]\'), "butuh <label for=\\"kota\\">");',
                },
                {
                  name: { en: 'Two options with the right values', id: 'Dua opsi dengan value yang benar' },
                  check:
                    'var o = all("select#kota option");\nassert(o.length === 2, "harus dua <option>, ada: " + o.length);\nassert(o[0].getAttribute("value") === "sby" && o[0].textContent.trim() === "Surabaya", "opsi pertama: Surabaya / sby");\nassert(o[1].getAttribute("value") === "mlg" && o[1].textContent.trim() === "Malang", "opsi kedua: Malang / mlg");',
                },
                {
                  name: { en: 'A submit button', id: 'Tombol kirim' },
                  check:
                    'var b = sel("form button");\nassert(b, "belum ada <button>");\nassert(b.getAttribute("type") === "submit", "tombol harus type=submit");\nassert(b.textContent.trim() === "Kirim", "tombol harus bertuliskan: Kirim");',
                },
              ],
              hints: [
                { en: 'The label points at the select the same way it points at an input.', id: 'Labelnya menunjuk select dengan cara yang sama seperti menunjuk input.' },
                { en: 'value is an attribute; the visible name is the text between the option tags.', id: 'value adalah atribut; nama yang terlihat adalah teks di antara tag option.' },
              ],
              solution:
                '<form>\n  <label for="kota">Kota</label>\n  <select id="kota" name="kota">\n    <option value="sby">Surabaya</option>\n    <option value="mlg">Malang</option>\n  </select>\n  <button type="submit">Kirim</button>\n</form>',
            },
          ],
        },
      ],
      project: {
        id: 'html-m3-s2-p',
        runtime: 'web',
        title: { en: 'Registration form', id: 'Formulir pendaftaran' },
        brief: {
          en: 'A complete form where every field is properly labelled.',
          id: 'Formulir lengkap yang setiap isiannya berlabel dengan benar.',
        },
        requirements: [
          { en: 'Full document with the title `Pendaftaran`.', id: 'Dokumen lengkap dengan judul `Pendaftaran`.' },
          { en: 'A `form` containing: text `nama`, email `email`, number `umur`.', id: 'Sebuah `form` berisi: teks `nama`, email `email`, angka `umur`.' },
          { en: 'A `select` named `kursus` with at least two options.', id: 'Sebuah `select` bernama `kursus` dengan minimal dua opsi.' },
          { en: 'A `textarea` named `alasan`.', id: 'Sebuah `textarea` bernama `alasan`.' },
          { en: 'Every one of those five fields has its own `label` with a matching `for`.', id: 'Kelima isian itu masing-masing punya `label` sendiri dengan `for` yang cocok.' },
          { en: 'A submit button. `nama` and `email` are required.', id: 'Sebuah tombol kirim. `nama` dan `email` wajib diisi.' },
        ],
        starter:
          '<!doctype html>\n<html lang="id">\n  <head>\n    <meta charset="utf-8">\n    <title>Pendaftaran</title>\n  </head>\n  <body>\n    <h1>Pendaftaran</h1>\n    <form>\n\n    </form>\n  </body>\n</html>\n',
        tests: [
          {
            name: { en: 'The three inputs, with the right types', id: 'Ketiga input, dengan tipe yang benar' },
            check:
              'var mau = { nama: "text", email: "email", umur: "number" };\nfor (var k in mau) {\n  var el = sel("form input#" + k);\n  assert(el, "belum ada input dengan id " + k);\n  assert(el.getAttribute("type") === mau[k], k + " harus type=" + mau[k]);\n  assert(el.getAttribute("name") === k, k + " butuh name=" + k);\n}',
          },
          {
            name: { en: 'The select offers real choices', id: 'Select menawarkan pilihan sungguhan' },
            check:
              'var s = sel("form select");\nassert(s, "belum ada <select>");\nassert(s.getAttribute("name") === "kursus", "select butuh name=kursus");\nassert(s.querySelectorAll("option").length >= 2, "select butuh minimal dua option");',
          },
          {
            name: { en: 'The textarea is there', id: 'Textarea-nya ada' },
            check:
              'var t = sel("form textarea");\nassert(t, "belum ada <textarea>");\nassert(t.getAttribute("name") === "alasan", "textarea butuh name=alasan");',
          },
          {
            name: { en: 'Every field is labelled', id: 'Tiap isian berlabel' },
            check:
              'var kolom = all("form input, form select, form textarea");\nassert(kolom.length >= 5, "harus ada lima isian, ada: " + kolom.length);\nkolom.forEach(function (f) {\n  var id = f.getAttribute("id");\n  assert(id, "setiap isian butuh id, ada yang belum punya");\n  var l = doc.querySelector(\'label[for="\' + id + \'"]\');\n  assert(l, "belum ada label untuk isian ber-id " + id);\n  assert(l.textContent.trim().length > 0, "label untuk " + id + " tidak boleh kosong");\n});',
          },
          {
            name: { en: 'Required fields and a submit button', id: 'Isian wajib dan tombol kirim' },
            check:
              'assert(sel("#nama").hasAttribute("required"), "nama harus required");\nassert(sel("#email").hasAttribute("required"), "email harus required");\nvar b = sel("form button, form input[type=submit]");\nassert(b, "belum ada tombol kirim");',
          },
        ],
        hints: [
          { en: 'Work field by field: label, then the control, then move on.', id: 'Kerjakan isian demi isian: label, lalu kontrolnya, lalu lanjut.' },
          { en: 'Every control needs an id, and its label needs the same value in for.', id: 'Tiap kontrol butuh id, dan labelnya butuh nilai sama di for.' },
          { en: 'select and textarea are labelled exactly like an input.', id: 'select dan textarea diberi label persis seperti input.' },
          { en: 'textarea has a closing tag even when empty: <textarea …></textarea>', id: 'textarea punya tag penutup meski kosong: <textarea …></textarea>' },
        ],
        solution:
          '<!doctype html>\n<html lang="id">\n  <head>\n    <meta charset="utf-8">\n    <title>Pendaftaran</title>\n  </head>\n  <body>\n    <h1>Pendaftaran</h1>\n    <form>\n      <label for="nama">Nama</label>\n      <input type="text" id="nama" name="nama" required>\n\n      <label for="email">Email</label>\n      <input type="email" id="email" name="email" required>\n\n      <label for="umur">Umur</label>\n      <input type="number" id="umur" name="umur">\n\n      <label for="kursus">Kursus</label>\n      <select id="kursus" name="kursus">\n        <option value="python">Python</option>\n        <option value="html">HTML</option>\n      </select>\n\n      <label for="alasan">Alasan mendaftar</label>\n      <textarea id="alasan" name="alasan" rows="3"></textarea>\n\n      <button type="submit">Daftar</button>\n    </form>\n  </body>\n</html>',
        xp: 50,
      },
    },
  ],
}
