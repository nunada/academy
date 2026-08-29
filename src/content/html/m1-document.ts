import type { Module } from '../types'

/** Module 1 — what a tag is, what a page is made of, and how text gets meaning.
 *  Every `web` step renders beside the editor, so the learner sees the effect of
 *  a tag before it is explained away in words. */
export const module1: Module = {
  id: 'html-m1',
  title: { en: 'Your First Page', id: 'Halaman Pertamamu' },
  summary: {
    en: 'Tags, the skeleton every page shares, and text that means something.',
    id: 'Tag, kerangka yang dimiliki setiap halaman, dan teks yang bermakna.',
  },
  submodules: [
    /* ------------------------------------------------------- 1.1 tags & skeleton */
    {
      id: 'html-m1-s1',
      title: { en: 'Tags and Elements', id: 'Tag dan Elemen' },
      summary: {
        en: 'Mark up a piece of text, then wrap it in a proper document.',
        id: 'Menandai sepotong teks, lalu membungkusnya dalam dokumen yang benar.',
      },
      lessons: [
        {
          id: 'html-m1-s1-l1',
          title: { en: 'A tag wraps meaning', id: 'Tag membungkus makna' },
          goal: { en: 'Write your first elements.', id: 'Menulis elemen pertamamu.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'HTML labels, it does not draw', id: 'HTML melabeli, bukan menggambar' },
              body: {
                en: 'HTML is not a programming language and it is not a drawing tool. It **labels** text so the browser knows what each piece is. `<h1>` says "this is the main heading"; `<p>` says "this is a paragraph". The browser then decides how to show it.',
                id: 'HTML bukan bahasa pemrograman dan bukan alat menggambar. Ia **melabeli** teks agar peramban tahu tiap bagian itu apa. `<h1>` berkata "ini judul utama"; `<p>` berkata "ini paragraf". Peramban lalu memutuskan cara menampilkannya.',
              },
              code: '<h1>Nunada Academy</h1>\n<p>Belajar coding langkah demi langkah.</p>',
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Open, content, close', id: 'Buka, isi, tutup' },
              body: {
                en: 'Most elements come in a pair: `<p>` opens and `</p>` closes — the slash is the only difference. Everything between them belongs to that element. Forget the closing tag and the browser guesses, usually wrongly.',
                id: 'Sebagian besar elemen berpasangan: `<p>` membuka dan `</p>` menutup — garis miring satu-satunya pembeda. Semua di antaranya milik elemen itu. Lupakan tag penutupnya dan peramban akan menebak, biasanya keliru.',
              },
              code: '<p>Paragraf ini ditutup dengan benar.</p>\n<p>Yang ini juga.</p>',
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Some tags stand alone', id: 'Sebagian tag berdiri sendiri' },
              body: {
                en: 'A few elements have no content to wrap, so they never get a closing tag. `<br>` breaks a line and `<hr>` draws a dividing rule. These are the exception, not the rule.',
                id: 'Beberapa elemen tidak punya isi untuk dibungkus, jadi tidak pernah punya tag penutup. `<br>` memutus baris dan `<hr>` menggambar garis pemisah. Ini pengecualian, bukan kelaziman.',
              },
              code: '<p>Baris pertama<br>Baris kedua</p>\n<hr>\n<p>Setelah garis.</p>',
              preview: true,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'Which line closes a paragraph?', id: 'Baris mana yang menutup sebuah paragraf?' },
              options: [
                { en: '</p>', id: '</p>' },
                { en: '<p>', id: '<p>' },
                { en: '<p/>', id: '<p/>' },
                { en: '<\\p>', id: '<\\p>' },
              ],
              answer: 0,
              explain: {
                en: 'A closing tag repeats the name with a forward slash in front of it.',
                id: 'Tag penutup mengulang namanya dengan garis miring di depannya.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the heading and the paragraph.',
                id: 'Lengkapi judul dan paragrafnya.',
              },
              template: '<h1>Halo</h1___\n<___>Selamat datang</p>',
              blanks: ['>', 'p'],
              explain: {
                en: 'A tag always ends with `>`, and the opening tag names the element.',
                id: 'Sebuah tag selalu diakhiri `>`, dan tag pembuka menyebut nama elemennya.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              prompt: {
                en: 'Write a heading that says `Profil Saya` and a paragraph below it that says `Saya sedang belajar HTML.`',
                id: 'Tulis judul bertuliskan `Profil Saya` dan sebuah paragraf di bawahnya bertuliskan `Saya sedang belajar HTML.`',
              },
              starter: '',
              tests: [
                {
                  name: { en: 'There is an h1 with the right text', id: 'Ada h1 dengan teks yang benar' },
                  check: 'assert(sel("h1"), "belum ada elemen <h1>");\nassert(text("h1") === "Profil Saya", "teks h1 harus tepat: Profil Saya");',
                },
                {
                  name: { en: 'There is a paragraph with the right text', id: 'Ada paragraf dengan teks yang benar' },
                  check: 'assert(sel("p"), "belum ada elemen <p>");\nassert(text("p") === "Saya sedang belajar HTML.", "teks paragraf harus tepat, termasuk titiknya");',
                },
              ],
              hints: [
                { en: 'Two elements, each on its own line.', id: 'Dua elemen, masing-masing di barisnya sendiri.' },
                { en: 'The heading uses h1; the paragraph uses p.', id: 'Judulnya memakai h1; paragrafnya memakai p.' },
                { en: '<h1>Profil Saya</h1> then <p>Saya sedang belajar HTML.</p>', id: '<h1>Profil Saya</h1> lalu <p>Saya sedang belajar HTML.</p>' },
              ],
              solution: '<h1>Profil Saya</h1>\n<p>Saya sedang belajar HTML.</p>',
            },
          ],
        },
        {
          id: 'html-m1-s1-l2',
          title: { en: 'The skeleton of a page', id: 'Kerangka sebuah halaman' },
          goal: { en: 'Write a complete document.', id: 'Menulis dokumen yang utuh.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Every page has the same bones', id: 'Setiap halaman bertulang sama' },
              body: {
                en: 'A real page is not loose tags. `<!doctype html>` says which version, `<html>` wraps everything, `<head>` holds information *about* the page, and `<body>` holds what people actually see.',
                id: 'Halaman sungguhan bukan tag yang berserak. `<!doctype html>` menyatakan versinya, `<html>` membungkus semuanya, `<head>` memuat keterangan *tentang* halamannya, dan `<body>` memuat yang benar-benar dilihat orang.',
              },
              code: '<!doctype html>\n<html lang="id">\n  <head>\n    <meta charset="utf-8">\n    <title>Profil Saya</title>\n  </head>\n  <body>\n    <h1>Halo</h1>\n  </body>\n</html>',
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'What the head is for', id: 'Untuk apa head itu' },
              body: {
                en: 'Nothing in `<head>` appears on the page. `<title>` names the browser tab and is what search results show. `<meta charset="utf-8">` tells the browser how to read the letters — leave it out and accented characters turn into rubbish.',
                id: 'Tidak ada isi `<head>` yang muncul di halaman. `<title>` menamai tab peramban dan itulah yang ditampilkan hasil pencarian. `<meta charset="utf-8">` memberi tahu peramban cara membaca hurufnya — hilangkan ia dan huruf beraksen berubah jadi sampah.',
              },
              code: '<head>\n  <meta charset="utf-8">\n  <title>Judul di tab, bukan di halaman</title>\n</head>',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Nesting must not cross', id: 'Sarang tidak boleh bersilang' },
              body: {
                en: 'Elements sit inside one another like boxes. The one opened last must close first. Crossing them — `<b><i>teks</b></i>` — is invalid, and browsers repair it in ways you did not ask for.',
                id: 'Elemen bersarang satu di dalam lainnya seperti kotak. Yang dibuka terakhir harus ditutup pertama. Menyilangkannya — `<b><i>teks</b></i>` — tidak sah, dan peramban memperbaikinya dengan cara yang tidak kamu minta.',
              },
              code: '<body>\n  <h1>Benar</h1>\n  <p>Teks <strong>tebal</strong> di dalam paragraf.</p>\n</body>',
              preview: true,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Where does the text people read on the page go?',
                id: 'Di mana teks yang dibaca orang pada halaman itu diletakkan?',
              },
              options: [
                { en: 'Inside <body>', id: 'Di dalam <body>' },
                { en: 'Inside <head>', id: 'Di dalam <head>' },
                { en: 'Inside <title>', id: 'Di dalam <title>' },
                { en: 'Before <!doctype html>', id: 'Sebelum <!doctype html>' },
              ],
              answer: 0,
              explain: {
                en: 'head describes the page; body is the page.',
                id: 'head menjelaskan halamannya; body adalah halamannya.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Put the skeleton of a document in order.',
                id: 'Susun kerangka sebuah dokumen dengan urutan yang benar.',
              },
              lines: [
                '<!doctype html>',
                '<html lang="id">',
                '  <head>',
                '    <title>Halaman Saya</title>',
                '  </head>',
                '  <body>',
                '    <h1>Halo</h1>',
                '  </body>',
                '</html>',
              ],
              explain: {
                en: 'The doctype comes first, head before body, and every element closes in the reverse order it opened.',
                id: 'Doctype lebih dulu, head sebelum body, dan tiap elemen ditutup dengan urutan terbalik dari pembukaannya.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              prompt: {
                en: 'Write a complete document: language `id`, charset utf-8, the title `Halaman Saya`, and inside the body an `h1` saying `Halo Dunia`.',
                id: 'Tulis dokumen lengkap: bahasa `id`, charset utf-8, judul `Halaman Saya`, dan di dalam body sebuah `h1` bertuliskan `Halo Dunia`.',
              },
              starter: '<!doctype html>\n<html lang="id">\n  <head>\n\n  </head>\n  <body>\n\n  </body>\n</html>\n',
              tests: [
                {
                  name: { en: 'The language is set to id', id: 'Bahasanya disetel ke id' },
                  check: 'assert(doc.documentElement.getAttribute("lang") === "id", "atribut lang pada <html> harus id");',
                },
                {
                  name: { en: 'The charset is declared', id: 'Charset dideklarasikan' },
                  check: 'assert(sel("meta[charset]"), "belum ada <meta charset>");\nassert(attr("meta[charset]", "charset").toLowerCase() === "utf-8", "charset harus utf-8");',
                },
                {
                  name: { en: 'The title is right', id: 'Judulnya benar' },
                  check: 'assert(doc.title === "Halaman Saya", "judul harus: Halaman Saya, sekarang: " + doc.title);',
                },
                {
                  name: { en: 'The heading is in the body', id: 'Judulnya ada di dalam body' },
                  check: 'assert(sel("body h1"), "h1 harus berada di dalam <body>");\nassert(text("body h1") === "Halo Dunia", "teks h1 harus: Halo Dunia");',
                },
              ],
              hints: [
                { en: 'Two things go in the head, one in the body.', id: 'Dua hal masuk ke head, satu ke body.' },
                { en: '<meta charset="utf-8"> and <title>Halaman Saya</title>', id: '<meta charset="utf-8"> dan <title>Halaman Saya</title>' },
                { en: 'The h1 goes between <body> and </body>.', id: 'h1-nya diletakkan di antara <body> dan </body>.' },
              ],
              solution:
                '<!doctype html>\n<html lang="id">\n  <head>\n    <meta charset="utf-8">\n    <title>Halaman Saya</title>\n  </head>\n  <body>\n    <h1>Halo Dunia</h1>\n  </body>\n</html>',
            },
          ],
        },
      ],
      project: {
        id: 'html-m1-s1-p',
        runtime: 'web',
        title: { en: 'Introduction page', id: 'Halaman perkenalan' },
        brief: {
          en: 'A complete document that introduces you.',
          id: 'Sebuah dokumen utuh yang memperkenalkan dirimu.',
        },
        requirements: [
          { en: 'A full document: doctype, `<html lang="id">`, head and body.', id: 'Dokumen lengkap: doctype, `<html lang="id">`, head dan body.' },
          { en: 'Charset utf-8 and the title `Perkenalan`.', id: 'Charset utf-8 dan judul `Perkenalan`.' },
          { en: 'An `h1` with your name — use `Nunada`.', id: 'Sebuah `h1` berisi namamu — pakai `Nunada`.' },
          { en: 'Exactly two paragraphs below it.', id: 'Tepat dua paragraf di bawahnya.' },
          { en: 'A horizontal rule between the heading and the paragraphs.', id: 'Sebuah garis pemisah antara judul dan paragrafnya.' },
        ],
        starter: '<!doctype html>\n<html lang="id">\n  <head>\n\n  </head>\n  <body>\n\n  </body>\n</html>\n',
        tests: [
          {
            name: { en: 'The document is complete', id: 'Dokumennya lengkap' },
            check:
              'assert(doc.documentElement.getAttribute("lang") === "id", "lang harus id");\nassert(sel("meta[charset]"), "belum ada meta charset");\nassert(doc.title === "Perkenalan", "judul harus: Perkenalan");',
          },
          {
            name: { en: 'One heading with the name', id: 'Satu judul berisi nama' },
            check:
              'assert(all("h1").length === 1, "harus tepat satu h1, ada: " + all("h1").length);\nassert(text("h1") === "Nunada", "teks h1 harus: Nunada");',
          },
          {
            name: { en: 'Exactly two paragraphs', id: 'Tepat dua paragraf' },
            check:
              'var p = all("p");\nassert(p.length === 2, "harus tepat 2 paragraf, ada: " + p.length);\nassert(p[0].textContent.trim().length > 0, "paragraf pertama tidak boleh kosong");\nassert(p[1].textContent.trim().length > 0, "paragraf kedua tidak boleh kosong");',
          },
          {
            name: { en: 'A rule sits between them', id: 'Ada garis di antaranya' },
            check:
              'var hr = sel("hr");\nassert(hr, "belum ada <hr>");\nvar h1 = sel("h1");\nvar p1 = all("p")[0];\nassert(h1.compareDocumentPosition(hr) & Node.DOCUMENT_POSITION_FOLLOWING, "hr harus setelah h1");\nassert(hr.compareDocumentPosition(p1) & Node.DOCUMENT_POSITION_FOLLOWING, "hr harus sebelum paragraf pertama");',
          },
        ],
        hints: [
          { en: 'The head needs the charset and the title; everything else goes in the body.', id: 'Head butuh charset dan judul; sisanya masuk ke body.' },
          { en: '`<hr>` has no closing tag.', id: '`<hr>` tidak punya tag penutup.' },
          { en: 'Order in the body: h1, then hr, then the two paragraphs.', id: 'Urutan di body: h1, lalu hr, lalu dua paragraf.' },
        ],
        solution:
          '<!doctype html>\n<html lang="id">\n  <head>\n    <meta charset="utf-8">\n    <title>Perkenalan</title>\n  </head>\n  <body>\n    <h1>Nunada</h1>\n    <hr>\n    <p>Saya sedang belajar membuat halaman web.</p>\n    <p>Halaman ini adalah latihan pertama saya.</p>\n  </body>\n</html>',
        xp: 50,
      },
    },

    /* ------------------------------------------------------------ 1.2 text */
    {
      id: 'html-m1-s2',
      title: { en: 'Text That Means Something', id: 'Teks yang Bermakna' },
      summary: {
        en: 'Headings in order, emphasis that carries meaning, and quotations.',
        id: 'Judul yang berjenjang, penekanan yang bermakna, dan kutipan.',
      },
      lessons: [
        {
          id: 'html-m1-s2-l1',
          title: { en: 'Headings are an outline', id: 'Judul adalah kerangka' },
          goal: { en: 'Structure a page with heading levels.', id: 'Menyusun halaman dengan jenjang judul.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Six levels, one job', id: 'Enam jenjang, satu tugas' },
              body: {
                en: '`<h1>` down to `<h6>` are the table of contents of your page. `<h2>` is a section of the `<h1>`, `<h3>` a section of that. Screen readers navigate by these, so the order is a promise, not decoration.',
                id: '`<h1>` sampai `<h6>` adalah daftar isi halamanmu. `<h2>` adalah bagian dari `<h1>`, `<h3>` bagian darinya lagi. Pembaca layar menyusuri halaman lewat ini, jadi urutannya adalah janji, bukan hiasan.',
              },
              code: '<h1>Kursus Python</h1>\n<h2>Modul 1</h2>\n<h3>Pelajaran 1</h3>\n<h2>Modul 2</h2>',
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Do not skip a level to get smaller text', id: 'Jangan lompati jenjang demi teks lebih kecil' },
              body: {
                en: 'Jumping from `<h1>` straight to `<h4>` because it looked better is the classic mistake. Size is a job for CSS; the heading level is about structure. One `<h1>` per page is the usual rule.',
                id: 'Melompat dari `<h1>` langsung ke `<h4>` karena tampak lebih bagus adalah kesalahan klasik. Ukuran itu urusan CSS; jenjang judul itu urusan struktur. Satu `<h1>` per halaman adalah aturan lazimnya.',
              },
              code: {
                en: '<!-- wrong: skips h2 and h3 -->\n<h1>Judul</h1>\n<h4>Bagian</h4>\n\n<!-- correct -->\n<h1>Judul</h1>\n<h2>Bagian</h2>',
                id: '<!-- salah: melompati h2 dan h3 -->\n<h1>Judul</h1>\n<h4>Bagian</h4>\n\n<!-- benar -->\n<h1>Judul</h1>\n<h2>Bagian</h2>',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What follows an `<h2>` when you open a subsection of it?',
                id: 'Apa yang menyusul sebuah `<h2>` ketika kamu membuka subbagiannya?',
              },
              options: [
                { en: '<h3>', id: '<h3>' },
                { en: '<h1>', id: '<h1>' },
                { en: '<h4>', id: '<h4>' },
                { en: 'Another <h2>', id: '<h2> lagi' },
              ],
              answer: 0,
              explain: {
                en: 'Levels step down one at a time. Another h2 would start a sibling section, not a subsection.',
                id: 'Jenjangnya turun satu per satu. h2 lagi akan memulai bagian sejajar, bukan subbagian.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              prompt: {
                en: 'Build an outline: one `h1` `Resep`, then an `h2` `Bahan`, then an `h2` `Cara Memasak` with an `h3` `Persiapan` under it.',
                id: 'Bangun kerangka: satu `h1` `Resep`, lalu `h2` `Bahan`, lalu `h2` `Cara Memasak` dengan `h3` `Persiapan` di bawahnya.',
              },
              starter: '',
              tests: [
                {
                  name: { en: 'One h1 named Resep', id: 'Satu h1 bernama Resep' },
                  check: 'assert(all("h1").length === 1, "harus tepat satu h1");\nassert(text("h1") === "Resep", "h1 harus: Resep");',
                },
                {
                  name: { en: 'Two h2 in the right order', id: 'Dua h2 dengan urutan benar' },
                  check:
                    'var h2 = all("h2");\nassert(h2.length === 2, "harus ada dua h2, ada: " + h2.length);\nassert(h2[0].textContent.trim() === "Bahan", "h2 pertama harus: Bahan");\nassert(h2[1].textContent.trim() === "Cara Memasak", "h2 kedua harus: Cara Memasak");',
                },
                {
                  name: { en: 'An h3 after the second h2', id: 'Sebuah h3 setelah h2 kedua' },
                  check:
                    'var h3 = sel("h3");\nassert(h3, "belum ada h3");\nassert(h3.textContent.trim() === "Persiapan", "h3 harus: Persiapan");\nvar h2b = all("h2")[1];\nassert(h2b.compareDocumentPosition(h3) & Node.DOCUMENT_POSITION_FOLLOWING, "h3 harus setelah h2 Cara Memasak");',
                },
              ],
              hints: [
                { en: 'Four elements, in the order the outline reads.', id: 'Empat elemen, sesuai urutan bacaan kerangkanya.' },
                { en: 'The h3 belongs after the second h2, not the first.', id: 'h3-nya diletakkan setelah h2 kedua, bukan yang pertama.' },
              ],
              solution: '<h1>Resep</h1>\n<h2>Bahan</h2>\n<h2>Cara Memasak</h2>\n<h3>Persiapan</h3>',
            },
          ],
        },
        {
          id: 'html-m1-s2-l2',
          title: { en: 'Emphasis and quotations', id: 'Penekanan dan kutipan' },
          goal: { en: 'Mark importance, not appearance.', id: 'Menandai kepentingan, bukan tampilan.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'strong and em say why', id: 'strong dan em menyatakan alasannya' },
              body: {
                en: '`<strong>` means "this matters"; `<em>` means "stress this word". They usually render bold and italic, but the point is the meaning — a screen reader changes its voice for them. `<b>` and `<i>` only change looks and say nothing.',
                id: '`<strong>` berarti "ini penting"; `<em>` berarti "tekankan kata ini". Keduanya biasanya tampil tebal dan miring, tetapi intinya adalah maknanya — pembaca layar mengubah nadanya untuk itu. `<b>` dan `<i>` hanya mengubah tampilan dan tidak bermakna apa pun.',
              },
              code: '<p><strong>Perhatian:</strong> tugas dikumpulkan <em>hari ini</em>.</p>',
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Quotations and code', id: 'Kutipan dan kode' },
              body: {
                en: '`<blockquote>` is a quoted passage, `<code>` is a piece of code inside a sentence. Both let the browser and other tools understand what they are looking at.',
                id: '`<blockquote>` adalah kutipan panjang, `<code>` adalah potongan kode di dalam kalimat. Keduanya membuat peramban dan alat lain paham apa yang sedang mereka lihat.',
              },
              code: '<blockquote>Kode yang baik menjelaskan dirinya sendiri.</blockquote>\n<p>Gunakan <code>print()</code> untuk menampilkan teks.</p>',
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Comments and special characters', id: 'Komentar dan karakter khusus' },
              body: {
                en: 'Anything between `<!--` and `-->` is a note for people reading the source; the browser ignores it. And because `<` starts a tag, writing a literal one needs `&lt;` — the same trick gives `&gt;` and `&amp;`.',
                id: 'Apa pun di antara `<!--` dan `-->` adalah catatan untuk yang membaca sumbernya; peramban mengabaikannya. Dan karena `<` memulai sebuah tag, menulis tanda itu secara harfiah butuh `&lt;` — cara yang sama memberi `&gt;` dan `&amp;`.',
              },
              code: {
                en: '<!-- this does not show -->\n<p>Tulis &lt;p&gt; untuk membuat paragraf.</p>',
                id: '<!-- ini tidak tampil -->\n<p>Tulis &lt;p&gt; untuk membuat paragraf.</p>',
              },
              preview: true,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'You want a word read with vocal stress. Which tag?',
                id: 'Kamu ingin sebuah kata dibaca dengan penekanan suara. Tag mana?',
              },
              options: [
                { en: '<em>', id: '<em>' },
                { en: '<i>', id: '<i>' },
                { en: '<big>', id: '<big>' },
                { en: '<mark>', id: '<mark>' },
              ],
              answer: 0,
              explain: {
                en: 'em carries the meaning "stressed". i only slants the letters.',
                id: 'em membawa makna "ditekankan". i hanya memiringkan hurufnya.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Write the text `<h1>` so it appears literally on the page.',
                id: 'Tulis teks `<h1>` agar tampil apa adanya di halaman.',
              },
              template: '<p>Gunakan ___h1&gt; untuk judul.</p>',
              blanks: ['&lt;'],
              explain: {
                en: '&lt; is the escape for a literal less-than sign, so the browser does not read it as a tag.',
                id: '&lt; adalah bentuk lolos untuk tanda kurang-dari harfiah, agar peramban tidak membacanya sebagai tag.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              prompt: {
                en: 'Write one paragraph that contains the word `wajib` marked as important, and the word `besok` marked as stressed.',
                id: 'Tulis satu paragraf yang memuat kata `wajib` ditandai penting, dan kata `besok` ditandai bertekanan.',
              },
              starter: '<p></p>\n',
              tests: [
                {
                  name: { en: 'A single paragraph', id: 'Satu paragraf saja' },
                  check: 'assert(all("p").length === 1, "harus tepat satu paragraf");',
                },
                {
                  name: { en: '`wajib` is marked important', id: '`wajib` ditandai penting' },
                  check: 'assert(sel("p strong"), "belum ada <strong> di dalam paragraf");\nassert(text("p strong") === "wajib", "isi <strong> harus: wajib");',
                },
                {
                  name: { en: '`besok` is marked stressed', id: '`besok` ditandai bertekanan' },
                  check: 'assert(sel("p em"), "belum ada <em> di dalam paragraf");\nassert(text("p em") === "besok", "isi <em> harus: besok");',
                },
              ],
              hints: [
                { en: 'Both elements go inside the paragraph, wrapping just one word each.', id: 'Kedua elemen ada di dalam paragraf, masing-masing membungkus satu kata saja.' },
                {
                  en: '<p>Tugas ini <strong>wajib</strong> dikumpulkan <em>besok</em>.</p>',
                  id: '<p>Tugas ini <strong>wajib</strong> dikumpulkan <em>besok</em>.</p>',
                },
              ],
              solution: '<p>Tugas ini <strong>wajib</strong> dikumpulkan <em>besok</em>.</p>',
            },
          ],
        },
      ],
      project: {
        id: 'html-m1-s2-p',
        runtime: 'web',
        title: { en: 'Short article', id: 'Artikel pendek' },
        brief: {
          en: 'A readable article with a proper outline and meaningful emphasis.',
          id: 'Artikel terbaca dengan kerangka yang benar dan penekanan yang bermakna.',
        },
        requirements: [
          { en: 'Full document, charset utf-8, title `Artikel`.', id: 'Dokumen lengkap, charset utf-8, judul `Artikel`.' },
          { en: 'One `h1`, then two `h2` sections.', id: 'Satu `h1`, lalu dua bagian `h2`.' },
          { en: 'At least three paragraphs in total.', id: 'Minimal tiga paragraf seluruhnya.' },
          { en: 'At least one `strong` and one `em`, both inside a paragraph.', id: 'Minimal satu `strong` dan satu `em`, keduanya di dalam paragraf.' },
          { en: 'One `blockquote`.', id: 'Satu `blockquote`.' },
          { en: 'One HTML comment anywhere.', id: 'Satu komentar HTML di mana saja.' },
        ],
        starter: '<!doctype html>\n<html lang="id">\n  <head>\n    <meta charset="utf-8">\n    <title>Artikel</title>\n  </head>\n  <body>\n\n  </body>\n</html>\n',
        tests: [
          {
            name: { en: 'Heading outline', id: 'Kerangka judul' },
            check:
              'assert(all("h1").length === 1, "harus tepat satu h1");\nassert(all("h2").length === 2, "harus tepat dua h2, ada: " + all("h2").length);',
          },
          {
            name: { en: 'At least three paragraphs', id: 'Minimal tiga paragraf' },
            check: 'assert(all("p").length >= 3, "minimal tiga paragraf, ada: " + all("p").length);',
          },
          {
            name: { en: 'Meaningful emphasis inside a paragraph', id: 'Penekanan bermakna di dalam paragraf' },
            check:
              'assert(sel("p strong"), "butuh <strong> di dalam sebuah paragraf");\nassert(sel("p em"), "butuh <em> di dalam sebuah paragraf");\nassert(text("p strong").length > 0, "<strong> tidak boleh kosong");\nassert(text("p em").length > 0, "<em> tidak boleh kosong");',
          },
          {
            name: { en: 'A quotation', id: 'Sebuah kutipan' },
            check: 'assert(sel("blockquote"), "belum ada <blockquote>");\nassert(text("blockquote").length > 0, "kutipan tidak boleh kosong");',
          },
          {
            name: { en: 'A comment in the source', id: 'Sebuah komentar di sumbernya' },
            check:
              'function cari(n) { for (var i = 0; i < n.childNodes.length; i++) { var c = n.childNodes[i]; if (c.nodeType === 8) return true; if (cari(c)) return true; } return false; }\nassert(cari(doc.documentElement), "belum ada komentar <!-- ... -->");',
          },
        ],
        hints: [
          { en: 'Build the outline first — h1, h2, h2 — then fill paragraphs under each.', id: 'Bangun kerangkanya dulu — h1, h2, h2 — lalu isi paragraf di bawah masing-masing.' },
          { en: 'strong and em must sit inside a paragraph, not on their own.', id: 'strong dan em harus di dalam paragraf, bukan berdiri sendiri.' },
          { en: 'A comment is `<!-- catatan -->` and can go anywhere in the body.', id: 'Komentar berbentuk `<!-- catatan -->` dan boleh diletakkan di mana saja dalam body.' },
        ],
        solution:
          '<!doctype html>\n<html lang="id">\n  <head>\n    <meta charset="utf-8">\n    <title>Artikel</title>\n  </head>\n  <body>\n    <!-- artikel latihan -->\n    <h1>Belajar HTML</h1>\n\n    <h2>Mengapa HTML</h2>\n    <p>HTML adalah <strong>dasar</strong> dari setiap halaman web.</p>\n    <p>Tanpa struktur yang jelas, halaman sulit dibaca mesin maupun manusia.</p>\n\n    <h2>Cara Memulai</h2>\n    <p>Mulailah dari kerangka dokumen, lalu isi <em>sedikit demi sedikit</em>.</p>\n    <blockquote>Struktur yang benar mengalahkan tampilan yang bagus.</blockquote>\n  </body>\n</html>',
        xp: 50,
      },
    },
  ],
}
