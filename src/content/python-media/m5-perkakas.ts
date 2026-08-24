import type { Module } from '../types'

/** Module 5 — a theory-only map of the wider Python ecosystem this course's two
 *  halves only sampled. Nothing here is graded on producing a picture: this
 *  sandbox has one graphics runtime (the game engine from modules 3–4), and
 *  none of pygame/tkinter/turtle/kivy/arcade/ursina/manim/vpython/streamlit/
 *  seaborn exist as loadable packages for the pinned Pyodide build — checked
 *  against the real package registry, not assumed. numpy, scipy, sympy and
 *  matplotlib do exist, so those four get real, running demonstrations; the
 *  rest are described accurately and left for a real computer. */
export const module5: Module = {
  id: 'pymed-m5',
  title: { en: 'A Wider Toolbox', id: 'Perkakas yang Lebih Luas' },
  summary: {
    en: 'This app is a sandbox with one graphics runtime and a fixed set of packages. Here is a map of the wider Python ecosystem for teaching media — most of it a pip install away on a real computer.',
    id: 'Aplikasi ini sandbox dengan satu runtime grafis dan sejumlah paket yang tetap. Ini peta ekosistem Python yang lebih luas untuk media pembelajaran — sebagian besar tinggal satu pip install di komputer sungguhan.',
  },
  submodules: [
    /* --------------------------------------- 5.1 graphics & games, elsewhere */
    {
      id: 'pymed-m5-s1',
      title: { en: 'Graphics and Games Beyond This Sandbox', id: 'Grafis dan Game di Luar Sandbox Ini' },
      summary: {
        en: 'Six well-known tools for pictures, games and apps — none of them runnable here, all of them one install away on a desktop.',
        id: 'Enam perkakas ternama untuk gambar, game, dan aplikasi — tak satu pun bisa dijalankan di sini, semuanya tinggal satu pemasangan di komputer.',
      },
      lessons: [
        {
          id: 'pymed-m5-s1-l1',
          title: { en: 'Six Tools for Pictures and Games', id: 'Enam Perkakas untuk Gambar dan Game' },
          goal: { en: 'Know what each tool is for, and where it actually runs.', id: 'Tahu kegunaan tiap perkakas, dan di mana ia sungguh berjalan.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'turtle: geometry with a virtual pen', id: 'turtle: geometri dengan pena virtual' },
              body: {
                en: '`turtle` has shipped with Python since the beginning — a pen that moves and turns, leaving a trail. Excellent for teaching angles, polygons, and repeating patterns to younger students. It needs a real window to draw into, so it does not run in this browser sandbox — but it runs instantly on any desktop Python install, with nothing extra to add.',
                id: '`turtle` sudah ada di Python sejak awal — pena yang bergerak dan berbelok, meninggalkan jejak. Sangat cocok mengajarkan sudut, poligon, dan pola berulang ke siswa yang lebih muda. Ia butuh jendela sungguhan untuk digambari, jadi tidak berjalan di sandbox peramban ini — tapi berjalan seketika di komputer mana pun yang sudah terpasang Python, tanpa tambahan apa pun.',
              },
              code: 'import turtle\nt = turtle.Turtle()\nfor _ in range(4):\n    t.forward(100)\n    t.right(90)\nturtle.done()',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'pygame: the foundation for 2D games', id: 'pygame: fondasi game 2D' },
              body: {
                en: 'The most established 2D game library in Python — sprites, collisions, sound, and a game loop you write yourself, line by line. Powerful and flexible, at the cost of more boilerplate than anything seen in this course.',
                id: 'Pustaka game 2D paling mapan di Python — sprite, tabrakan, suara, dan loop game yang kamu tulis sendiri baris demi baris. Kuat dan fleksibel, dengan konsekuensi kode dasar (boilerplate) lebih banyak daripada apa pun di kursus ini.',
              },
              code: 'import pygame\npygame.init()\nlayar = pygame.display.set_mode((320, 240))\nberjalan = True\nwhile berjalan:\n    for e in pygame.event.get():\n        if e.type == pygame.QUIT:\n            berjalan = False\n    pygame.display.flip()',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'Pygame Zero: pygame without the boilerplate', id: 'Pygame Zero: pygame tanpa boilerplate' },
              body: {
                en: 'Built on top of pygame, but strips away the setup — just define `draw()` and `update()`, which should look familiar: it is the same shape as the `awal()`/`perbarui()`/`gambar()` pattern from earlier in this course. One of the easiest paths from here to a real, playable game.',
                id: 'Dibangun di atas pygame, tapi menghilangkan persiapannya — cukup definisikan `draw()` dan `update()`, yang seharusnya terasa akrab: bentuknya sama seperti pola `awal()`/`perbarui()`/`gambar()` dari bagian awal kursus ini. Salah satu jalan termudah dari sini menuju game sungguhan yang bisa dimainkan.',
              },
              code: 'WIDTH = 320\nHEIGHT = 240\nx = 40\n\ndef draw():\n    screen.fill((255, 255, 255))\n    screen.draw.filled_rect(Rect((x, 100), (30, 30)), "orange")\n\ndef update():\n    global x\n    x += 1',
            },
            {
              kind: 'concept',
              id: 'c4',
              title: { en: 'Arcade: a more modern alternative', id: 'Arcade: alternatif yang lebih modern' },
              body: {
                en: 'Built on OpenGL, with a class-based API (`Sprite`, `Window`) that reads more like ordinary Python, plus a built-in physics engine for gravity and collisions. A natural next step once a project outgrows what pygame handles comfortably.',
                id: 'Dibangun di atas OpenGL, dengan API berbasis kelas (`Sprite`, `Window`) yang terasa lebih seperti Python biasa, plus mesin fisika bawaan untuk gravitasi dan tabrakan. Langkah lanjutan yang wajar begitu sebuah proyek melampaui apa yang nyaman ditangani pygame.',
              },
              code: 'import arcade\n\nclass Jendela(arcade.Window):\n    def on_draw(self):\n        arcade.start_render()\n        arcade.draw_circle_filled(160, 120, 30, arcade.color.ORANGE)\n\nJendela(320, 240, "Contoh").run()',
            },
            {
              kind: 'concept',
              id: 'c5',
              title: { en: 'Kivy & KivyMD: real apps, not just games', id: 'Kivy & KivyMD: aplikasi sungguhan, bukan cuma game' },
              body: {
                en: 'Kivy builds cross-platform apps with touch interfaces — the same code runs on a desktop and on an Android or iOS phone. KivyMD adds Material Design styling on top. The most sensible route when teaching media has to become an app students actually install on their phones.',
                id: 'Kivy membangun aplikasi lintas platform dengan antarmuka sentuh — kode yang sama berjalan di desktop maupun di HP Android atau iOS. KivyMD menambahkan tampilan bergaya Material Design di atasnya. Jalan paling masuk akal ketika media pembelajarannya harus benar-benar jadi aplikasi yang dipasang siswa di HP mereka.',
              },
              code: 'from kivy.app import App\nfrom kivy.uix.label import Label\n\nclass AplikasiKu(App):\n    def build(self):\n        return Label(text="Halo dari Kivy")\n\nAplikasiKu().run()',
            },
            {
              kind: 'concept',
              id: 'c6',
              title: { en: 'Ursina: 3D without becoming a graphics expert', id: 'Ursina: 3D tanpa harus jadi ahli grafis' },
              body: {
                en: 'Built on Panda3D, but hides most of the complexity of 3D graphics programming underneath it. Good for a simple 3D demo or game — a solid a student can rotate and walk around, instead of only ever being drawn flat.',
                id: 'Dibangun di atas Panda3D, tapi menyembunyikan sebagian besar kerumitan pemrograman grafis 3D di baliknya. Cocok untuk peraga atau game 3D sederhana — bangun ruang yang bisa diputar dan dijelajahi siswa, bukan cuma digambar datar.',
              },
              code: 'from ursina import Ursina, Entity, color\n\napp = Ursina()\nEntity(model="cube", color=color.orange)\napp.run()',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which of these is built directly on top of pygame, removing its manual game loop and window setup?',
                id: 'Mana yang dibangun langsung di atas pygame, menghilangkan loop game dan persiapan jendelanya?',
              },
              options: [
                { en: 'Pygame Zero', id: 'Pygame Zero' },
                { en: 'Arcade', id: 'Arcade' },
                { en: 'Kivy', id: 'Kivy' },
                { en: 'Ursina', id: 'Ursina' },
              ],
              answer: 0,
              explain: {
                en: 'Pygame Zero wraps pygame itself; the other three are independent libraries with their own foundations.',
                id: 'Pygame Zero membungkus pygame itu sendiri; tiga lainnya adalah pustaka mandiri dengan fondasinya sendiri.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the lookup so "geometri untuk pemula" maps to the classic beginner tool.',
                id: 'Lengkapi tabelnya agar "geometri untuk pemula" mengarah ke perkakas klasik untuk pemula.',
              },
              template: 'perkakas = {\n    "grafis 2D klasik": "pygame",\n    "geometri untuk pemula": ___,\n}\nprint(perkakas["geometri untuk pemula"])',
              blanks: ['"turtle"'],
              explain: {
                en: 'turtle is the one built into Python itself, aimed squarely at teaching geometry.',
                id: 'turtle adalah yang sudah ada di dalam Python sendiri, ditujukan langsung untuk mengajarkan geometri.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a lookup mapping "aplikasi lintas platform" to the tool built for it.',
                id: 'Susun tabel yang memetakan "aplikasi lintas platform" ke perkakas yang dibangun untuknya.',
              },
              lines: ['perkakas = {}', 'perkakas["aplikasi lintas platform"] = "kivy"', 'print(perkakas["aplikasi lintas platform"])'],
              explain: {
                en: 'Kivy is the one built for one codebase running on desktop and mobile alike.',
                id: 'Kivy adalah yang dibangun untuk satu basis kode yang berjalan di desktop maupun ponsel sekaligus.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'A lookup table maps a need to the matching tool from this lesson. Read `kebutuhan` and print the matching tool name.',
                id: 'Sebuah tabel memetakan kebutuhan ke perkakas yang cocok dari pelajaran ini. Baca `kebutuhan` dan cetak nama perkakas yang cocok.',
              },
              starter:
                'perkakas = {\n    "grafis 2D klasik": "pygame",\n    "game tanpa boilerplate": "pygame zero",\n    "grafis modern dengan fisika bawaan": "arcade",\n    "aplikasi lintas platform": "kivy",\n    "3D tanpa jadi ahli grafis": "ursina",\n    "geometri untuk pemula": "turtle",\n}\nkebutuhan = input()\n',
              tests: [
                { name: { en: 'geometri untuk pemula → turtle', id: 'geometri untuk pemula → turtle' }, stdin: ['geometri untuk pemula'], expectOutput: 'turtle' },
                { name: { en: 'aplikasi lintas platform → kivy', id: 'aplikasi lintas platform → kivy' }, stdin: ['aplikasi lintas platform'], expectOutput: 'kivy' },
                { name: { en: '3D tanpa jadi ahli grafis → ursina', id: '3D tanpa jadi ahli grafis → ursina' }, stdin: ['3D tanpa jadi ahli grafis'], expectOutput: 'ursina' },
                { name: { en: 'fisika bawaan → arcade', id: 'fisika bawaan → arcade' }, stdin: ['grafis modern dengan fisika bawaan'], expectOutput: 'arcade' },
              ],
              hints: [
                { en: 'One line: print(perkakas[kebutuhan]).', id: 'Satu baris: print(perkakas[kebutuhan]).' },
              ],
              solution:
                'perkakas = {\n    "grafis 2D klasik": "pygame",\n    "game tanpa boilerplate": "pygame zero",\n    "grafis modern dengan fisika bawaan": "arcade",\n    "aplikasi lintas platform": "kivy",\n    "3D tanpa jadi ahli grafis": "ursina",\n    "geometri untuk pemula": "turtle",\n}\nkebutuhan = input()\nprint(perkakas[kebutuhan])',
            },
          ],
        },
      ],
      project: {
        id: 'pymed-m5-s1-p',
        title: { en: 'Which Library Fits?', id: 'Pustaka Mana yang Cocok?' },
        brief: {
          en: 'Practice matching a stated need to the right tool from this lesson — the same lookup skill, covering the two needs the lesson\'s own exercise did not test.',
          id: 'Latih mencocokkan kebutuhan dengan perkakas yang tepat dari pelajaran ini — keterampilan yang sama, mencakup dua kebutuhan yang belum diuji di latihan pelajarannya.',
        },
        requirements: [
          { en: 'Build the same six-entry lookup as the lesson.', id: 'Susun tabel enam entri yang sama seperti di pelajaran.' },
          { en: 'Read `kebutuhan`.', id: 'Baca `kebutuhan`.' },
          { en: 'Print the matching tool name.', id: 'Cetak nama perkakas yang cocok.' },
        ],
        starter:
          'perkakas = {\n    "grafis 2D klasik": "pygame",\n    "game tanpa boilerplate": "pygame zero",\n    "grafis modern dengan fisika bawaan": "arcade",\n    "aplikasi lintas platform": "kivy",\n    "3D tanpa jadi ahli grafis": "ursina",\n    "geometri untuk pemula": "turtle",\n}\nkebutuhan = input()\n',
        tests: [
          { name: { en: 'grafis 2D klasik → pygame', id: 'grafis 2D klasik → pygame' }, stdin: ['grafis 2D klasik'], expectOutput: 'pygame' },
          { name: { en: 'game tanpa boilerplate → pygame zero', id: 'game tanpa boilerplate → pygame zero' }, stdin: ['game tanpa boilerplate'], expectOutput: 'pygame zero' },
          { name: { en: 'geometri untuk pemula → turtle', id: 'geometri untuk pemula → turtle' }, stdin: ['geometri untuk pemula'], expectOutput: 'turtle' },
          { name: { en: 'aplikasi lintas platform → kivy', id: 'aplikasi lintas platform → kivy' }, stdin: ['aplikasi lintas platform'], expectOutput: 'kivy' },
        ],
        hints: [
          { en: 'The same shape as the lesson\'s own exercise, with all six entries present.', id: 'Bentuknya sama seperti latihan di pelajarannya, dengan keenam entrinya lengkap.' },
        ],
        solution:
          'perkakas = {\n    "grafis 2D klasik": "pygame",\n    "game tanpa boilerplate": "pygame zero",\n    "grafis modern dengan fisika bawaan": "arcade",\n    "aplikasi lintas platform": "kivy",\n    "3D tanpa jadi ahli grafis": "ursina",\n    "geometri untuk pemula": "turtle",\n}\nkebutuhan = input()\nprint(perkakas[kebutuhan])',
        xp: 50,
      },
    },

    /* --------------------------------------------- 5.2 science & math tools */
    {
      id: 'pymed-m5-s2',
      title: { en: 'Science and Math, Some of It Runnable Here', id: 'Sains dan Matematika, Sebagian Bisa Dicoba di Sini' },
      summary: {
        en: 'Six more tools — but this time, two of them actually run inside this sandbox. Try them for real.',
        id: 'Enam perkakas lagi — tapi kali ini, dua di antaranya benar-benar bisa dijalankan di sandbox ini. Coba sungguhan.',
      },
      lessons: [
        {
          id: 'pymed-m5-s2-l1',
          title: { en: 'Plotting, Animation, Simulation, and Exact Algebra', id: 'Plot, Animasi, Simulasi, dan Aljabar Eksak' },
          goal: { en: 'Know six more tools, and run two of them for real.', id: 'Kenali enam perkakas lagi, dan jalankan dua di antaranya sungguhan.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'matplotlib & seaborn: the standard plotting libraries', id: 'matplotlib & seaborn: pustaka plot standar' },
              body: {
                en: 'matplotlib draws almost any chart imaginable — line graphs, bar charts, plotted functions — and it genuinely runs in this sandbox, `Agg` mode saving straight to a file with no display involved. Try it. seaborn is a friendlier layer on top, with better defaults for statistical charts like histograms — checked directly, seaborn itself is not available here.',
                id: 'matplotlib menggambar hampir semua jenis grafik — grafik garis, batang, plot fungsi — dan sungguh berjalan di sandbox ini, mode `Agg` menyimpan langsung ke berkas tanpa tampilan yang terlibat. Coba sendiri. seaborn adalah lapisan yang lebih ramah di atasnya, dengan tampilan bawaan lebih baik untuk grafik statistik seperti histogram — dicek langsung, seaborn sendiri tidak tersedia di sini.',
              },
              code: 'import matplotlib\nmatplotlib.use("Agg")\nimport matplotlib.pyplot as plt\nx = [1, 2, 3, 4]\ny = [i ** 2 for i in x]\nplt.plot(x, y)\nplt.savefig("grafik.png")\nprint("tersimpan")',
              output: 'tersimpan',
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Manim: precise math video', id: 'Manim: video matematika yang presisi' },
              body: {
                en: 'The animation engine behind 3Blue1Brown-style explainer videos — equations and geometric constructions written as code, rendered into a video that walks through them step by step. Of everything on this list, this is the one most directly aimed at "teaching media": not a still picture, but a narrated sequence.',
                id: 'Mesin animasi di balik video-video penjelasan bergaya 3Blue1Brown — persamaan dan konstruksi geometris ditulis sebagai kode, dirender jadi video yang menjelaskannya langkah demi langkah. Dari semua di daftar ini, inilah yang paling langsung menyasar "media pembelajaran": bukan gambar diam, tapi tayangan yang menuntun.',
              },
              code: 'from manim import *\n\nclass Animasi(Scene):\n    def construct(self):\n        lingkaran = Circle()\n        self.play(Create(lingkaran))',
            },
            {
              kind: 'concept',
              id: 'c3',
              title: { en: 'VPython: physics in 3D', id: 'VPython: fisika dalam 3D' },
              body: {
                en: 'Built for visualizing vectors, forces, and motion as a navigable 3D scene. Its browser-based version — Web VPython, formerly called GlowScript — runs directly in a browser, but through its own engine, not through Pyodide the way this app does.',
                id: 'Dibuat untuk memvisualisasikan vektor, gaya, dan gerak sebagai adegan 3D yang bisa dijelajahi. Versinya yang berbasis peramban — Web VPython, dulu bernama GlowScript — berjalan langsung di peramban, tapi lewat mesinnya sendiri, bukan lewat Pyodide seperti aplikasi ini.',
              },
              code: 'from vpython import sphere, vector, color\n\nbola = sphere(pos=vector(0, 0, 0), radius=1, color=color.orange)',
            },
            {
              kind: 'concept',
              id: 'c4',
              title: { en: 'Streamlit: a script becomes a web app', id: 'Streamlit: skrip Python jadi aplikasi web' },
              body: {
                en: 'Turns an ordinary Python script into an interactive web app — sliders, buttons, live charts — with almost no web-development knowledge required. If a piece of teaching media needs to reach a whole class online, each from their own browser, this is the most direct route.',
                id: 'Mengubah skrip Python biasa menjadi aplikasi web interaktif — slider, tombol, grafik yang hidup — nyaris tanpa pengetahuan pengembangan web. Kalau sebuah media pembelajaran perlu menjangkau satu kelas penuh secara daring, dari peramban masing-masing, inilah jalan paling langsung.',
              },
              code: 'import streamlit as st\n\nst.title("Kalkulator Bunga Majemuk")\npokok = st.number_input("Modal awal")\nst.write(pokok * 1.05)',
            },
            {
              kind: 'concept',
              id: 'c5',
              title: { en: 'SymPy: algebra that is exact, not approximate', id: 'SymPy: aljabar yang eksak, bukan hampiran' },
              body: {
                en: "Every numerical method earlier in this course — bisection, Newton's method — converges toward an answer. SymPy instead solves **symbolically**: the result is an exact form, not a decimal that gets close. And unlike everything above, this genuinely runs in this sandbox — try it.",
                id: 'Setiap metode numerik sebelumnya di kursus ini — bisection, metode Newton — menghampiri jawaban. SymPy sebaliknya menyelesaikan secara **simbolik**: hasilnya bentuk eksak, bukan desimal yang mendekati. Dan tak seperti semua yang di atas, ini sungguh-sungguh berjalan di sandbox ini — coba sendiri.',
              },
              code: 'import sympy\nx = sympy.symbols("x")\npersamaan = sympy.Eq(x**2 - 5*x + 6, 0)\nprint(sympy.solve(persamaan, x))',
              output: '[2, 3]',
            },
            {
              kind: 'concept',
              id: 'c6',
              title: { en: 'NumPy & SciPy: from arrays to ready-made methods', id: 'NumPy & SciPy: dari array ke metode siap pakai' },
              body: {
                en: 'NumPy gives fast array and vector/matrix operations — the foundation of the next course in this track. SciPy builds on it with ready-made numerical methods: optimization, statistics, differential-equation solvers — so a method like Newton\'s does not have to be hand-written every time. This runs here too.',
                id: 'NumPy memberi array dan operasi vektor/matriks yang cepat — fondasi kursus berikutnya di jalur ini. SciPy dibangun di atasnya dengan metode numerik siap pakai: optimisasi, statistik, penyelesai persamaan diferensial — supaya metode seperti Newton tidak perlu ditulis tangan tiap kali. Ini juga berjalan di sini.',
              },
              code: 'import numpy as np\nfrom scipy import optimize\nakar = optimize.brentq(lambda x: x**2 - 2, 0, 2)\nprint(round(akar, 4))',
              output: '1.4142',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which of these actually runs inside this app, right now — because it manipulates symbols and numbers, with no image, window, or renderer involved?',
                id: 'Mana yang benar-benar berjalan di aplikasi ini, sekarang — karena ia mengolah simbol dan angka, tanpa gambar, jendela, atau perender yang terlibat?',
              },
              options: [
                { en: 'SymPy', id: 'SymPy' },
                { en: 'Streamlit', id: 'Streamlit' },
                { en: 'VPython', id: 'VPython' },
                { en: 'Manim', id: 'Manim' },
              ],
              answer: 0,
              explain: {
                en: 'SymPy only ever produces symbols and text — nothing platform-specific to render, so nothing stops it running anywhere Python does.',
                id: 'SymPy hanya pernah menghasilkan simbol dan teks — tak ada yang khas platform untuk dirender, jadi tak ada yang menghalanginya berjalan di mana pun Python berjalan.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the lookup so "fisika dalam 3D" maps to the right tool.',
                id: 'Lengkapi tabelnya agar "fisika dalam 3D" mengarah ke perkakas yang tepat.',
              },
              template: 'perkakas = {\n    "video matematika presisi": "manim",\n    "fisika dalam 3D": ___,\n}\nprint(perkakas["fisika dalam 3D"])',
              blanks: ['"vpython"'],
              explain: {
                en: 'VPython is the one built specifically for navigable 3D physics scenes.',
                id: 'VPython adalah yang dibangun khusus untuk adegan fisika 3D yang bisa dijelajahi.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a lookup mapping "skrip jadi aplikasi web" to the tool built for it.',
                id: 'Susun tabel yang memetakan "skrip jadi aplikasi web" ke perkakas yang dibangun untuknya.',
              },
              lines: ['perkakas = {}', 'perkakas["skrip jadi aplikasi web"] = "streamlit"', 'print(perkakas["skrip jadi aplikasi web"])'],
              explain: {
                en: 'Streamlit is the one built to turn a script into a web app with minimal extra code.',
                id: 'Streamlit adalah yang dibangun untuk mengubah skrip jadi aplikasi web dengan kode tambahan minimal.',
              },
            },
            {
              kind: 'code',
              id: 'k1',
              prompt: {
                en: 'A lookup table maps a need to the matching tool from this lesson. Read `kebutuhan` and print the matching tool name.',
                id: 'Sebuah tabel memetakan kebutuhan ke perkakas yang cocok dari pelajaran ini. Baca `kebutuhan` dan cetak nama perkakas yang cocok.',
              },
              starter:
                'perkakas = {\n    "plot grafik standar": "matplotlib",\n    "video matematika presisi": "manim",\n    "fisika dalam 3D": "vpython",\n    "skrip jadi aplikasi web": "streamlit",\n    "aljabar simbolik eksak": "sympy",\n    "array dan metode numerik": "numpy dan scipy",\n}\nkebutuhan = input()\n',
              tests: [
                { name: { en: 'aljabar simbolik eksak → sympy', id: 'aljabar simbolik eksak → sympy' }, stdin: ['aljabar simbolik eksak'], expectOutput: 'sympy' },
                { name: { en: 'array dan metode numerik → numpy dan scipy', id: 'array dan metode numerik → numpy dan scipy' }, stdin: ['array dan metode numerik'], expectOutput: 'numpy dan scipy' },
                { name: { en: 'video matematika presisi → manim', id: 'video matematika presisi → manim' }, stdin: ['video matematika presisi'], expectOutput: 'manim' },
                { name: { en: 'fisika dalam 3D → vpython', id: 'fisika dalam 3D → vpython' }, stdin: ['fisika dalam 3D'], expectOutput: 'vpython' },
              ],
              hints: [
                { en: 'One line: print(perkakas[kebutuhan]).', id: 'Satu baris: print(perkakas[kebutuhan]).' },
              ],
              solution:
                'perkakas = {\n    "plot grafik standar": "matplotlib",\n    "video matematika presisi": "manim",\n    "fisika dalam 3D": "vpython",\n    "skrip jadi aplikasi web": "streamlit",\n    "aljabar simbolik eksak": "sympy",\n    "array dan metode numerik": "numpy dan scipy",\n}\nkebutuhan = input()\nprint(perkakas[kebutuhan])',
            },
          ],
        },
      ],
      project: {
        id: 'pymed-m5-s2-p',
        title: { en: 'Solving Algebra with SymPy', id: 'Penyelesaian Aljabar dengan SymPy' },
        brief: {
          en: 'Use SymPy to solve a quadratic equation symbolically, instead of computing it by hand or approximating it in a loop.',
          id: 'Pakai SymPy untuk menyelesaikan persamaan kuadrat secara simbolik, alih-alih menghitungnya manual atau menghampirinya lewat perulangan.',
        },
        requirements: [
          { en: 'Read whole-number coefficients `a`, `b`, `c` of `a*x**2 + b*x + c = 0`.', id: 'Baca koefisien bilangan bulat `a`, `b`, `c` dari `a*x**2 + b*x + c = 0`.' },
          { en: 'Build the equation with `sympy.Eq` and solve it with `sympy.solve`, storing the result in a variable named `akar`.', id: 'Susun persamaannya dengan `sympy.Eq` dan selesaikan dengan `sympy.solve`, simpan hasilnya di variabel bernama `akar`.' },
          { en: 'Print `sorted(akar)`.', id: 'Cetak `sorted(akar)`.' },
        ],
        starter: 'import sympy\nx = sympy.symbols("x")\na = int(input())\nb = int(input())\nc = int(input())\n',
        tests: [
          {
            name: { en: 'x² - 5x + 6 = 0 → roots 2, 3', id: 'x² - 5x + 6 = 0 → akar 2, 3' },
            stdin: ['1', '-5', '6'],
            assert:
              'hasil = sorted(float(r) for r in akar)\nharap = [2.0, 3.0]\nassert len(hasil) == len(harap) and all(abs(h - p) < 0.0001 for h, p in zip(hasil, harap)), f"akar salah: {hasil}, diharap: {harap}"',
          },
          {
            name: { en: 'x² - 3x + 2 = 0 → roots 1, 2', id: 'x² - 3x + 2 = 0 → akar 1, 2' },
            stdin: ['1', '-3', '2'],
            assert:
              'hasil = sorted(float(r) for r in akar)\nharap = [1.0, 2.0]\nassert len(hasil) == len(harap) and all(abs(h - p) < 0.0001 for h, p in zip(hasil, harap)), f"akar salah: {hasil}, diharap: {harap}"',
          },
          {
            name: { en: 'x² - 4 = 0 → roots -2, 2', id: 'x² - 4 = 0 → akar -2, 2' },
            stdin: ['1', '0', '-4'],
            assert:
              'hasil = sorted(float(r) for r in akar)\nharap = [-2.0, 2.0]\nassert len(hasil) == len(harap) and all(abs(h - p) < 0.0001 for h, p in zip(hasil, harap)), f"akar salah: {hasil}, diharap: {harap}"',
          },
          {
            name: { en: 'x² - 4x + 4 = 0 → double root 2', id: 'x² - 4x + 4 = 0 → akar ganda 2' },
            stdin: ['1', '-4', '4'],
            assert:
              'hasil = sorted(float(r) for r in akar)\nharap = [2.0]\nassert len(hasil) == len(harap) and all(abs(h - p) < 0.0001 for h, p in zip(hasil, harap)), f"akar salah: {hasil}, diharap: {harap}"',
          },
        ],
        hints: [
          { en: 'sympy.Eq(a * x**2 + b * x + c, 0) writes the equation; sympy.solve(..., x) solves it for x.', id: 'sympy.Eq(a * x**2 + b * x + c, 0) menuliskan persamaannya; sympy.solve(..., x) menyelesaikannya untuk x.' },
          { en: 'sympy.solve returns a list already — that list is what akar should be.', id: 'sympy.solve sudah mengembalikan sebuah list — list itulah yang seharusnya jadi akar.' },
        ],
        solution:
          'import sympy\nx = sympy.symbols("x")\na = int(input())\nb = int(input())\nc = int(input())\npersamaan = sympy.Eq(a * x**2 + b * x + c, 0)\nakar = sympy.solve(persamaan, x)\nprint(sorted(akar))',
        xp: 50,
      },
    },
  ],
}
