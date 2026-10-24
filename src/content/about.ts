/** The text of the About page, in both languages, as data.
 *
 *  Two places draw it: the page a visitor sees (`pages/About.tsx`) and the static HTML the build writes for crawlers that do not run scripts
 *  (`tools/prerender-articles.mjs`). One description, two renderers, so they cannot say different things.
 *
 *  Numbers are never typed into the text. `{courses}`, `{lessons}`, `{projects}`, `{articles}` and the rest are filled from the catalog and the
 *  article list by `fillStats`, so a sentence cannot go stale the day a course is added. The prose may use the same light markup as the articles:
 *  `**bold**`, `- ` lists and `[words](article:id#section)` links. */

import type { CourseInfo, Loc } from './types'
import { ORG } from './org'

export type AboutBlock =
  | { kind: 'text'; text: Loc }
  /** The available courses of one track, as cards: name, level, one line, the lesson and project counts. */
  | { kind: 'courses'; track: 'math' | 'code'; heading: Loc }
  /** The newest articles, as links. */
  | { kind: 'articles'; count: number }

export interface AboutSection {
  id: string
  heading: Loc
  blocks: AboutBlock[]
}

const L = (en: string, id: string): Loc => ({ en, id })

export const ABOUT = {
  title: L('About Nunada Academy', 'Tentang Nunada Academy'),
  /** The page's own title in a results page, and its description. */
  seoTitle: L('About Nunada Academy: Math and Coding Courses', 'Tentang Nunada Academy: Kursus Matematika dan Coding'),
  description: L(
    'What Nunada Academy is, what you can learn there, how the courses and free articles work, and how to report a mistake. In English and Bahasa Indonesia.',
    'Apa itu Nunada Academy, apa yang bisa dipelajari, bagaimana kursus dan artikel gratisnya bekerja, dan cara melaporkan kesalahan. Dalam bahasa Inggris dan Indonesia.',
  ),
  keywords: L(
    'about Nunada Academy, what is Nunada Academy, learn math and coding online, free math articles in English and Indonesian, step by step coding course for beginners, TKA math practice online, interactive math practice with worked examples, learn Python for beginners step by step',
    'tentang Nunada Academy, apa itu Nunada Academy, belajar matematika dan coding online, artikel matematika gratis bahasa Indonesia dan Inggris, kursus coding untuk pemula langkah demi langkah, latihan soal TKA matematika online, latihan matematika interaktif dengan contoh bertahap, belajar Python untuk pemula',
  ),
  answer: ORG.description,
  sections: [
    {
      id: 'what-is-nunada-academy',
      heading: L('What is Nunada Academy?', 'Apa itu Nunada Academy?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            `**Nunada Academy is a place to learn mathematics and programming one small step at a time, in English or Bahasa Indonesia.** It has {courses} courses ({mathCourses} in mathematics, {codeCourses} in code) and {articles} free articles that explain one idea each, from the Pythagorean theorem to the chain rule to how a computer stores 0.1. Everything on the site is written twice, once in each language, and the two versions live at their own addresses.

What sets it apart is how the practice works. A lesson is a short chain of steps: you read an idea, study a worked example, then try one yourself, with hints that point at the mistake without giving the answer away. Early steps are guided and later ones ask for more.`,
            `**Nunada Academy adalah tempat belajar matematika dan pemrograman selangkah demi selangkah, dalam bahasa Inggris atau Bahasa Indonesia.** Isinya {courses} kursus ({mathCourses} matematika, {codeCourses} kode) dan {articles} artikel gratis yang masing-masing menjelaskan satu gagasan, dari teorema Pythagoras sampai aturan rantai sampai cara komputer menyimpan 0,1. Semua isi ditulis dua kali, satu per bahasa, dan kedua versinya punya alamat sendiri.

Yang membedakannya adalah cara latihannya bekerja. Sebuah pelajaran adalah rangkaian langkah pendek: kamu membaca satu gagasan, mempelajari contoh bertahap, lalu mencoba sendiri, dengan petunjuk yang menunjuk ke kesalahannya tanpa membocorkan jawabannya. Langkah awal dipandu, langkah berikutnya meminta lebih banyak.`,
          ),
        },
      ],
    },
    {
      id: 'what-you-can-learn',
      heading: L('What can you learn on Nunada Academy?', 'Apa yang bisa dipelajari di Nunada Academy?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            `There are two tracks. The **mathematics** courses are worked on paper and answered in a box, and run from algebra fundamentals through functions, vectors, limits, derivatives, integrals and series, with TKA (Tes Kemampuan Akademik) preparation for elementary, junior high and senior high school. The **code** courses are written and run in the browser: blocks, Python, HTML, CSS, JavaScript, TypeScript, React, SQL, C++, game development, and Python used for mathematics.`,
            `Ada dua jalur. Kursus **matematika** dikerjakan di atas kertas dan dijawab di kotak isian, dari dasar aljabar lewat fungsi, vektor, limit, turunan, integral, dan deret, dengan persiapan TKA (Tes Kemampuan Akademik) untuk SD, SMP, dan SMA. Kursus **kode** ditulis dan dijalankan di peramban: blok, Python, HTML, CSS, JavaScript, TypeScript, React, SQL, C++, pengembangan game, dan Python untuk matematika.`,
          ),
        },
        { kind: 'courses', track: 'math', heading: L('Mathematics courses', 'Kursus matematika') },
        { kind: 'courses', track: 'code', heading: L('Code courses', 'Kursus kode') },
      ],
    },
    {
      id: 'how-learning-works',
      heading: L('How does learning work on Nunada Academy?', 'Bagaimana cara belajar di Nunada Academy?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            `Each course is a map of modules, and each module is a set of lessons that ends with a mini project. {lessons} lessons and {projects} mini projects in all.

- **Small steps.** A lesson is a chain of short steps: an idea, a worked example, then one for you to try.
- **Hints, not answers.** A wrong answer shows a hint that points at the mistake, never the solution.
- **Mini projects.** Each part of a course ends with a project that puts the lessons together, and finishing it opens the next part.
- **XP, hearts, trophies and certificates.** Finished lessons earn XP and move you up the leaderboard, milestones earn trophies, and finishing a course earns a certificate.
- **A playground.** Write and run code outside a lesson.
- **Made to be read aloud.** Formulas carry a spoken version for screen readers, there is a skip link on every page, and the light, dark or system theme is one tap away.

New here? The [guide](/help) walks through the first lesson.`,
            `Tiap kursus adalah peta modul, dan tiap modul adalah sekumpulan pelajaran yang ditutup dengan mini proyek. Seluruhnya {lessons} pelajaran dan {projects} mini proyek.

- **Langkah kecil.** Sebuah pelajaran adalah rangkaian langkah pendek: satu gagasan, satu contoh bertahap, lalu satu untuk kamu coba.
- **Petunjuk, bukan jawaban.** Jawaban yang salah menampilkan petunjuk yang menunjuk ke kesalahannya, tidak pernah penyelesaiannya.
- **Mini proyek.** Tiap bagian kursus ditutup dengan proyek yang menyatukan pelajarannya, dan menyelesaikannya membuka bagian berikutnya.
- **XP, nyawa, trofi, dan sertifikat.** Pelajaran yang selesai memberi XP dan menaikkan peringkatmu, pencapaian tertentu memberi trofi, dan menamatkan kursus memberi sertifikat.
- **Playground.** Tulis dan jalankan kode di luar pelajaran.
- **Dibuat agar bisa dibacakan.** Rumus punya versi lisan untuk pembaca layar, ada tautan lompat di setiap halaman, dan tema terang, gelap, atau mengikuti sistem hanya sekali ketuk.

Baru di sini? [Panduan](/help) menuntunmu lewat pelajaran pertama.`,
          ),
        },
      ],
    },
    {
      id: 'free-articles',
      heading: L('What are the free articles?', 'Apa itu artikel gratis di Nunada Academy?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            `**The articles are free to read and need no account.** Each one answers a single question about mathematics or code, and has the same parts: a quick answer at the top, a table of contents, interactive figures and practice, a glossary, a FAQ and references. {articles} are published, newest first below, and the [article list](/articles) can be searched and filtered.

They are written to be checked. The numbers in a worked example come from code, and a separate check script re-derives them another way before the site is deployed, which is why the articles show what a calculator or a program would print. When a figure, a formula or a program shown in an article is wrong, that is a bug worth reporting (see below).`,
            `**Artikelnya gratis dibaca dan tidak memerlukan akun.** Tiap artikel menjawab satu pertanyaan tentang matematika atau kode, dan punya bagian yang sama: jawaban singkat di atas, daftar isi, gambar dan latihan interaktif, glosarium, FAQ, dan referensi. Ada {articles} artikel terbit, yang terbaru di bawah ini, dan [daftar artikel](/artikel) bisa dicari dan disaring.

Artikel ditulis agar bisa diperiksa. Angka pada contoh bertahap berasal dari kode, dan skrip pemeriksa terpisah menurunkannya lagi dengan cara lain sebelum situs dipublikasikan, itulah sebabnya artikel menampilkan apa yang dicetak kalkulator atau program. Bila sebuah gambar, rumus, atau program dalam artikel salah, itu galat yang layak dilaporkan (lihat di bawah).`,
          ),
        },
        { kind: 'articles', count: 6 },
      ],
    },
    {
      id: 'for-teachers',
      heading: L('Can teachers use Nunada Academy with a class?', 'Bisakah guru memakai Nunada Academy untuk satu kelas?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            `Yes. An account with the teacher role gets a roster page that lists every learner with their XP, lessons and projects finished and when they were last active, sorted and searchable, so it is easy to see who has not started or who is stuck. Learners can print a certificate when they finish a course.`,
            `Bisa. Akun dengan peran guru mendapat halaman daftar murid yang memuat setiap murid dengan XP, pelajaran dan proyek yang selesai, serta kapan terakhir aktif, bisa diurutkan dan dicari, sehingga mudah melihat siapa yang belum mulai atau tersendat. Murid juga bisa mencetak sertifikat saat menamatkan kursus.`,
          ),
        },
      ],
    },
    {
      id: 'languages',
      heading: L('Which languages does Nunada Academy use?', 'Bahasa apa yang dipakai Nunada Academy?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            `**English and Bahasa Indonesia.** Every course lesson and every article exists in both, and the EN/ID switch at the top of each page changes language without losing your place. Articles have one address per language, for example \`/articles/law-of-cosines\` and \`/artikel/aturan-kosinus\`, so each can be found and shared in its own language. Indonesian examples use Indonesian contexts, such as rupiah for money problems and the words sin-de-mi, cos-sa-mi and tan-de-sa for the trigonometric ratios.`,
            `**Bahasa Inggris dan Bahasa Indonesia.** Setiap pelajaran kursus dan setiap artikel ada dalam keduanya, dan tombol EN/ID di atas setiap halaman mengganti bahasa tanpa kehilangan tempatmu. Artikel punya satu alamat per bahasa, misalnya \`/articles/law-of-cosines\` dan \`/artikel/aturan-kosinus\`, sehingga masing-masing bisa ditemukan dan dibagikan dalam bahasanya. Contoh berbahasa Indonesia memakai konteks Indonesia, seperti rupiah untuk soal uang dan sebutan sin-de-mi, cos-sa-mi, dan tan-de-sa untuk perbandingan trigonometri.`,
          ),
        },
      ],
    },
    {
      id: 'report-a-mistake',
      heading: L('How do you report a mistake or ask a question?', 'Bagaimana melaporkan kesalahan atau bertanya?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            `The code of Nunada Academy is public, and so is its issue tracker: open an issue at [github.com/nunada/academy/issues](${ORG.issues}) and say which page and what looks wrong. Signed-in learners also have a feedback button in the corner of every page for a quick rating and a comment.`,
            `Kode Nunada Academy bersifat publik, begitu pula pelacak isunya: buka isu di [github.com/nunada/academy/issues](${ORG.issues}) dan sebutkan halaman mana dan apa yang tampak keliru. Murid yang sudah masuk juga punya tombol umpan balik di pojok setiap halaman untuk penilaian cepat dan komentar.`,
          ),
        },
      ],
    },
  ] as AboutSection[],
  faq: [
    {
      q: L('What is Nunada Academy?', 'Apa itu Nunada Academy?'),
      a: L(
        'Nunada Academy is a learning site for mathematics and programming in English and Bahasa Indonesia. It has step-by-step courses with worked examples, hints and mini projects, plus free articles that each explain one idea and need no account.',
        'Nunada Academy adalah situs belajar matematika dan pemrograman dalam bahasa Inggris dan Bahasa Indonesia. Isinya kursus langkah demi langkah dengan contoh bertahap, petunjuk, dan mini proyek, serta artikel gratis yang masing-masing menjelaskan satu gagasan dan tidak memerlukan akun.',
      ),
    },
    {
      q: L('What can I learn on Nunada Academy?', 'Apa yang bisa saya pelajari di Nunada Academy?'),
      a: L(
        'Mathematics from algebra fundamentals to calculus, vectors and series, with TKA preparation for elementary, junior high and senior high school; and programming in Python, HTML, CSS, JavaScript, TypeScript, React, SQL, C++ and blocks, plus game development.',
        'Matematika dari dasar aljabar sampai kalkulus, vektor, dan deret, dengan persiapan TKA untuk SD, SMP, dan SMA; serta pemrograman dengan Python, HTML, CSS, JavaScript, TypeScript, React, SQL, C++, dan blok, ditambah pengembangan game.',
      ),
    },
    {
      q: L('Do I need an account to read the articles?', 'Apakah saya perlu akun untuk membaca artikel?'),
      a: L(
        'No. The articles are free to read, in English and in Indonesian, without signing up. The courses, the playground, XP and certificates need an account, which takes an email address, a username and a display name.',
        'Tidak. Artikel gratis dibaca, dalam bahasa Inggris maupun Indonesia, tanpa mendaftar. Kursus, playground, XP, dan sertifikat memerlukan akun, yang membutuhkan alamat email, username, dan nama tampilan.',
      ),
    },
    {
      q: L('Is Nunada Academy available in Indonesian?', 'Apakah Nunada Academy tersedia dalam bahasa Indonesia?'),
      a: L(
        'Yes. Every lesson and every article is written in both English and Bahasa Indonesia, and the EN/ID switch changes the language of the page. Indonesian pages use Indonesian examples, such as rupiah for money problems.',
        'Ya. Setiap pelajaran dan setiap artikel ditulis dalam bahasa Inggris dan Bahasa Indonesia, dan tombol EN/ID mengganti bahasa halaman. Halaman berbahasa Indonesia memakai contoh Indonesia, seperti rupiah untuk soal uang.',
      ),
    },
    {
      q: L('Can teachers follow their students’ progress?', 'Bisakah guru memantau kemajuan muridnya?'),
      a: L(
        'Yes. A teacher account has a roster that shows each learner’s XP, finished lessons and projects, and last activity, so a teacher can see who has not started and who is stuck.',
        'Bisa. Akun guru memiliki daftar murid yang menampilkan XP, pelajaran dan proyek yang selesai, serta aktivitas terakhir tiap murid, sehingga guru dapat melihat siapa yang belum mulai dan siapa yang tersendat.',
      ),
    },
    {
      q: L('How do I report a mistake on Nunada Academy?', 'Bagaimana melaporkan kesalahan di Nunada Academy?'),
      a: L(
        'Open an issue on the public GitHub repository, github.com/nunada/academy, and name the page and what looks wrong. Signed-in learners can also use the feedback button in the corner of every page.',
        'Buka isu di repositori GitHub publik, github.com/nunada/academy, dan sebutkan halaman dan apa yang tampak keliru. Murid yang sudah masuk juga dapat memakai tombol umpan balik di pojok setiap halaman.',
      ),
    },
  ],
}

export interface AboutStats {
  courses: number
  mathCourses: number
  codeCourses: number
  lessons: number
  projects: number
  articles: number
}

/** The numbers the text refers to, counted from the catalog (only courses that can be played) and the article list. */
export function aboutStats(courses: CourseInfo[], articleCount: number): AboutStats {
  const live = courses.filter((c) => c.available)
  return {
    courses: live.length,
    mathCourses: live.filter((c) => c.track === 'math').length,
    codeCourses: live.filter((c) => c.track === 'code').length,
    lessons: live.reduce((n, c) => n + c.lessons, 0),
    projects: live.reduce((n, c) => n + c.projects, 0),
    articles: articleCount,
  }
}

/** The text with `{name}` filled from the stats. A name that is not a stat is an error, so a typo cannot reach a page. */
export function fillStats(text: string, stats: AboutStats): string {
  return text.replace(/\{(\w+)\}/g, (_, k: string) => {
    if (!(k in stats)) throw new Error(`About text uses {${k}}, which is not a stat`)
    return String(stats[k as keyof AboutStats])
  })
}
