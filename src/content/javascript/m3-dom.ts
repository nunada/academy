import type { Module } from '../types'

/** Module 3 — the page. Every step from here supplies `html`, so the learner
 *  writes script against real markup and watches it change in the preview.
 *
 *  Event checks dispatch the event themselves and then read the result, which
 *  is honest: it proves the handler is attached and does the right thing. */
export const module3: Module = {
  id: 'js-m3',
  title: { en: 'Working with the Page', id: 'Bekerja dengan Halaman' },
  summary: {
    en: 'Find elements, change them, build them, and respond to the reader.',
    id: 'Menemukan elemen, mengubahnya, membangunnya, dan merespons pembaca.',
  },
  submodules: [
    /* ---------------------------------------------------------------- 3.1 DOM */
    {
      id: 'js-m3-s1',
      title: { en: 'Reading and Changing', id: 'Membaca dan Mengubah' },
      summary: {
        en: 'Select an element and rewrite what it shows.',
        id: 'Memilih sebuah elemen dan menulis ulang isinya.',
      },
      lessons: [
        {
          id: 'js-m3-s1-l1',
          title: { en: 'Finding elements', id: 'Menemukan elemen' },
          goal: { en: 'Select something and change its text.', id: 'Memilih sesuatu dan mengubah teksnya.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'querySelector takes a CSS selector', id: 'querySelector menerima selektor CSS' },
              body: {
                en: 'You already know how to aim at elements — the selectors are the ones you learned in CSS. `querySelector` returns the first match, or `null` when there is none.',
                id: 'Kamu sudah tahu cara membidik elemen — selektornya sama dengan yang kamu pelajari di CSS. `querySelector` mengembalikan yang pertama cocok, atau `null` bila tidak ada.',
              },
              code: {
                en: '<h1 id="title">Start</h1>\n<p class="content">Hello</p>\n\n<script>\n  const title = document.querySelector("#title");\n  title.textContent = "Changed";\n</script>',
                id: '<h1 id="judul">Awal</h1>\n<p class="isi">Halo</p>\n\n<script>\n  const judul = document.querySelector("#judul");\n  judul.textContent = "Diubah";\n</script>',
              },
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'textContent, not innerHTML', id: 'textContent, bukan innerHTML' },
              body: {
                en: '`textContent` reads and writes plain text. `innerHTML` parses whatever you give it as markup — so text that came from a person can inject tags into your page. Default to `textContent` and reach for `innerHTML` only knowingly.',
                id: '`textContent` membaca dan menulis teks biasa. `innerHTML` mengurai apa pun yang kamu beri sebagai markup — sehingga teks yang berasal dari orang lain bisa menyuntikkan tag ke halamanmu. Jadikan `textContent` sebagai bawaan, dan pakai `innerHTML` hanya dengan sadar.',
              },
              code: {
                en: '<p id="a"></p>\n<p id="b"></p>\n\n<script>\n  const unsafe = "<em>slanted</em>";\n  document.querySelector("#a").textContent = unsafe;\n  document.querySelector("#b").innerHTML = unsafe;\n</script>',
                id: '<p id="a"></p>\n<p id="b"></p>\n\n<script>\n  const jahat = "<em>miring</em>";\n  document.querySelector("#a").textContent = jahat;\n  document.querySelector("#b").innerHTML = jahat;\n</script>',
              },
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'classList changes the styling', id: 'classList mengubah gayanya' },
              body: {
                en: 'Rather than setting colours from JavaScript, add and remove classes and let CSS decide how each one looks. That keeps the two languages doing what each is good at.',
                id: 'Alih-alih menyetel warna dari JavaScript, tambah dan hapus class lalu biarkan CSS yang menentukan tampilannya. Dengan begitu kedua bahasa tetap mengerjakan bagiannya masing-masing.',
              },
              code: {
                en: '<style>\n  .done { color: green; text-decoration: line-through; }\n</style>\n<p id="task">Do the task</p>\n\n<script>\n  document.querySelector("#task").classList.add("done");\n</script>',
                id: '<style>\n  .selesai { color: green; text-decoration: line-through; }\n</style>\n<p id="tugas">Kerjakan tugas</p>\n\n<script>\n  document.querySelector("#tugas").classList.add("selesai");\n</script>',
              },
              preview: true,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A user types `<img src=x onerror=alert(1)>` into a comment. Which is safe?',
                id: 'Seorang pengguna mengetik `<img src=x onerror=alert(1)>` di sebuah komentar. Mana yang aman?',
              },
              options: [
                { en: 'textContent — it shows the text as typed', id: 'textContent — ia menampilkan teksnya apa adanya' },
                { en: 'innerHTML — it renders it properly', id: 'innerHTML — ia merendernya dengan benar' },
                { en: 'Both are equally safe', id: 'Keduanya sama amannya' },
                { en: 'Neither can be made safe', id: 'Keduanya tak bisa diamankan' },
              ],
              answer: 0,
              explain: {
                en: 'innerHTML would parse and run it. textContent puts the characters on the page and nothing else.',
                id: 'innerHTML akan mengurai dan menjalankannya. textContent menaruh karakternya di halaman dan tidak lebih.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              js: true,
              html: {
                en: '<h1 id="title">Old title</h1>\n<p class="message">Old message</p>\n<p class="message">Another message</p>',
                id: '<h1 id="judul">Judul lama</h1>\n<p class="pesan">Pesan lama</p>\n<p class="pesan">Pesan lain</p>',
              },
              prompt: {
                en: 'Set the `#title` text to `Welcome`, and set the **first** `.message` to `Hello!` — leave the second alone.',
                id: 'Setel teks `#judul` menjadi `Selamat datang`, dan setel `.pesan` **pertama** menjadi `Halo!` — biarkan yang kedua.',
              },
              starter: '',
              tests: {
                en: [
                  {
                    name: { en: 'The heading changed', id: 'The heading changed' },
                    check: 'assert(text("#title") === "Welcome", "#title content: " + JSON.stringify(text("#title")));',
                  },
                  {
                    name: { en: 'Only the first message changed', id: 'Only the first message changed' },
                    check:
                      'var p = all(".message");\nassert(p[0].textContent.trim() === "Hello!", "the first message: " + JSON.stringify(p[0].textContent.trim()));\nassert(p[1].textContent.trim() === "Another message", "the second message must not change, currently: " + JSON.stringify(p[1].textContent.trim()));',
                  },
                  {
                    name: { en: 'No error was thrown', id: 'No error was thrown' },
                    check: 'assert(error() === null, "there is an error: " + error());',
                  },
                ],
                id: [
                  {
                    name: { en: 'The heading changed', id: 'Judulnya berubah' },
                    check: 'assert(text("#judul") === "Selamat datang", "isi #judul: " + JSON.stringify(text("#judul")));',
                  },
                  {
                    name: { en: 'Only the first message changed', id: 'Hanya pesan pertama yang berubah' },
                    check:
                      'var p = all(".pesan");\nassert(p[0].textContent.trim() === "Halo!", "pesan pertama: " + JSON.stringify(p[0].textContent.trim()));\nassert(p[1].textContent.trim() === "Pesan lain", "pesan kedua tidak boleh ikut berubah, sekarang: " + JSON.stringify(p[1].textContent.trim()));',
                  },
                  {
                    name: { en: 'No error was thrown', id: 'Tidak ada error' },
                    check: 'assert(error() === null, "ada error: " + error());',
                  },
                ],
              },
              hints: [
                { en: 'querySelector already returns only the first match.', id: 'querySelector memang hanya mengembalikan yang pertama cocok.' },
                { en: 'An id selector starts with #, a class selector with a dot.', id: 'Selektor id diawali #, selektor class diawali titik.' },
                { en: 'document.querySelector(".message").textContent = "Hello!";', id: 'document.querySelector(".pesan").textContent = "Halo!";' },
              ],
              solution: {
                en: 'document.querySelector("#title").textContent = "Welcome";\ndocument.querySelector(".message").textContent = "Hello!";',
                id: 'document.querySelector("#judul").textContent = "Selamat datang";\ndocument.querySelector(".pesan").textContent = "Halo!";',
              },
            },
          ],
        },
        {
          id: 'js-m3-s1-l2',
          title: { en: 'Building elements', id: 'Membangun elemen' },
          goal: { en: 'Create nodes and put them on the page.', id: 'Membuat simpul dan menaruhnya di halaman.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'create, fill, append', id: 'buat, isi, tempelkan' },
              body: {
                en: 'Three steps every time: `createElement` makes the node, you set what it holds, then `append` puts it somewhere. Until it is appended it exists but is nowhere.',
                id: 'Tiga langkah setiap kali: `createElement` membuat simpulnya, kamu mengisi isinya, lalu `append` menaruhnya di suatu tempat. Sebelum ditempelkan, ia ada tetapi tak berada di mana pun.',
              },
              code: {
                en: '<ul id="list"></ul>\n\n<script>\n  const li = document.createElement("li");\n  li.textContent = "First item";\n  document.querySelector("#list").append(li);\n</script>',
                id: '<ul id="daftar"></ul>\n\n<script>\n  const li = document.createElement("li");\n  li.textContent = "Item pertama";\n  document.querySelector("#daftar").append(li);\n</script>',
              },
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A list from an array', id: 'Sebuah daftar dari array' },
              body: {
                en: 'This is the pattern behind almost every list you see on the web: loop the data, build one node per item, append it. Change the array and the page follows.',
                id: 'Inilah pola di balik hampir setiap daftar yang kamu lihat di web: ulangi datanya, bangun satu simpul per item, tempelkan. Ubah array-nya dan halamannya mengikuti.',
              },
              code: {
                en: '<ul id="list"></ul>\n\n<script>\n  const tasks = ["Study", "Practice", "Rest"];\n  const list = document.querySelector("#list");\n\n  for (const t of tasks) {\n    const li = document.createElement("li");\n    li.textContent = t;\n    list.append(li);\n  }\n</script>',
                id: '<ul id="daftar"></ul>\n\n<script>\n  const tugas = ["Belajar", "Latihan", "Istirahat"];\n  const daftar = document.querySelector("#daftar");\n\n  for (const t of tugas) {\n    const li = document.createElement("li");\n    li.textContent = t;\n    daftar.append(li);\n  }\n</script>',
              },
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Emptying before refilling', id: 'Mengosongkan sebelum mengisi ulang' },
              body: {
                en: 'Redraw a list without clearing it first and the items pile up. `container.textContent = ""` empties it in one line — the simplest fix for the most common re-render bug.',
                id: 'Menggambar ulang daftar tanpa mengosongkannya lebih dulu membuat itemnya menumpuk. `container.textContent = ""` mengosongkannya dalam satu baris — perbaikan paling sederhana untuk bug render-ulang yang paling umum.',
              },
              code: {
                en: 'const list = document.querySelector("#list");\nlist.textContent = "";',
                id: 'const daftar = document.querySelector("#daftar");\ndaftar.textContent = "";',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'You createElement a node but never append it. What appears?',
                id: 'Kamu membuat simpul dengan createElement tetapi tak pernah menempelkannya. Apa yang muncul?',
              },
              options: [
                { en: 'Nothing — it exists in memory but is not in the document', id: 'Tidak ada — ia ada di memori tetapi tidak di dokumen' },
                { en: 'It appears at the end of the body', id: 'Ia muncul di akhir body' },
                { en: 'An error is thrown', id: 'Error dimunculkan' },
                { en: 'It appears where the script is', id: 'Ia muncul di tempat skripnya' },
              ],
              answer: 0,
              explain: {
                en: 'Creating and placing are two separate steps. Forgetting the second is a very quiet bug.',
                id: 'Membuat dan menempatkan adalah dua langkah terpisah. Melupakan yang kedua adalah bug yang sangat senyap.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              js: true,
              html: '<ul id="list"></ul>',
              prompt: {
                en: 'Given `const cities = ["Surabaya", "Malang", "Kediri"]`, build one `li` per city inside `#list`, in order.',
                id: 'Diberikan `const kota = ["Surabaya", "Malang", "Kediri"]`, bangun satu `li` per kota di dalam `#daftar`, sesuai urutan.',
              },
              starter: { en: 'const cities = ["Surabaya", "Malang", "Kediri"];\n', id: 'const kota = ["Surabaya", "Malang", "Kediri"];\n' },
              tests: {
                en: [
                  {
                    name: { en: 'Three items appear', id: 'Three items appear' },
                    check: 'assert(all("#list li").length === 3, "there must be three <li>, currently: " + all("#list li").length);',
                  },
                  {
                    name: { en: 'In the right order', id: 'In the right order' },
                    check:
                      'var content = all("#list li").map(function (e) { return e.textContent.trim(); });\nassert(content.join(",") === "Surabaya,Malang,Kediri", "the content: " + content.join(","));',
                  },
                  {
                    name: { en: 'Built from the array, not typed out', id: 'Built from the array, not typed out' },
                    check:
                      'cities.push("Blitar");\nassert(cities.length === 4, "the cities array must still be mutable");\nassert(all("#list li").length === 3, "the page need not change — this check only confirms the array is real");',
                  },
                ],
                id: [
                  {
                    name: { en: 'Three items appear', id: 'Tiga item muncul' },
                    check: 'assert(all("#daftar li").length === 3, "harus tiga <li>, sekarang: " + all("#daftar li").length);',
                  },
                  {
                    name: { en: 'In the right order', id: 'Dengan urutan yang benar' },
                    check:
                      'var isi = all("#daftar li").map(function (e) { return e.textContent.trim(); });\nassert(isi.join(",") === "Surabaya,Malang,Kediri", "isinya: " + isi.join(","));',
                  },
                  {
                    name: { en: 'Built from the array, not typed out', id: 'Dibangun dari array, bukan diketik satu-satu' },
                    check:
                      'kota.push("Blitar");\nassert(kota.length === 4, "array kota harus tetap bisa diubah");\nassert(all("#daftar li").length === 3, "halaman tidak perlu ikut berubah — pemeriksaan ini hanya memastikan array-nya nyata");',
                  },
                ],
              },
              hints: [
                { en: 'Loop the array, and do the three steps inside the loop.', id: 'Ulangi array-nya, dan lakukan tiga langkahnya di dalam loop.' },
                { en: 'Select the list once, before the loop.', id: 'Pilih daftarnya sekali saja, sebelum loop.' },
                { en: 'createElement, then textContent, then append.', id: 'createElement, lalu textContent, lalu append.' },
              ],
              solution: {
                en: 'const cities = ["Surabaya", "Malang", "Kediri"];\nconst list = document.querySelector("#list");\n\nfor (const c of cities) {\n  const li = document.createElement("li");\n  li.textContent = c;\n  list.append(li);\n}',
                id: 'const kota = ["Surabaya", "Malang", "Kediri"];\nconst daftar = document.querySelector("#daftar");\n\nfor (const k of kota) {\n  const li = document.createElement("li");\n  li.textContent = k;\n  daftar.append(li);\n}',
              },
            },
          ],
        },
      ],
      project: {
        id: 'js-m3-s1-p',
        runtime: 'web',
        js: true,
        html: {
          en: '<h1>Courses</h1>\n<p id="summary"></p>\n<ul id="list"></ul>',
          id: '<h1>Kursus</h1>\n<p id="ringkasan"></p>\n<ul id="daftar"></ul>',
        },
        title: { en: 'Course list', id: 'Daftar kursus' },
        brief: {
          en: 'Render a list of courses onto the page, with a summary line above it.',
          id: 'Tampilkan daftar kursus ke halaman, dengan satu baris ringkasan di atasnya.',
        },
        requirements: [
          { en: 'Start from the given `courses` array of `{ name, modules, ready }` records.', id: 'Mulai dari array `kursus` yang diberikan, berisi catatan `{ nama, modul, siap }`.' },
          { en: 'For each course append an `li` reading `Python — 9 modules`.', id: 'Untuk tiap kursus tambahkan `li` bertuliskan `Python — 9 modul`.' },
          { en: 'A course with `ready: false` gets the class `pending` on its `li`.', id: 'Kursus dengan `siap: false` mendapat class `belum` pada `li`-nya.' },
          { en: '`#summary` reads `3 courses, 2 ready` — counted, not typed.', id: '`#ringkasan` bertuliskan `3 kursus, 2 siap` — dihitung, bukan diketik.' },
        ],
        starter: {
          en: 'const courses = [\n  { name: "Python", modules: 9, ready: true },\n  { name: "HTML", modules: 4, ready: true },\n  { name: "React", modules: 0, ready: false },\n];\n',
          id: 'const kursus = [\n  { nama: "Python", modul: 9, siap: true },\n  { nama: "HTML", modul: 4, siap: true },\n  { nama: "React", modul: 0, siap: false },\n];\n',
        },
        tests: {
          en: [
            {
              name: { en: 'One item per course', id: 'One item per course' },
              check:
                'var li = all("#list li");\nassert(li.length === courses.length, "there must be " + courses.length + " items, currently: " + li.length);',
            },
            {
              name: { en: 'Each line names its course', id: 'Each line names its course' },
              check:
                'var li = all("#list li");\ncourses.forEach(function (k, i) {\n  var want = k.name + " — " + k.modules + " modules";\n  assert(li[i].textContent.trim() === want, "item " + (i + 1) + " must be " + JSON.stringify(want) + ", currently: " + JSON.stringify(li[i].textContent.trim()));\n});',
            },
            {
              name: { en: 'Only the unready one is marked', id: 'Only the unready one is marked' },
              check:
                'var li = all("#list li");\ncourses.forEach(function (k, i) {\n  var has = li[i].classList.contains("pending");\n  assert(has === !k.ready, k.name + (k.ready ? " must not" : " must") + " have the class pending");\n});',
            },
            {
              name: { en: 'The summary is counted', id: 'The summary is counted' },
              check:
                'var ready = courses.filter(function (k) { return k.ready; }).length;\nvar want = courses.length + " courses, " + ready + " ready";\nassert(text("#summary") === want, "#summary must be " + JSON.stringify(want) + ", currently: " + JSON.stringify(text("#summary")));',
            },
            {
              name: { en: 'Nothing broke', id: 'Nothing broke' },
              check: 'assert(error() === null, "there is an error: " + error());',
            },
          ],
          id: [
            {
              name: { en: 'One item per course', id: 'Satu item per kursus' },
              check:
                'var li = all("#daftar li");\nassert(li.length === kursus.length, "harus " + kursus.length + " item, sekarang: " + li.length);',
            },
            {
              name: { en: 'Each line names its course', id: 'Tiap baris menyebut kursusnya' },
              check:
                'var li = all("#daftar li");\nkursus.forEach(function (k, i) {\n  var mau = k.nama + " — " + k.modul + " modul";\n  assert(li[i].textContent.trim() === mau, "item ke-" + (i + 1) + " harus " + JSON.stringify(mau) + ", sekarang: " + JSON.stringify(li[i].textContent.trim()));\n});',
            },
            {
              name: { en: 'Only the unready one is marked', id: 'Hanya yang belum siap yang ditandai' },
              check:
                'var li = all("#daftar li");\nkursus.forEach(function (k, i) {\n  var ada = li[i].classList.contains("belum");\n  assert(ada === !k.siap, k.nama + (k.siap ? " tidak boleh" : " harus") + " punya class belum");\n});',
            },
            {
              name: { en: 'The summary is counted', id: 'Ringkasannya dihitung' },
              check:
                'var siap = kursus.filter(function (k) { return k.siap; }).length;\nvar mau = kursus.length + " kursus, " + siap + " siap";\nassert(text("#ringkasan") === mau, "#ringkasan harus " + JSON.stringify(mau) + ", sekarang: " + JSON.stringify(text("#ringkasan")));',
            },
            {
              name: { en: 'Nothing broke', id: 'Tidak ada yang rusak' },
              check: 'assert(error() === null, "ada error: " + error());',
            },
          ],
        },
        hints: [
          { en: 'One loop builds the list; the summary is a separate line after it.', id: 'Satu loop membangun daftarnya; ringkasannya baris terpisah setelahnya.' },
          { en: 'The dash in the requirement is an em dash — copy it exactly.', id: 'Tanda pisah pada syaratnya adalah em dash — salin persis.' },
          { en: '`classList.add` only when `ready` is false.', id: '`classList.add` hanya bila `siap` bernilai false.' },
          { en: 'filter then length gives the ready count without a second loop.', id: 'filter lalu length memberi jumlah yang siap tanpa loop kedua.' },
        ],
        solution: {
          en: 'const courses = [\n  { name: "Python", modules: 9, ready: true },\n  { name: "HTML", modules: 4, ready: true },\n  { name: "React", modules: 0, ready: false },\n];\n\nconst list = document.querySelector("#list");\n\nfor (const k of courses) {\n  const li = document.createElement("li");\n  li.textContent = `${k.name} — ${k.modules} modules`;\n  if (!k.ready) {\n    li.classList.add("pending");\n  }\n  list.append(li);\n}\n\nconst ready = courses.filter((k) => k.ready).length;\ndocument.querySelector("#summary").textContent = `${courses.length} courses, ${ready} ready`;',
          id: 'const kursus = [\n  { nama: "Python", modul: 9, siap: true },\n  { nama: "HTML", modul: 4, siap: true },\n  { nama: "React", modul: 0, siap: false },\n];\n\nconst daftar = document.querySelector("#daftar");\n\nfor (const k of kursus) {\n  const li = document.createElement("li");\n  li.textContent = `${k.nama} — ${k.modul} modul`;\n  if (!k.siap) {\n    li.classList.add("belum");\n  }\n  daftar.append(li);\n}\n\nconst siap = kursus.filter((k) => k.siap).length;\ndocument.querySelector("#ringkasan").textContent = `${kursus.length} kursus, ${siap} siap`;',
        },
        xp: 50,
      },
    },

    /* ------------------------------------------------------------- 3.2 events */
    {
      id: 'js-m3-s2',
      title: { en: 'Events', id: 'Kejadian' },
      summary: {
        en: 'Run code when the reader does something.',
        id: 'Menjalankan kode saat pembaca melakukan sesuatu.',
      },
      lessons: [
        {
          id: 'js-m3-s2-l1',
          title: { en: 'Listening for a click', id: 'Mendengarkan klik' },
          goal: { en: 'Attach a handler and change the page.', id: 'Memasang penangan dan mengubah halaman.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'addEventListener takes a function', id: 'addEventListener menerima sebuah fungsi' },
              body: {
                en: 'You hand over the function itself, not a call to it. Write `button.addEventListener("click", run)` — with brackets after `run` it would run immediately and register the result instead.',
                id: 'Kamu menyerahkan fungsinya sendiri, bukan hasil pemanggilannya. Tulis `tombol.addEventListener("click", jalankan)` — dengan kurung setelah `jalankan`, ia justru langsung berjalan dan yang terdaftar adalah hasilnya.',
              },
              code: {
                en: '<button id="button">Click me</button>\n<p id="result">not clicked yet</p>\n\n<script>\n  const result = document.querySelector("#result");\n\n  document.querySelector("#button").addEventListener("click", () => {\n    result.textContent = "clicked";\n  });\n</script>',
                id: '<button id="tombol">Klik saya</button>\n<p id="hasil">belum diklik</p>\n\n<script>\n  const hasil = document.querySelector("#hasil");\n\n  document.querySelector("#tombol").addEventListener("click", () => {\n    hasil.textContent = "sudah diklik";\n  });\n</script>',
              },
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'State lives outside the handler', id: 'State hidup di luar penangannya' },
              body: {
                en: 'A counter declared inside the handler resets on every click. Declare it outside, where it survives between calls — the handler then reads and updates the same variable each time.',
                id: 'Pencacah yang dideklarasikan di dalam penangannya akan direset setiap klik. Deklarasikan di luar, tempat ia bertahan antar-pemanggilan — penangannya lalu membaca dan memperbarui variabel yang sama setiap kali.',
              },
              code: {
                en: '<button id="add">+1</button>\n<p id="number">0</p>\n\n<script>\n  let count = 0;\n  const number = document.querySelector("#number");\n\n  document.querySelector("#add").addEventListener("click", () => {\n    count += 1;\n    number.textContent = count;\n  });\n</script>',
                id: '<button id="tambah">+1</button>\n<p id="angka">0</p>\n\n<script>\n  let hitung = 0;\n  const angka = document.querySelector("#angka");\n\n  document.querySelector("#tambah").addEventListener("click", () => {\n    hitung += 1;\n    angka.textContent = hitung;\n  });\n</script>',
              },
              preview: true,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is wrong with `button.addEventListener("click", run())`?',
                id: 'Apa yang salah pada `tombol.addEventListener("click", jalankan())`?',
              },
              options: [
                { en: 'It calls run now and registers its return value', id: 'Ia memanggil jalankan sekarang dan mendaftarkan nilai kembaliannya' },
                { en: 'The event name should be "onclick"', id: 'Nama kejadiannya seharusnya "onclick"' },
                { en: 'Nothing is wrong', id: 'Tidak ada yang salah' },
                { en: 'Arrow functions are required', id: 'Arrow function itu wajib' },
              ],
              answer: 0,
              explain: {
                en: 'Drop the brackets. You are handing over the function, not its result.',
                id: 'Hilangkan kurungnya. Kamu menyerahkan fungsinya, bukan hasilnya.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              js: true,
              html: {
                en: '<button id="increment">Increment</button>\n<button id="reset">Reset</button>\n<p id="value">0</p>',
                id: '<button id="naik">Naik</button>\n<button id="atur">Reset</button>\n<p id="nilai">0</p>',
              },
              prompt: {
                en: 'Make `#increment` add one to the number shown in `#value`, and `#reset` set it back to 0.',
                id: 'Buat `#naik` menambah satu pada angka di `#nilai`, dan `#atur` mengembalikannya ke 0.',
              },
              starter: { en: 'let count = 0;\n', id: 'let hitung = 0;\n' },
              tests: {
                en: [
                  {
                    name: { en: 'It starts at zero', id: 'It starts at zero' },
                    check: 'assert(text("#value") === "0", "must start at 0, currently: " + JSON.stringify(text("#value")));',
                  },
                  {
                    name: { en: 'Three clicks give three', id: 'Three clicks give three' },
                    check:
                      'var b = sel("#increment");\nb.click(); b.click(); b.click();\nassert(text("#value") === "3", "after three clicks it must be 3, currently: " + JSON.stringify(text("#value")));',
                  },
                  {
                    name: { en: 'Reset returns to zero, and counting resumes', id: 'Reset returns to zero, and counting resumes' },
                    check:
                      'sel("#increment").click();\nsel("#reset").click();\nassert(text("#value") === "0", "after reset it must be 0, currently: " + JSON.stringify(text("#value")));\nsel("#increment").click();\nassert(text("#value") === "1", "after reset, the next click must be 1 — not continuing the old number");',
                  },
                ],
                id: [
                  {
                    name: { en: 'It starts at zero', id: 'Ia mulai dari nol' },
                    check: 'assert(text("#nilai") === "0", "awalnya harus 0, sekarang: " + JSON.stringify(text("#nilai")));',
                  },
                  {
                    name: { en: 'Three clicks give three', id: 'Tiga klik memberi tiga' },
                    check:
                      'var b = sel("#naik");\nb.click(); b.click(); b.click();\nassert(text("#nilai") === "3", "setelah tiga klik harus 3, sekarang: " + JSON.stringify(text("#nilai")));',
                  },
                  {
                    name: { en: 'Reset returns to zero, and counting resumes', id: 'Reset kembali ke nol, dan hitungan lanjut' },
                    check:
                      'sel("#naik").click();\nsel("#atur").click();\nassert(text("#nilai") === "0", "setelah reset harus 0, sekarang: " + JSON.stringify(text("#nilai")));\nsel("#naik").click();\nassert(text("#nilai") === "1", "setelah reset, klik berikutnya harus 1 — bukan melanjutkan angka lama");',
                  },
                ],
              },
              hints: [
                { en: 'The counter is declared outside both handlers.', id: 'Pencacahnya dideklarasikan di luar kedua penangan.' },
                { en: 'Reset must set the variable too, not only the text.', id: 'Reset harus menyetel variabelnya juga, bukan hanya teksnya.' },
                { en: 'Otherwise the next click continues from the old number.', id: 'Kalau tidak, klik berikutnya melanjutkan dari angka lama.' },
              ],
              solution: {
                en: 'let count = 0;\nconst value = document.querySelector("#value");\n\ndocument.querySelector("#increment").addEventListener("click", () => {\n  count += 1;\n  value.textContent = count;\n});\n\ndocument.querySelector("#reset").addEventListener("click", () => {\n  count = 0;\n  value.textContent = count;\n});',
                id: 'let hitung = 0;\nconst nilai = document.querySelector("#nilai");\n\ndocument.querySelector("#naik").addEventListener("click", () => {\n  hitung += 1;\n  nilai.textContent = hitung;\n});\n\ndocument.querySelector("#atur").addEventListener("click", () => {\n  hitung = 0;\n  nilai.textContent = hitung;\n});',
              },
            },
          ],
        },
        {
          id: 'js-m3-s2-l2',
          title: { en: 'Forms and input', id: 'Formulir dan masukan' },
          goal: { en: 'Read what the reader typed.', id: 'Membaca apa yang diketik pembaca.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'value, not textContent', id: 'value, bukan textContent' },
              body: {
                en: 'An input holds what was typed in `value`. `textContent` is empty for an input — reaching for it is a common first mistake.',
                id: 'Sebuah input menyimpan yang diketik pada `value`. `textContent` kosong untuk input — memakainya adalah kekeliruan pertama yang umum.',
              },
              code: {
                en: '<input id="name" value="Ani">\n<p id="result"></p>\n\n<script>\n  const name = document.querySelector("#name");\n  document.querySelector("#result").textContent = `Hello, ${name.value}`;\n</script>',
                id: '<input id="nama" value="Ani">\n<p id="hasil"></p>\n\n<script>\n  const nama = document.querySelector("#nama");\n  document.querySelector("#hasil").textContent = `Halo, ${nama.value}`;\n</script>',
              },
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A form submit reloads unless you stop it', id: 'Submit formulir memuat ulang kecuali dicegah' },
              body: {
                en: 'Submitting a form navigates the page by default, which throws away everything your script was holding. `event.preventDefault()` stops that, and is the first line of almost every submit handler.',
                id: 'Mengirim formulir secara bawaan akan berpindah halaman, yang membuang semua yang sedang dipegang skripmu. `event.preventDefault()` mencegahnya, dan menjadi baris pertama hampir setiap penangan submit.',
              },
              code: {
                en: '<form id="form">\n  <input id="input" value="Study">\n  <button type="submit">Add</button>\n</form>\n<p id="result"></p>\n\n<script>\n  document.querySelector("#form").addEventListener("submit", (event) => {\n    event.preventDefault();\n    document.querySelector("#result").textContent = document.querySelector("#input").value;\n  });\n</script>',
                id: '<form id="form">\n  <input id="isi" value="Belajar">\n  <button type="submit">Tambah</button>\n</form>\n<p id="hasil"></p>\n\n<script>\n  document.querySelector("#form").addEventListener("submit", (event) => {\n    event.preventDefault();\n    document.querySelector("#hasil").textContent = document.querySelector("#isi").value;\n  });\n</script>',
              },
              preview: true,
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Clear the field afterwards', id: 'Kosongkan isiannya setelahnya' },
              body: {
                en: 'After handling the input, set `value` back to an empty string. Without it the reader has to select and delete before typing the next one — a small thing that makes a form feel broken.',
                id: 'Setelah masukannya ditangani, setel `value` kembali ke string kosong. Tanpa itu pembaca harus memblok dan menghapus sebelum mengetik berikutnya — hal kecil yang membuat formulir terasa rusak.',
              },
              code: { en: 'input.value = "";', id: 'isi.value = "";' },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Your submit handler works, but the page flashes and the list empties. Why?',
                id: 'Penangan submit-mu berfungsi, tetapi halamannya berkedip dan daftarnya kosong. Kenapa?',
              },
              options: [
                { en: 'The form reloaded the page — preventDefault is missing', id: 'Formulirnya memuat ulang halaman — preventDefault belum ada' },
                { en: 'textContent was used instead of value', id: 'textContent dipakai alih-alih value' },
                { en: 'The listener is on the wrong element', id: 'Pendengarnya dipasang di elemen yang salah' },
                { en: 'Arrays cannot survive a click', id: 'Array tidak bisa bertahan melewati klik' },
              ],
              answer: 0,
              explain: {
                en: 'A reload starts the script from scratch, so everything it had in memory is gone.',
                id: 'Muat ulang memulai skripnya dari awal, jadi semua yang ada di memorinya lenyap.',
              },
            },
            {
              kind: 'web',
              id: 'w1',
              js: true,
              html: {
                en: '<form id="form">\n  <input id="input">\n  <button type="submit">Add</button>\n</form>\n<ul id="list"></ul>',
                id: '<form id="form">\n  <input id="isi">\n  <button type="submit">Tambah</button>\n</form>\n<ul id="daftar"></ul>',
              },
              prompt: {
                en: 'On submit, append the typed text as an `li` in `#list`, then clear the input. Ignore an empty or whitespace-only entry.',
                id: 'Saat submit, tambahkan teks yang diketik sebagai `li` di `#daftar`, lalu kosongkan isiannya. Abaikan masukan kosong atau berisi spasi saja.',
              },
              starter: '',
              tests: {
                en: [
                  {
                    name: { en: 'A submitted value becomes an item', id: 'A submitted value becomes an item' },
                    check:
                      'var input = sel("#input");\ninput.value = "Study";\nsel("#form").dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));\nassert(all("#list li").length === 1, "there must be one item, currently: " + all("#list li").length);\nassert(all("#list li")[0].textContent.trim() === "Study", "its content: " + JSON.stringify(all("#list li")[0].textContent.trim()));',
                  },
                  {
                    name: { en: 'The field is cleared', id: 'The field is cleared' },
                    check: 'assert(sel("#input").value === "", "the input must be empty after submitting, currently: " + JSON.stringify(sel("#input").value));',
                  },
                  {
                    name: { en: 'Empty entries are ignored', id: 'Empty entries are ignored' },
                    check:
                      'var before = all("#list li").length;\nvar input = sel("#input");\ninput.value = "";\nsel("#form").dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));\ninput.value = "   ";\nsel("#form").dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));\nassert(all("#list li").length === before, "an empty or whitespace entry must not add an item");',
                  },
                  {
                    name: { en: 'The page is not reloaded', id: 'The page is not reloaded' },
                    check:
                      'var ev = new Event("submit", { cancelable: true, bubbles: true });\nsel("#input").value = "Check";\nsel("#form").dispatchEvent(ev);\nassert(ev.defaultPrevented, "call event.preventDefault() so the page does not navigate");',
                  },
                ],
                id: [
                  {
                    name: { en: 'A submitted value becomes an item', id: 'Nilai yang dikirim menjadi item' },
                    check:
                      'var isi = sel("#isi");\nisi.value = "Belajar";\nsel("#form").dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));\nassert(all("#daftar li").length === 1, "harus ada satu item, sekarang: " + all("#daftar li").length);\nassert(all("#daftar li")[0].textContent.trim() === "Belajar", "isinya: " + JSON.stringify(all("#daftar li")[0].textContent.trim()));',
                  },
                  {
                    name: { en: 'The field is cleared', id: 'Isiannya dikosongkan' },
                    check: 'assert(sel("#isi").value === "", "isian harus kosong setelah dikirim, sekarang: " + JSON.stringify(sel("#isi").value));',
                  },
                  {
                    name: { en: 'Empty entries are ignored', id: 'Masukan kosong diabaikan' },
                    check:
                      'var sebelum = all("#daftar li").length;\nvar isi = sel("#isi");\nisi.value = "";\nsel("#form").dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));\nisi.value = "   ";\nsel("#form").dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));\nassert(all("#daftar li").length === sebelum, "masukan kosong atau spasi tidak boleh menambah item");',
                  },
                  {
                    name: { en: 'The page is not reloaded', id: 'Halamannya tidak dimuat ulang' },
                    check:
                      'var ev = new Event("submit", { cancelable: true, bubbles: true });\nsel("#isi").value = "Cek";\nsel("#form").dispatchEvent(ev);\nassert(ev.defaultPrevented, "panggil event.preventDefault() agar halaman tidak berpindah");',
                  },
                ],
              },
              hints: [
                { en: 'preventDefault first, before anything else.', id: 'preventDefault lebih dulu, sebelum yang lain.' },
                { en: 'trim() the value, then decide whether to continue.', id: 'trim() nilainya, lalu putuskan apakah lanjut.' },
                { en: 'Return early on an empty value — no item, no clearing needed.', id: 'Keluar lebih awal bila nilainya kosong — tak ada item, tak perlu dikosongkan.' },
              ],
              solution: {
                en: 'const form = document.querySelector("#form");\nconst input = document.querySelector("#input");\nconst list = document.querySelector("#list");\n\nform.addEventListener("submit", (event) => {\n  event.preventDefault();\n\n  const text = input.value.trim();\n  if (text === "") {\n    return;\n  }\n\n  const li = document.createElement("li");\n  li.textContent = text;\n  list.append(li);\n\n  input.value = "";\n});',
                id: 'const form = document.querySelector("#form");\nconst isi = document.querySelector("#isi");\nconst daftar = document.querySelector("#daftar");\n\nform.addEventListener("submit", (event) => {\n  event.preventDefault();\n\n  const teks = isi.value.trim();\n  if (teks === "") {\n    return;\n  }\n\n  const li = document.createElement("li");\n  li.textContent = teks;\n  daftar.append(li);\n\n  isi.value = "";\n});',
              },
            },
          ],
        },
      ],
      project: {
        id: 'js-m3-s2-p',
        runtime: 'web',
        js: true,
        html: {
          en: '<h1>Tasks</h1>\n<form id="form">\n  <input id="input" placeholder="New task">\n  <button type="submit">Add</button>\n</form>\n<p id="remaining"></p>\n<ul id="list"></ul>',
          id: '<h1>Tugas</h1>\n<form id="form">\n  <input id="isi" placeholder="Tugas baru">\n  <button type="submit">Tambah</button>\n</form>\n<p id="sisa"></p>\n<ul id="daftar"></ul>',
        },
        title: { en: 'Interactive to-do list', id: 'Daftar tugas interaktif' },
        brief: {
          en: 'Add tasks, tick them off by clicking, and keep a live count.',
          id: 'Tambahkan tugas, tandai selesai dengan mengklik, dan pertahankan hitungan yang hidup.',
        },
        requirements: [
          { en: 'Submitting adds the trimmed text as an `li` and clears the input.', id: 'Submit menambahkan teks yang sudah di-trim sebagai `li` dan mengosongkan isiannya.' },
          { en: 'Empty or whitespace-only entries are ignored.', id: 'Masukan kosong atau berisi spasi saja diabaikan.' },
          { en: 'Clicking an `li` toggles the class `done` on it.', id: 'Mengklik sebuah `li` menyalakan-mematikan class `selesai` padanya.' },
          { en: '`#remaining` always reads `2 of 3 not done`.', id: '`#sisa` selalu bertuliskan `2 dari 3 belum selesai`.' },
          { en: 'It must be right after every add and every toggle.', id: 'Harus tepat setelah tiap penambahan dan tiap penandaan.' },
        ],
        starter: '',
        tests: {
          en: [
            {
              name: { en: 'Adding works and clears the field', id: 'Adding works and clears the field' },
              check:
                'function submit(v) { sel("#input").value = v; sel("#form").dispatchEvent(new Event("submit", { cancelable: true, bubbles: true })); }\nsubmit("One"); submit("Two");\nassert(all("#list li").length === 2, "there must be two items, currently: " + all("#list li").length);\nassert(sel("#input").value === "", "the input must be empty");',
            },
            {
              name: { en: 'Empty entries are ignored', id: 'Empty entries are ignored' },
              check:
                'function submit(v) { sel("#input").value = v; sel("#form").dispatchEvent(new Event("submit", { cancelable: true, bubbles: true })); }\nvar before = all("#list li").length;\nsubmit(""); submit("   ");\nassert(all("#list li").length === before, "empty and whitespace entries must not add an item");',
            },
            {
              name: { en: 'Clicking toggles both ways', id: 'Clicking toggles both ways' },
              check:
                'function submit(v) { sel("#input").value = v; sel("#form").dispatchEvent(new Event("submit", { cancelable: true, bubbles: true })); }\nsubmit("Three");\nvar li = all("#list li")[0];\nli.click();\nassert(li.classList.contains("done"), "the first click must mark it done");\nli.click();\nassert(!li.classList.contains("done"), "the second click must undo it");',
            },
            {
              name: { en: 'The count follows every change', id: 'The count follows every change' },
              check:
                'function submit(v) { sel("#input").value = v; sel("#form").dispatchEvent(new Event("submit", { cancelable: true, bubbles: true })); }\nfunction count() { var li = all("#list li"); var remaining = li.filter(function (e) { return !e.classList.contains("done"); }).length; return remaining + " of " + li.length + " not done"; }\nsubmit("A"); submit("B"); submit("C");\nassert(text("#remaining") === count(), "#remaining must be " + JSON.stringify(count()) + ", currently: " + JSON.stringify(text("#remaining")));\nall("#list li")[0].click();\nassert(text("#remaining") === count(), "after marking done, #remaining must be " + JSON.stringify(count()) + ", currently: " + JSON.stringify(text("#remaining")));',
            },
            {
              name: { en: 'The page never reloads', id: 'The page never reloads' },
              check:
                'var ev = new Event("submit", { cancelable: true, bubbles: true });\nsel("#input").value = "Check";\nsel("#form").dispatchEvent(ev);\nassert(ev.defaultPrevented, "call event.preventDefault()");\nassert(error() === null, "there is an error: " + error());',
            },
          ],
          id: [
            {
              name: { en: 'Adding works and clears the field', id: 'Penambahan berfungsi dan mengosongkan isian' },
              check:
                'function kirim(v) { sel("#isi").value = v; sel("#form").dispatchEvent(new Event("submit", { cancelable: true, bubbles: true })); }\nkirim("Satu"); kirim("Dua");\nassert(all("#daftar li").length === 2, "harus dua item, sekarang: " + all("#daftar li").length);\nassert(sel("#isi").value === "", "isian harus kosong");',
            },
            {
              name: { en: 'Empty entries are ignored', id: 'Masukan kosong diabaikan' },
              check:
                'function kirim(v) { sel("#isi").value = v; sel("#form").dispatchEvent(new Event("submit", { cancelable: true, bubbles: true })); }\nvar sebelum = all("#daftar li").length;\nkirim(""); kirim("   ");\nassert(all("#daftar li").length === sebelum, "kosong dan spasi tidak boleh menambah item");',
            },
            {
              name: { en: 'Clicking toggles both ways', id: 'Klik menyalakan dan mematikan' },
              check:
                'function kirim(v) { sel("#isi").value = v; sel("#form").dispatchEvent(new Event("submit", { cancelable: true, bubbles: true })); }\nkirim("Tiga");\nvar li = all("#daftar li")[0];\nli.click();\nassert(li.classList.contains("selesai"), "klik pertama harus menandai selesai");\nli.click();\nassert(!li.classList.contains("selesai"), "klik kedua harus membatalkannya");',
            },
            {
              name: { en: 'The count follows every change', id: 'Hitungannya mengikuti tiap perubahan' },
              check:
                'function kirim(v) { sel("#isi").value = v; sel("#form").dispatchEvent(new Event("submit", { cancelable: true, bubbles: true })); }\nfunction hitung() { var li = all("#daftar li"); var belum = li.filter(function (e) { return !e.classList.contains("selesai"); }).length; return belum + " dari " + li.length + " belum selesai"; }\nkirim("A"); kirim("B"); kirim("C");\nassert(text("#sisa") === hitung(), "#sisa harus " + JSON.stringify(hitung()) + ", sekarang: " + JSON.stringify(text("#sisa")));\nall("#daftar li")[0].click();\nassert(text("#sisa") === hitung(), "setelah menandai selesai, #sisa harus " + JSON.stringify(hitung()) + ", sekarang: " + JSON.stringify(text("#sisa")));',
            },
            {
              name: { en: 'The page never reloads', id: 'Halamannya tidak pernah dimuat ulang' },
              check:
                'var ev = new Event("submit", { cancelable: true, bubbles: true });\nsel("#isi").value = "Cek";\nsel("#form").dispatchEvent(ev);\nassert(ev.defaultPrevented, "panggil event.preventDefault()");\nassert(error() === null, "ada error: " + error());',
            },
          ],
        },
        hints: [
          { en: 'Write one `update()` that recounts and rewrites #remaining, and call it after every change.', id: 'Tulis satu `perbarui()` yang menghitung ulang dan menulis #sisa, lalu panggil setelah tiap perubahan.' },
          { en: 'Attach the click handler to each li as you create it.', id: 'Pasang penangan klik pada tiap li saat kamu membuatnya.' },
          { en: '`classList.toggle("done")` handles both directions in one call.', id: '`classList.toggle("selesai")` menangani dua arah dalam satu pemanggilan.' },
          { en: 'Count with filter over the current li elements — do not track a separate number.', id: 'Hitung dengan filter atas elemen li yang ada — jangan menyimpan angka terpisah.' },
        ],
        solution: {
          en: 'const form = document.querySelector("#form");\nconst input = document.querySelector("#input");\nconst list = document.querySelector("#list");\nconst remaining = document.querySelector("#remaining");\n\nfunction update() {\n  const items = list.querySelectorAll("li");\n  let left = 0;\n  for (const li of items) {\n    if (!li.classList.contains("done")) {\n      left += 1;\n    }\n  }\n  remaining.textContent = `${left} of ${items.length} not done`;\n}\n\nform.addEventListener("submit", (event) => {\n  event.preventDefault();\n\n  const text = input.value.trim();\n  if (text === "") {\n    return;\n  }\n\n  const li = document.createElement("li");\n  li.textContent = text;\n  li.addEventListener("click", () => {\n    li.classList.toggle("done");\n    update();\n  });\n  list.append(li);\n\n  input.value = "";\n  update();\n});\n\nupdate();',
          id: 'const form = document.querySelector("#form");\nconst isi = document.querySelector("#isi");\nconst daftar = document.querySelector("#daftar");\nconst sisa = document.querySelector("#sisa");\n\nfunction perbarui() {\n  const semua = daftar.querySelectorAll("li");\n  let belum = 0;\n  for (const li of semua) {\n    if (!li.classList.contains("selesai")) {\n      belum += 1;\n    }\n  }\n  sisa.textContent = `${belum} dari ${semua.length} belum selesai`;\n}\n\nform.addEventListener("submit", (event) => {\n  event.preventDefault();\n\n  const teks = isi.value.trim();\n  if (teks === "") {\n    return;\n  }\n\n  const li = document.createElement("li");\n  li.textContent = teks;\n  li.addEventListener("click", () => {\n    li.classList.toggle("selesai");\n    perbarui();\n  });\n  daftar.append(li);\n\n  isi.value = "";\n  perbarui();\n});\n\nperbarui();',
        },
        xp: 50,
      },
    },
  ],
}
