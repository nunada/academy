import type { Module } from '../types'

/** Module 1 — the raw material of logic: a statement, the difference between
 *  a variable, a constant and a parameter, an open sentence versus a closed
 *  one, and the first two ways of joining two statements into one. Every
 *  later module reuses the truth-table habit this one builds: write every
 *  combination of inputs down, work out the output for each, and trust the
 *  table over intuition. */
export const module1: Module = {
  id: 'log-m1',
  title: { en: 'Statements, Open Sentences, and Basic Connectives', id: 'Pernyataan, Kalimat Terbuka, dan Kata Hubung Dasar' },
  summary: {
    en: 'What a statement is, the vocabulary of variables, constants and parameters, open versus closed sentences, and negation, conjunction, and disjunction.',
    id: 'Apa itu pernyataan, kosakata variabel, konstanta, dan parameter, kalimat terbuka versus tertutup, serta negasi, konjungsi, dan disjungsi.',
  },
  submodules: [
    /* ------------------------------------------------- 1.1 the vocabulary */
    {
      id: 'log-m1-s1',
      title: { en: 'Statements and Open Sentences', id: 'Pernyataan dan Kalimat Terbuka' },
      summary: {
        en: 'Tell a statement from other kinds of sentence, name the symbols inside one, and read an open sentence.',
        id: 'Membedakan pernyataan dari jenis kalimat lain, menamai lambang-lambang di dalamnya, dan membaca kalimat terbuka.',
      },
      lessons: [
        {
          id: 'log-m1-s1-l1',
          title: { en: 'Sentences and Statements', id: 'Kalimat dan Pernyataan' },
          goal: {
            en: 'Recognise a statement, and say whether it is true or false.',
            id: 'Mengenali sebuah pernyataan, dan menyebut apakah ia benar atau salah.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Four kinds of sentence, one kind of logic', id: 'Empat jenis kalimat, satu jenis logika' },
              body: {
                en: 'Ordinary language has several kinds of sentence:\n\n- **declarative** ("Semarang is a city in Central Java")\n- **interrogative** ("Is Semarang a city in Central Java?")\n- **imperative** ("Visit Semarang")\n- **exclamatory** ("What a lovely city Semarang is!")\n\nLogic only ever works with the declarative kind — a sentence that **states** something, rather than asking, ordering, or exclaiming it.',
                id: 'Bahasa sehari-hari punya beberapa jenis kalimat:\n\n- **kalimat berita** ("Semarang adalah kota di Jawa Tengah")\n- **kalimat tanya** ("Apakah Semarang kota di Jawa Tengah?")\n- **kalimat perintah** ("Kunjungilah Semarang")\n- **kalimat seru** ("Alangkah indahnya kota Semarang!")\n\nLogika hanya pernah bekerja dengan jenis kalimat berita — kalimat yang **menyatakan** sesuatu, bukan menanyakan, memerintahkan, atau menyerukannya.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A statement has a truth value', id: 'Pernyataan punya nilai kebenaran' },
              body: {
                en: 'Not every declarative sentence counts, either. A **statement** (or **proposition**) is a declarative sentence that is either true or false, but never both and never neither. "Jakarta is the capital of Indonesia" is a statement — it happens to be true. "$5 + 3 = 9$" is also a statement — it happens to be false. Both count, because both have a definite **truth value**.\n\nA sentence like "This sentence is false" is famous precisely because it is **not** a statement: calling it true makes it false, and calling it false makes it true. Nothing in this course goes that far, but it is why the definition insists on "one and only one" truth value, not just "some" truth value.',
                id: 'Tidak setiap kalimat berita pun terhitung. Sebuah **pernyataan** (atau **proposisi**) adalah kalimat berita yang benar atau salah, tetapi tidak pernah keduanya dan tidak pernah bukan keduanya. "Jakarta adalah ibu kota Indonesia" adalah pernyataan — kebetulan ia benar. "$5 + 3 = 9$" juga pernyataan — kebetulan ia salah. Keduanya terhitung, karena keduanya punya **nilai kebenaran** yang pasti.\n\nKalimat seperti "Kalimat ini salah" terkenal justru karena ia **bukan** pernyataan: menyebutnya benar membuatnya salah, dan menyebutnya salah membuatnya benar. Tak ada isi kursus ini yang serumit itu, tetapi itulah sebabnya definisinya bersikeras pada "satu dan hanya satu" nilai kebenaran, bukan sekadar "ada" nilai kebenaran.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which of these **is** a statement?',
                id: 'Manakah dari berikut ini yang **merupakan** pernyataan?',
              },
              options: [
                { en: 'Please sit down.', id: 'Silakan duduk.' },
                { en: 'Is $7$ a prime number?', id: 'Apakah $7$ bilangan prima?' },
                { en: 'Every prime number greater than 2 is odd.', id: 'Setiap bilangan prima lebih dari 2 adalah ganjil.' },
                { en: 'What a difficult problem!', id: 'Betapa sulitnya soal ini!' },
              ],
              answer: 2,
              explain: {
                en: 'It is the only declarative sentence in the list, and it can be judged true or false outright (it happens to be true). A command, a question, and an exclamation carry no truth value at all.',
                id: 'Ia satu-satunya kalimat berita dalam daftar, dan bisa langsung dinilai benar atau salah (kebetulan ia benar). Perintah, pertanyaan, dan kalimat seru sama sekali tak punya nilai kebenaran.',
              },
              hint: {
                en: 'First rule out anything that asks, orders, or exclaims — only a declarative sentence is even a candidate. Then check that the one left over can already be judged true or false.',
                id: 'Singkirkan dulu semua yang bertanya, memerintah, atau berseru — hanya kalimat berita yang jadi kandidat. Lalu periksa apakah yang tersisa sudah bisa dinilai benar atau salah.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'What is the truth value of the statement $p$: "$12$ is divisible by $5$"?',
                id: 'Apa nilai kebenaran pernyataan $p$: "$12$ habis dibagi $5$"?',
              },
              options: [
                { en: 'True', id: 'Benar' },
                { en: 'False', id: 'Salah' },
                { en: 'Neither — it depends on context', id: 'Bukan keduanya — tergantung konteks' },
                { en: 'It is not a statement at all', id: 'Ia bukan pernyataan sama sekali' },
              ],
              answer: 1,
              explain: {
                en: '$12 \\div 5 = 2.4$, not a whole number, so the claim is false. It is still a full statement — a false one is exactly as much a statement as a true one.',
                id: '$12 \\div 5 = 2{,}4$, bukan bilangan bulat, jadi klaimnya salah. Ia tetap pernyataan lengkap — yang salah sama-sama pernyataan dengan yang benar.',
              },
              hint: {
                en: 'Actually divide 12 by 5 and see whether the result is a whole number. That settles it — a statement about specific numbers is never "it depends".',
                id: 'Bagilah 12 dengan 5 dan lihat apakah hasilnya bilangan bulat. Itu sudah menentukan semuanya — pernyataan tentang bilangan tertentu tak pernah "tergantung".',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the definition of a statement.',
                id: 'Lengkapi definisi pernyataan.',
              },
              template: {
                en: 'A statement is a declarative sentence that is either ___ or ___, but never both at once.',
                id: 'Pernyataan adalah kalimat berita yang bernilai ___ atau ___, tetapi tak pernah keduanya sekaligus.',
              },
              blanks: {
                en: ['true', 'false'],
                id: ['benar', 'salah'],
              },
              explain: {
                en: 'Exactly one of the two must hold — that is what makes a truth value definite rather than a matter of opinion.',
                id: 'Tepat satu dari keduanya harus berlaku — itulah yang membuat nilai kebenaran bersifat pasti, bukan soal pendapat.',
              },
              hint: {
                en: 'The two blanks are the only two truth values logic ever uses.',
                id: 'Kedua isian adalah dua-duanya nilai kebenaran yang pernah dipakai dalam logika.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Of these five sentences, how many are genuine statements?\n1. "$9$ is an even number."\n2. "Turn off the lights."\n3. "Semarang is a city."\n4. "$\\pi$ is greater than $3$."\n5. "Do you like mathematics?"',
                id: 'Dari lima kalimat ini, berapa banyak yang merupakan pernyataan sejati?\n1. "$9$ adalah bilangan genap."\n2. "Matikan lampunya."\n3. "Semarang adalah sebuah kota."\n4. "$\\pi$ lebih besar dari $3$."\n5. "Apakah kamu suka matematika?"',
              },
              blanks: [{ label: '\\text{Banyaknya pernyataan} =', answer: 3 }],
              hints: [
                { en: 'Rule out the command and the question first — neither is even a declarative sentence.', id: 'Singkirkan dulu perintah dan pertanyaannya — keduanya bahkan bukan kalimat berita.' },
                { en: 'Every one of the three remaining sentences already has a definite truth value.', id: 'Ketiga kalimat yang tersisa masing-masing sudah punya nilai kebenaran yang pasti.' },
              ],
              explain: {
                en: 'Sentences 1, 3 and 4 are statements (false, true, and true respectively). Sentence 2 is a command and sentence 5 is a question — neither is declarative at all. That leaves exactly 3.',
                id: 'Kalimat 1, 3, dan 4 adalah pernyataan (berturut-turut salah, benar, dan benar). Kalimat 2 perintah dan kalimat 5 pertanyaan — keduanya bahkan bukan kalimat berita. Jadi tersisa tepat 3.',
              },
            },
          ],
        },
        {
          id: 'log-m1-s1-l2',
          title: { en: 'Variables, Constants, and Parameters', id: 'Variabel, Konstanta, dan Parameter' },
          goal: {
            en: 'Tell a variable, a constant, and a parameter apart inside a symbol-filled sentence.',
            id: 'Membedakan variabel, konstanta, dan parameter di dalam sebuah kalimat yang bermuatan lambang.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A variable stands for anything; a constant stands for one thing', id: 'Variabel mewakili apa saja; konstanta mewakili satu hal saja' },
              body: {
                en: 'A **variable** is a symbol that may be replaced by any member of some set — "any number", "any student", "any day of the week". In "$x + 5 = 9$", $x$ is a variable: it can be any real number, and only some of them make the sentence true.\n\nA **constant** is a symbol whose value is fixed once and for all — it never changes as the sentence is used. In "$x + 5 = 9$", the $5$ and the $9$ are constants: they mean exactly one thing, every time. So is a named quantity like $\\pi$, or "the number of days in a week".',
                id: '**Variabel** adalah lambang yang boleh diganti oleh sembarang anggota suatu himpunan — "sembarang bilangan", "sembarang siswa", "sembarang hari dalam seminggu". Pada "$x + 5 = 9$", $x$ adalah variabel: ia bisa berupa sembarang bilangan real, dan hanya sebagian di antaranya yang membuat kalimatnya benar.\n\n**Konstanta** adalah lambang yang nilainya tetap, sekali dan untuk selamanya — ia tak pernah berubah selama kalimat itu dipakai. Pada "$x + 5 = 9$", angka $5$ dan $9$ adalah konstanta: keduanya berarti persis satu nilai, setiap saat. Begitu pula besaran bernama seperti $\\pi$, atau "banyaknya hari dalam seminggu".',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A parameter is a constant that has not chosen its value yet', id: 'Parameter adalah konstanta yang belum memilih nilainya' },
              body: {
                en: 'A **parameter** sits between the two: inside one particular sentence it behaves like a constant — fixed, not something you solve for — but across a whole **family** of sentences it is allowed to vary from one member of the family to the next. In "$ax + b = 0$", $x$ is the variable being solved for, while $a$ and $b$ are parameters: for any one equation they are fixed numbers, but writing the equation this way describes every linear equation of this shape at once, one choice of $a$ and $b$ at a time.\n\nSo the same symbol can even change role depending on what question is being asked: in "$ax + b = 0$, solve for $x$" the letters $a, b$ are parameters, but in "for which $a$ does $ax + 3 = 0$ have solution $x = 1$?" the roles of $x$ and $a$ swap — now $a$ is the unknown and $x$ is fixed.',
                id: '**Parameter** berada di antara keduanya: di dalam satu kalimat tertentu ia berperilaku seperti konstanta — tetap, bukan sesuatu yang dicari nilainya — tetapi pada seluruh **keluarga** kalimat ia boleh berubah dari satu anggota keluarga ke anggota berikutnya. Pada "$ax + b = 0$", $x$ adalah variabel yang dicari, sedangkan $a$ dan $b$ adalah parameter: untuk satu persamaan tertentu keduanya bilangan tetap, tetapi menuliskan persamaan dengan cara ini menggambarkan semua persamaan linear berbentuk demikian sekaligus, satu pilihan $a$ dan $b$ setiap kalinya.\n\nJadi lambang yang sama bahkan bisa berganti peran tergantung pertanyaan yang diajukan: pada "$ax + b = 0$, carilah $x$" huruf $a, b$ adalah parameter, tetapi pada "untuk $a$ berapakah $ax + 3 = 0$ mempunyai penyelesaian $x = 1$?" peran $x$ dan $a$ bertukar — kini $a$ yang dicari dan $x$ yang tetap.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'In the open sentence "A rectangle has a perimeter of $2p + 2l$, where $p$ and $l$ are its length and width", what are $p$ and $l$?',
                id: 'Pada kalimat terbuka "Sebuah persegi panjang berkeliling $2p + 2l$, dengan $p$ dan $l$ panjang dan lebarnya", apakah $p$ dan $l$ itu?',
              },
              options: [
                { en: 'Constants, since a rectangle always has a perimeter', id: 'Konstanta, karena persegi panjang selalu punya keliling' },
                { en: 'Parameters, since they describe every rectangle at once', id: 'Parameter, karena menggambarkan semua persegi panjang sekaligus' },
                { en: 'Variables, since they may be any positive real number', id: 'Variabel, karena boleh berupa sembarang bilangan real positif' },
                { en: 'Neither — they are not symbols at all', id: 'Bukan ketiganya — keduanya bukan lambang' },
              ],
              answer: 2,
              explain: {
                en: '$p$ and $l$ are exactly the quantities the sentence is about, free to take any value a length can — that is a variable\'s role, not a fixed or family-defining one.',
                id: '$p$ dan $l$ justru besaran yang dibicarakan kalimatnya, bebas mengambil nilai apa pun yang mungkin untuk suatu panjang — itulah peran variabel, bukan peran yang tetap atau yang mendefinisikan sebuah keluarga.',
              },
              hint: {
                en: 'Ask what role $p$ and $l$ actually play here: are they fixed once and for all, do they merely index a family of sentences, or are they exactly the quantities the sentence lets range freely?',
                id: 'Tanyakan peran apa yang sebenarnya dimainkan $p$ dan $l$ di sini: apakah keduanya tetap sekali untuk selamanya, sekadar menandai sebuah keluarga kalimat, atau justru besaran yang dibiarkan bebas oleh kalimatnya?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'In "$mx + 3 = 7$, solve for $x$", what is $m$?',
                id: 'Pada "$mx + 3 = 7$, carilah $x$", apakah $m$ itu?',
              },
              options: [
                { en: 'A variable, the one being solved for', id: 'Variabel, yang sedang dicari' },
                { en: 'A parameter, fixed for this equation but different for another one', id: 'Parameter, tetap untuk persamaan ini tetapi berbeda untuk persamaan lain' },
                { en: 'A constant identical to the number 3', id: 'Konstanta yang sama dengan angka 3' },
                { en: 'Not a symbol used in the sentence', id: 'Bukan lambang yang dipakai dalam kalimat' },
              ],
              answer: 1,
              explain: {
                en: 'The sentence asks to solve for $x$, so $m$ is held fixed for the purposes of this one equation — but a different value of $m$ gives a genuinely different equation, which is exactly what makes it a parameter rather than a plain constant like the $3$ or the $7$.',
                id: 'Kalimatnya meminta mencari $x$, jadi $m$ dianggap tetap untuk keperluan persamaan ini — tetapi nilai $m$ yang lain memberi persamaan yang sungguh berbeda, dan itulah yang membuatnya parameter, bukan sekadar konstanta seperti $3$ atau $7$.',
              },
              hint: {
                en: 'The sentence names what is being solved for. Everything else that is a plain, unchanging number is a constant — but does $m$ behave like the $3$ and the $7$, or could a different choice of it give a different equation?',
                id: 'Kalimatnya menyebut apa yang sedang dicari. Segala yang lain yang berupa bilangan tetap dan tak berubah adalah konstanta — tetapi apakah $m$ berperilaku seperti $3$ dan $7$, atau pilihan lain untuknya bisa memberi persamaan yang berbeda?',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the three roles a symbol can play in a sentence.',
                id: 'Lengkapi tiga peran yang bisa dimainkan sebuah lambang dalam kalimat.',
              },
              template: {
                en: 'A ___ may stand for any member of a set; a ___ has one fixed value that never changes; a ___ is fixed within one sentence but varies from one member of a family of sentences to the next.',
                id: 'Sebuah ___ boleh mewakili sembarang anggota suatu himpunan; sebuah ___ punya satu nilai tetap yang tak pernah berubah; sebuah ___ tetap dalam satu kalimat tetapi berubah dari satu anggota keluarga kalimat ke anggota berikutnya.',
              },
              blanks: {
                en: ['variable', 'constant', 'parameter'],
                id: ['variabel', 'konstanta', 'parameter'],
              },
              explain: {
                en: 'Variable, constant, parameter — in order of how much freedom the symbol has: fully free, fully fixed, and fixed-but-only-for-now.',
                id: 'Variabel, konstanta, parameter — berurutan menurut seberapa bebas lambangnya: sepenuhnya bebas, sepenuhnya tetap, dan tetap-tapi-hanya-untuk-sementara.',
              },
              hint: {
                en: 'Order them from most free to most fixed, with the middling one — fixed for now, but able to differ from case to case — in between.',
                id: 'Urutkan dari yang paling bebas ke yang paling tetap, dengan yang di tengah — tetap untuk saat ini, tetapi bisa berbeda dari kasus ke kasus — berada di antaranya.',
              },
            },
          ],
        },
        {
          id: 'log-m1-s1-l3',
          title: { en: 'Open and Closed Sentences', id: 'Kalimat Terbuka dan Kalimat Tertutup' },
          goal: {
            en: 'Find the solution set of an open sentence over a given domain, and see why closing it makes a statement.',
            id: 'Menentukan himpunan penyelesaian kalimat terbuka pada suatu semesta, dan melihat mengapa menutupnya menghasilkan pernyataan.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Open until the variable is pinned down', id: 'Terbuka sampai variabelnya dipastikan' },
              body: {
                en: 'A sentence with a free variable in it, like "$x + 5 = 9$" or "he is a student of SMA 1", is called an **open sentence**: it is neither true nor false as it stands. Substitute $x = 4$ and it becomes the true statement "$4 + 5 = 9$"; substitute $x = 1$ and it becomes the false statement "$1 + 5 = 9$". Fixing the variable **closes** the sentence — turns it into an ordinary statement — which is why a statement is sometimes called a **closed sentence**.\n\nThe set every substitution is drawn from is the open sentence\'s **domain** (or **semesta pembicaraan**, universe of discourse); the set of substitutions that make it true is its **solution set**.',
                id: 'Kalimat yang mengandung variabel bebas, seperti "$x + 5 = 9$" atau "dia siswa SMA 1", disebut **kalimat terbuka**: ia belum benar atau salah sebagaimana adanya. Substitusikan $x = 4$ dan ia menjadi pernyataan benar "$4 + 5 = 9$"; substitusikan $x = 1$ dan ia menjadi pernyataan salah "$1 + 5 = 9$". Memastikan nilai variabelnya **menutup** kalimatnya — mengubahnya menjadi pernyataan biasa — itulah sebabnya pernyataan kadang disebut **kalimat tertutup**.\n\nHimpunan tempat setiap substitusi diambil disebut **semesta pembicaraan** (domain) kalimat terbukanya; himpunan substitusi yang membuatnya benar disebut **himpunan penyelesaiannya**.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Reading a solution set off a small domain', id: 'Membaca himpunan penyelesaian pada semesta kecil' },
              body: {
                en: 'Take the open sentence "$x$ is a prime number" with domain $\\{2, 3, 4, 5, 6, 7\\}$. Substituting each member in turn gives a statement: true for $2, 3, 5, 7$ and false for $4, 6$. The solution set is $\\{2, 3, 5, 7\\}$ — a subset of the domain, not necessarily all of it and not necessarily none of it.\n\nTwo extremes are worth naming: if every member of the domain makes the sentence true, the solution set equals the whole domain; if none does, the solution set is empty, $\\emptyset$.',
                id: 'Ambil kalimat terbuka "$x$ bilangan prima" dengan semesta $\\{2, 3, 4, 5, 6, 7\\}$. Mensubstitusikan tiap anggotanya menghasilkan pernyataan: benar untuk $2, 3, 5, 7$ dan salah untuk $4, 6$. Himpunan penyelesaiannya adalah $\\{2, 3, 5, 7\\}$ — himpunan bagian dari semesta, tak harus seluruhnya dan tak harus kosong.\n\nDua kasus ekstrem layak disebut: bila setiap anggota semesta membuat kalimatnya benar, himpunan penyelesaiannya sama dengan seluruh semesta; bila tak satu pun membuatnya benar, himpunan penyelesaiannya kosong, $\\emptyset$.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which of these is an **open** sentence?',
                id: 'Manakah dari berikut ini yang merupakan kalimat **terbuka**?',
              },
              options: [
                { en: '$7 + 2 = 9$', id: '$7 + 2 = 9$' },
                { en: '$n$ is a factor of $20$', id: '$n$ adalah faktor dari $20$' },
                { en: 'Surabaya is in East Java', id: 'Surabaya ada di Jawa Timur' },
                { en: '$3 \\times 4 = 15$', id: '$3 \\times 4 = 15$' },
              ],
              answer: 1,
              explain: {
                en: 'Only this one has a free variable ($n$) whose value has not been fixed — until it is, the sentence is neither true nor false. The other three are already closed, with a definite truth value each.',
                id: 'Hanya kalimat ini yang memiliki variabel bebas ($n$) yang nilainya belum dipastikan — sebelum dipastikan, kalimatnya belum benar maupun salah. Ketiga lainnya sudah tertutup, masing-masing dengan nilai kebenaran yang pasti.',
              },
              hint: {
                en: 'Look for a letter standing for an unfixed value. A sentence with only numbers and named places already has a definite truth value, open or not.',
                id: 'Cari huruf yang mewakili nilai yang belum dipastikan. Kalimat yang hanya berisi bilangan dan nama tempat sudah punya nilai kebenaran yang pasti, terbuka atau tidak.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'The open sentence "$x^2 = 9$" has domain $\\{-3, -2, 0, 3\\}$. What is its solution set?',
                id: 'Kalimat terbuka "$x^2 = 9$" bersemesta $\\{-3, -2, 0, 3\\}$. Apa himpunan penyelesaiannya?',
              },
              options: [
                { en: '$\\{3\\}$', id: '$\\{3\\}$' },
                { en: '$\\{-3, 3\\}$', id: '$\\{-3, 3\\}$' },
                { en: '$\\{-3, -2, 0, 3\\}$', id: '$\\{-3, -2, 0, 3\\}$' },
                { en: '$\\emptyset$', id: '$\\emptyset$' },
              ],
              answer: 1,
              explain: {
                en: 'Test every member of the domain: $(-3)^2 = 9$ true, $(-2)^2 = 4$ false, $0^2 = 0$ false, $3^2 = 9$ true. The solution set collects exactly the members that work: $\\{-3, 3\\}$.',
                id: 'Uji tiap anggota semestanya: $(-3)^2 = 9$ benar, $(-2)^2 = 4$ salah, $0^2 = 0$ salah, $3^2 = 9$ benar. Himpunan penyelesaiannya mengumpulkan persis anggota yang berhasil: $\\{-3, 3\\}$.',
              },
              hint: {
                en: 'Substitute every single member of the domain in turn and square it. The solution set keeps only the ones that actually give 9 — nothing outside the domain can join it.',
                id: 'Substitusikan setiap anggota semestanya satu per satu lalu kuadratkan. Himpunan penyelesaiannya hanya menyimpan yang benar-benar menghasilkan 9 — tak ada yang di luar semesta bisa ikut bergabung.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Put these steps in order for finding the solution set of "$x$ is even" over the domain $\\{1, 2, 3, 4, 5\\}$.',
                id: 'Susun langkah-langkah ini dengan urutan yang benar untuk mencari himpunan penyelesaian "$x$ genap" pada semesta $\\{1, 2, 3, 4, 5\\}$.',
              },
              lines: {
                en: [
                  'List the domain the variable may be substituted from: {1, 2, 3, 4, 5}.',
                  'Substitute each member in turn and judge the resulting statement true or false.',
                  '1 → false, 2 → true, 3 → false, 4 → true, 5 → false.',
                  'Collect the members that gave a true statement into the solution set: {2, 4}.',
                ],
                id: [
                  'Daftar semesta tempat variabelnya boleh disubstitusi: {1, 2, 3, 4, 5}.',
                  'Substitusikan tiap anggota satu per satu dan nilai pernyataan yang dihasilkan, benar atau salah.',
                  '1 → salah, 2 → benar, 3 → salah, 4 → benar, 5 → salah.',
                  'Kumpulkan anggota yang menghasilkan pernyataan benar ke dalam himpunan penyelesaian: {2, 4}.',
                ],
              },
              explain: {
                en: 'Every solution-set problem follows this same order: fix the domain, test every member, then keep only the ones that pass.',
                id: 'Setiap soal himpunan penyelesaian mengikuti urutan yang sama: pastikan semestanya, uji setiap anggota, lalu simpan hanya yang lolos.',
              },
              hint: {
                en: 'You cannot test a member before you know the domain, and you cannot collect the solution set before every member has been tested.',
                id: 'Kamu tak bisa menguji sebuah anggota sebelum tahu semestanya, dan tak bisa mengumpulkan himpunan penyelesaian sebelum semua anggota diuji.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'The open sentence "$x$ is a multiple of $3$" has domain $\\{1, 2, 3, \\ldots, 12\\}$. How many members are in its solution set?',
                id: 'Kalimat terbuka "$x$ kelipatan $3$" bersemesta $\\{1, 2, 3, \\ldots, 12\\}$. Berapa banyak anggota himpunan penyelesaiannya?',
              },
              blanks: [{ answer: 4 }],
              hints: [
                { en: 'List the multiples of 3 that actually fall inside the domain.', id: 'Daftar kelipatan 3 yang benar-benar berada di dalam semestanya.' },
                { en: 'They are 3, 6, 9, and 12.', id: 'Yaitu 3, 6, 9, dan 12.' },
              ],
              explain: {
                en: 'The multiples of 3 from 1 to 12 are 3, 6, 9, 12 — four members.',
                id: 'Kelipatan 3 dari 1 sampai 12 adalah 3, 6, 9, 12 — empat anggota.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'log-m1-s1-p',
        runtime: 'math',
        title: { en: 'Vocabulary and Open Sentences', id: 'Kosakata dan Kalimat Terbuka' },
        brief: {
          en: 'Three short checks on the language of logic and on finding a solution set.',
          id: 'Tiga pengecekan singkat tentang bahasa logika dan tentang mencari himpunan penyelesaian.',
        },
        requirements: [
          { en: 'Every box has to be right before a part counts as answered.', id: 'Setiap kotak harus benar sebelum satu butir dihitung terjawab.' },
          { en: 'Work through every case before answering — the answer is a sum, not a count, so it will not fall out of a lucky guess.', id: 'Kerjakan setiap kasus sebelum menjawab — jawabannya adalah jumlah, bukan banyaknya, jadi tak akan keluar dari tebakan yang kebetulan.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'Of these six numbered sentences, what is the sum of the numbers of the ones that are genuine statements?\n1. "$2$ is a prime number."\n2. "$y - 3 = 10$."\n3. "Please stand up."\n4. "The Earth has one moon."\n5. "Is water wet?"\n6. "$\\pi$ is irrational."',
              id: 'Dari enam kalimat bernomor ini, berapa jumlah nomor-nomor dari kalimat yang merupakan pernyataan sejati?\n1. "$2$ adalah bilangan prima."\n2. "$y - 3 = 10$."\n3. "Silakan berdiri."\n4. "Bumi memiliki satu bulan."\n5. "Apakah air itu basah?"\n6. "$\\pi$ irasional."',
            },
            blanks: [{ answer: 11 }],
            solution: [
              '\\text{Pernyataan sejati: nomor 1, 4, dan 6 (ketiganya benar); nomor 2 kalimat terbuka, nomor 3 perintah, nomor 5 pertanyaan.}',
              '1 + 4 + 6 = 11.',
            ],
          },
          {
            prompt: {
              en: 'How many parameters appear across these three equations altogether: $ax + b = 0$, $x^2 + px + q = 0$, and $mx + c = 5$ (solve for $x$ in each)?',
              id: 'Berapa banyak parameter yang muncul seluruhnya pada ketiga persamaan ini: $ax + b = 0$, $x^2 + px + q = 0$, dan $mx + c = 5$ (carilah $x$ pada masing-masing)?',
            },
            blanks: [{ answer: 6 }],
            solution: ['\\text{Setiap persamaan punya dua parameter (tetap untuk satu persamaan, berbeda dari persamaan lain): }a,b\\text{; }p,q\\text{; }m,c\\text{ — enam seluruhnya.}'],
          },
          {
            prompt: {
              en: 'The open sentence "$x$ is a factor of $18$" has domain $\\{1, 2, \\ldots, 9\\}$. What is the sum of the members of its solution set?',
              id: 'Kalimat terbuka "$x$ faktor dari $18$" bersemesta $\\{1, 2, \\ldots, 9\\}$. Berapa jumlah anggota himpunan penyelesaiannya?',
            },
            blanks: [{ answer: 21 }],
            solution: ['\\text{Faktor dari 18 yang berada di dalam semesta }\\{1,\\ldots,9\\}\\text{ adalah }1, 2, 3, 6, 9.', '1+2+3+6+9 = 21.'],
          },
        ],
        hints: [
          {
            en: 'For part 3, list every factor of 18 first, throw out the ones outside the given domain, and only then add up what is left.',
            id: 'Untuk butir 3, daftar dulu semua faktor dari 18, buang yang berada di luar semesta yang diberikan, dan baru jumlahkan yang tersisa.',
          },
        ],
        xp: 50,
      },
    },

    /* ------------------------------------------ 1.2 negation, and, or */
    {
      id: 'log-m1-s2',
      title: { en: 'Negation, Conjunction, and Disjunction', id: 'Negasi, Konjungsi, dan Disjungsi' },
      summary: {
        en: 'The first three connectives: "not", "and", and "or", each with the truth table that defines it.',
        id: 'Tiga kata hubung pertama: "tidak", "dan", dan "atau", masing-masing dengan tabel kebenaran yang mendefinisikannya.',
      },
      lessons: [
        {
          id: 'log-m1-s2-l1',
          title: { en: 'Negation', id: 'Negasi' },
          goal: {
            en: 'Write and evaluate the negation of a statement, and use the double-negation law.',
            id: 'Menuliskan dan menilai ingkaran suatu pernyataan, serta memakai hukum ingkaran ganda.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Flipping the truth value', id: 'Membalik nilai kebenaran' },
              body: {
                en: 'The **negation** (or **ingkaran**, **penyangkalan**) of a statement $p$, written $\\neg p$ (read "not $p$"), is the statement "it is not the case that $p$". Negation does exactly one thing: it flips the truth value. If $p$ is true, $\\neg p$ is false; if $p$ is false, $\\neg p$ is true.\n$$\\begin{array} p & \\neg p \\\\\\\\ B & S \\\\\\\\ S & B \\end{array}$$\nHere $B$ stands for **benar** (true) and $S$ for **salah** (false) — the two letters you will see filling every truth table from here on.',
                id: '**Negasi** (atau **ingkaran**, **penyangkalan**) dari pernyataan $p$, ditulis $\\neg p$ (dibaca "tidak $p$" atau "bukan $p$"), adalah pernyataan "tidaklah benar bahwa $p$". Negasi melakukan tepat satu hal: membalik nilai kebenarannya. Jika $p$ benar, $\\neg p$ salah; jika $p$ salah, $\\neg p$ benar.\n$$\\begin{array} p & \\neg p \\\\\\\\ B & S \\\\\\\\ S & B \\end{array}$$\nDi sini $B$ berarti **benar** dan $S$ berarti **salah** — dua huruf yang akan kamu lihat mengisi setiap tabel kebenaran mulai sekarang.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Negating carefully', id: 'Mengingkar dengan hati-hati' },
              body: {
                en: 'Negating is not the same as picking an opposite-sounding word. The negation of "the door is open" is "the door is **not** open" — not "the door is closed", even though the two happen to agree here. The difference shows up with numbers: the negation of "$x \\geq 5$" is "$x < 5$", not "$x \\leq 5$" or "$x = 5$" — get the boundary wrong and the negation is wrong.\n\nNegating twice undoes itself — the **double negation law**:\n$$\\neg(\\neg p) \\equiv p$$\n"It is not the case that it is not raining" means exactly "it is raining".',
                id: 'Mengingkar bukan sekadar memilih kata yang kedengarannya berlawanan. Ingkaran dari "pintunya terbuka" adalah "pintunya **tidak** terbuka" — bukan "pintunya tertutup", meski kebetulan keduanya cocok di sini. Bedanya tampak jelas pada bilangan: ingkaran dari "$x \\geq 5$" adalah "$x < 5$", bukan "$x \\leq 5$" atau "$x = 5$" — salah menentukan batasnya, ingkarannya pun salah.\n\nMengingkar dua kali membatalkan dirinya sendiri — **hukum ingkaran ganda**:\n$$\\neg(\\neg p) \\equiv p$$\n"Tidaklah benar bahwa tidak sedang hujan" berarti persis "sedang hujan".',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is the correct negation of $p$: "$x \\leq 3$"?',
                id: 'Apa ingkaran yang benar dari $p$: "$x \\leq 3$"?',
              },
              options: [
                { en: '$x \\geq 3$', id: '$x \\geq 3$' },
                { en: '$x < 3$', id: '$x < 3$' },
                { en: '$x > 3$', id: '$x > 3$' },
                { en: '$x = 3$', id: '$x = 3$' },
              ],
              answer: 2,
              explain: {
                en: 'Every value of $x$ must land in either $p$ or $\\neg p$, never both. "$x \\leq 3$" already covers everything up to and including 3, so its negation must cover exactly what is left over: everything strictly greater than 3.',
                id: 'Setiap nilai $x$ harus jatuh ke $p$ atau $\\neg p$, tak pernah keduanya. "$x \\leq 3$" sudah mencakup semua nilai sampai dan termasuk 3, jadi ingkarannya harus mencakup persis sisanya: semua yang lebih besar dari 3.',
              },
              hint: {
                en: 'Every real number must satisfy exactly one of $p$ or its negation — never both, never neither. Which option leaves no number uncovered and no number double-covered with "$x \\leq 3$"?',
                id: 'Setiap bilangan real harus memenuhi tepat satu di antara $p$ atau ingkarannya — tak pernah keduanya, tak pernah bukan keduanya. Pilihan mana yang tidak menyisakan bilangan yang tak tercakup dan tidak pula tercakup ganda bersama "$x \\leq 3$"?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'The statement $p$: "Bandung is in West Java" is true. What is the truth value of $\\neg(\\neg p)$?',
                id: 'Pernyataan $p$: "Bandung ada di Jawa Barat" bernilai benar. Apa nilai kebenaran $\\neg(\\neg p)$?',
              },
              options: [
                { en: 'True', id: 'Benar' },
                { en: 'False', id: 'Salah' },
                { en: 'Cannot be determined', id: 'Tak dapat ditentukan' },
                { en: 'Neither true nor false', id: 'Bukan benar maupun salah' },
              ],
              answer: 0,
              explain: {
                en: 'By the double-negation law, $\\neg(\\neg p) \\equiv p$, and $p$ is true — so negating it twice lands right back on true.',
                id: 'Menurut hukum ingkaran ganda, $\\neg(\\neg p) \\equiv p$, dan $p$ benar — jadi mengingkar dua kali kembali lagi ke benar.',
              },
              hint: {
                en: 'Negate once to flip $p$\'s truth value, then negate that result once more. Where do you land after two flips?',
                id: 'Ingkar sekali untuk membalik nilai kebenaran $p$, lalu ingkar sekali lagi hasilnya. Di mana kamu berakhir setelah dua kali membalik?',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Put these lines in the right order to fill in a truth table for $\\neg(\\neg p)$, from the header down.',
                id: 'Susun baris-baris ini dengan urutan yang benar untuk mengisi tabel kebenaran $\\neg(\\neg p)$, dari judul kolom ke bawah.',
              },
              lines: {
                en: [
                  '\\begin{array} p & \\neg p & \\neg(\\neg p) \\end{array}',
                  '\\begin{array} B & S & B \\end{array}',
                  '\\begin{array} S & B & S \\end{array}',
                ],
                id: [
                  '\\begin{array} p & \\neg p & \\neg(\\neg p) \\end{array}',
                  '\\begin{array} B & S & B \\end{array}',
                  '\\begin{array} S & B & S \\end{array}',
                ],
              },
              explain: {
                en: 'Row 1: $p$ true makes $\\neg p$ false, which makes $\\neg(\\neg p)$ true again. Row 2: $p$ false makes $\\neg p$ true, which makes $\\neg(\\neg p)$ false again — the table for $\\neg(\\neg p)$ matches the table for $p$ exactly, row for row.',
                id: 'Baris 1: $p$ benar membuat $\\neg p$ salah, yang membuat $\\neg(\\neg p)$ benar lagi. Baris 2: $p$ salah membuat $\\neg p$ benar, yang membuat $\\neg(\\neg p)$ salah lagi — tabel untuk $\\neg(\\neg p)$ persis sama dengan tabel untuk $p$, baris demi baris.',
              },
              hint: {
                en: 'The header always comes first. After that, work top to bottom: start with $p$ true, flip it once for the middle column, then flip that once more for the last column.',
                id: 'Judul kolom selalu di baris pertama. Setelahnya, kerjakan dari atas ke bawah: mulai dari $p$ benar, balik sekali untuk kolom tengah, lalu balik sekali lagi untuk kolom terakhir.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'The statement $q$ is false. Evaluate $\\neg(\\neg(\\neg q))$. (Type 1 for true, 0 for false.)',
                id: 'Pernyataan $q$ bernilai salah. Tentukan nilai $\\neg(\\neg(\\neg q))$. (Ketik 1 untuk benar, 0 untuk salah.)',
              },
              blanks: [{ label: '\\neg(\\neg(\\neg q)) =', answer: 1 }],
              hints: [
                { en: 'Flip the truth value once for every $\\neg$, one at a time, starting from $q$ itself.', id: 'Balik nilai kebenarannya satu kali untuk setiap $\\neg$, satu per satu, mulai dari $q$ sendiri.' },
                { en: 'Three flips is an odd number of flips — it cannot land back where it started.', id: 'Tiga kali membalik adalah bilangan ganjil kali — tak mungkin kembali ke titik semula.' },
              ],
              explain: {
                en: '$q$ is false, so $\\neg q$ is true, $\\neg(\\neg q)$ is false, and $\\neg(\\neg(\\neg q))$ is true — three flips of "false" land on "true", exactly like $\\neg q$ alone does.',
                id: '$q$ salah, jadi $\\neg q$ benar, $\\neg(\\neg q)$ salah, dan $\\neg(\\neg(\\neg q))$ benar — tiga kali membalik dari "salah" berakhir di "benar", persis seperti $\\neg q$ saja.',
              },
            },
          ],
        },
        {
          id: 'log-m1-s2-l2',
          title: { en: 'Conjunction: p ∧ q', id: 'Konjungsi: p ∧ q' },
          goal: {
            en: 'Build and read the truth table for "p and q".',
            id: 'Menyusun dan membaca tabel kebenaran untuk "p dan q".',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Both, or it fails', id: 'Keduanya, atau gagal' },
              body: {
                en: 'The **conjunction** of $p$ and $q$, written $p \\land q$ (read "$p$ and $q$"), is the statement that both hold at once. It matches how "and" already works in everyday speech: "It is raining and it is cold" is only true when both halves are true.\n$$\\begin{array} p & q & p \\land q \\\\\\\\ B & B & B \\\\\\\\ B & S & S \\\\\\\\ S & B & S \\\\\\\\ S & S & S \\end{array}$$\nOnly the very first row comes out true. A single false half is enough to make the whole conjunction false — a table worth memorising, since every other connective in this course is compared against it.',
                id: '**Konjungsi** dari $p$ dan $q$, ditulis $p \\land q$ (dibaca "$p$ dan $q$"), adalah pernyataan bahwa keduanya berlaku sekaligus. Ini sesuai dengan makna "dan" dalam percakapan sehari-hari: "Hari ini hujan dan dingin" hanya benar bila kedua bagiannya benar.\n$$\\begin{array} p & q & p \\land q \\\\\\\\ B & B & B \\\\\\\\ B & S & S \\\\\\\\ S & B & S \\\\\\\\ S & S & S \\end{array}$$\nHanya baris pertama yang bernilai benar. Satu saja bagian yang salah sudah cukup membuat seluruh konjungsinya salah — tabel yang layak dihafal, karena setiap penghubung lain dalam kursus ini dibandingkan dengannya.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Why every row has to be checked', id: 'Mengapa setiap baris harus diperiksa' },
              body: {
                en: 'With two simple statements there are $2 \\times 2 = 4$ possible combinations of true and false — one row per combination, and no row is optional. With three simple statements there would be $2^3 = 8$ rows, since a third statement doubles the combinations again.\n\nA truth table is exhaustive on purpose: it settles a compound statement\'s value for every possible case, once and for all, rather than for whichever case happens to come to mind.',
                id: 'Dengan dua pernyataan sederhana ada $2 \\times 2 = 4$ kemungkinan kombinasi benar dan salah — satu baris untuk tiap kombinasi, dan tak satu pun baris boleh dilewati. Dengan tiga pernyataan sederhana akan ada $2^3 = 8$ baris, karena pernyataan ketiga menggandakan lagi kombinasinya.\n\nTabel kebenaran memang dibuat menyeluruh: ia menetapkan nilai pernyataan majemuk untuk setiap kemungkinan kasus, sekali untuk selamanya, bukan hanya untuk kasus yang kebetulan terpikirkan.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: '$p$: "$6$ is even" is true. $q$: "$6$ is prime" is false. What is $p \\land q$?',
                id: '$p$: "$6$ genap" benar. $q$: "$6$ prima" salah. Apa nilai $p \\land q$?',
              },
              options: [
                { en: 'True', id: 'Benar' },
                { en: 'False', id: 'Salah' },
                { en: 'Cannot be determined', id: 'Tak dapat ditentukan' },
                { en: 'Neither true nor false', id: 'Bukan benar maupun salah' },
              ],
              answer: 1,
              explain: {
                en: 'A conjunction needs both halves true. $q$ is false here, so $p \\land q$ is false regardless of $p$ — this is the second row of the table.',
                id: 'Konjungsi butuh kedua bagiannya benar. Di sini $q$ salah, jadi $p \\land q$ salah, apa pun nilai $p$ — inilah baris kedua tabelnya.',
              },
              hint: {
                en: 'A conjunction is true in exactly one row of its table. Check whether both $p$ and $q$ land on true here.',
                id: 'Konjungsi benar tepat pada satu baris tabelnya. Periksa apakah $p$ dan $q$ sama-sama jatuh pada benar di sini.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'The compound statement "$4 > 1$ and $4 > 10$" is:',
                id: 'Pernyataan majemuk "$4 > 1$ dan $4 > 10$" adalah:',
              },
              options: [
                { en: 'True, since one half is true', id: 'Benar, karena satu bagian benar' },
                { en: 'False, since one half is false', id: 'Salah, karena satu bagian salah' },
                { en: 'True, since both halves compare 4', id: 'Benar, karena kedua bagian membandingkan 4' },
                { en: 'Not a statement', id: 'Bukan pernyataan' },
              ],
              answer: 1,
              explain: {
                en: '$4 > 1$ is true but $4 > 10$ is false, and a conjunction with even one false half is false — "and" gives no partial credit.',
                id: '$4 > 1$ benar tetapi $4 > 10$ salah, dan konjungsi dengan satu saja bagian yang salah adalah salah — "dan" tidak memberi nilai sebagian.',
              },
              hint: {
                en: 'Check each half of the conjunction on its own, as its own true-or-false claim, before combining them.',
                id: 'Periksa tiap bagian konjungsinya sendiri-sendiri, sebagai klaim benar-atau-salahnya masing-masing, sebelum menggabungkannya.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the count of rows a truth table needs.',
                id: 'Lengkapi banyaknya baris yang dibutuhkan sebuah tabel kebenaran.',
              },
              template: 'A truth table for 3 simple statements needs ___ rows.',
              blanks: ['8'],
              explain: {
                en: 'Each additional simple statement doubles the number of combinations: $2, 4, 8, 16, \\ldots$ for $1, 2, 3, 4, \\ldots$ statements — that is $2^3 = 8$.',
                id: 'Setiap tambahan satu pernyataan sederhana menggandakan banyaknya kombinasi: $2, 4, 8, 16, \\ldots$ untuk $1, 2, 3, 4, \\ldots$ pernyataan — itulah $2^3 = 8$.',
              },
              hint: {
                en: 'Two simple statements need 4 rows, since $2^2 = 4$. Follow the same pattern one statement further.',
                id: 'Dua pernyataan sederhana butuh 4 baris, karena $2^2 = 4$. Ikuti pola yang sama satu pernyataan lebih jauh.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: '$p$: "$15$ is odd" and $q$: "$15$ is a multiple of $5$". Evaluate $p \\land q$. (Type 1 for true, 0 for false.)',
                id: '$p$: "$15$ ganjil" dan $q$: "$15$ kelipatan $5$". Tentukan nilai $p \\land q$. (Ketik 1 untuk benar, 0 untuk salah.)',
              },
              blanks: [{ label: 'p \\land q =', answer: 1 }],
              hints: [
                { en: 'Work out the truth value of $p$ and of $q$ separately first.', id: 'Tentukan dulu nilai kebenaran $p$ dan $q$ secara terpisah.' },
                { en: '15 is odd, and $15 \\div 5 = 3$ with nothing left over.', id: '15 ganjil, dan $15 \\div 5 = 3$ tanpa sisa.' },
              ],
              explain: {
                en: '$p$ is true (15 is odd) and $q$ is true (15 is a multiple of 5), so both halves hold and $p \\land q$ is true.',
                id: '$p$ benar (15 ganjil) dan $q$ benar (15 kelipatan 5), jadi kedua bagiannya berlaku dan $p \\land q$ benar.',
              },
            },
          ],
        },
        {
          id: 'log-m1-s2-l3',
          title: { en: 'Disjunction: p ∨ q', id: 'Disjungsi: p ∨ q' },
          goal: {
            en: 'Build and read the truth table for "p or q", and see how it differs from conjunction.',
            id: 'Menyusun dan membaca tabel kebenaran untuk "p atau q", dan melihat bedanya dengan konjungsi.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'At least one is enough', id: 'Cukup salah satu' },
              body: {
                en: 'The **disjunction** of $p$ and $q$, written $p \\lor q$ (read "$p$ or $q$"), is the statement that at least one of the two holds — possibly both. This is the **inclusive** or of mathematics, not the "one or the other, not both" of a restaurant menu.\n$$\\begin{array} p & q & p \\lor q \\\\\\\\ B & B & B \\\\\\\\ B & S & B \\\\\\\\ S & B & B \\\\\\\\ S & S & S \\end{array}$$\nOnly the last row is false: $p \\lor q$ fails only when both halves fail. Everywhere at least one half is true, the disjunction is true — the mirror image of conjunction\'s single true row.',
                id: '**Disjungsi** dari $p$ dan $q$, ditulis $p \\lor q$ (dibaca "$p$ atau $q$"), adalah pernyataan bahwa setidaknya satu dari keduanya berlaku — boleh jadi keduanya sekaligus. Inilah "atau" **inklusif** dalam matematika, bukan "salah satu saja, tidak keduanya" seperti pada menu restoran.\n$$\\begin{array} p & q & p \\lor q \\\\\\\\ B & B & B \\\\\\\\ B & S & B \\\\\\\\ S & B & B \\\\\\\\ S & S & S \\end{array}$$\nHanya baris terakhir yang salah: $p \\lor q$ gagal hanya bila kedua bagiannya gagal. Di mana pun setidaknya satu bagian benar, disjungsinya benar — bayangan cermin dari konjungsi yang hanya satu baris bernilai benar.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Everyday "or" is sometimes exclusive', id: '"Atau" sehari-hari kadang eksklusif' },
              body: {
                en: 'A menu that says "soup or salad" usually means pick exactly one, not both — that everyday sense is called **exclusive or**, and mathematics gives it its own symbol ($p \\veebar q$) precisely because $\\lor$ already means something else. Unless a problem says otherwise, "$p$ or $q$" in this course is always the inclusive $\\lor$ above: "$x > 0$ or $x$ is an integer" is true for $x = -3$, since $-3$ is an integer even though it is not positive, and it stays true for $x = 5$, where both halves happen to hold.',
                id: 'Menu yang bertuliskan "sup atau salad" biasanya berarti pilih tepat satu, bukan keduanya — makna sehari-hari itu disebut **atau eksklusif**, dan matematika memberinya lambang sendiri ($p \\veebar q$) justru karena $\\lor$ sudah berarti hal lain. Kecuali sebuah soal menyatakan lain, "$p$ atau $q$" dalam kursus ini selalu berarti $\\lor$ inklusif di atas: "$x > 0$ atau $x$ bilangan bulat" benar untuk $x = -3$, karena $-3$ bilangan bulat meski tidak positif, dan tetap benar untuk $x = 5$, saat kebetulan kedua bagiannya berlaku.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: '$p$: "$9$ is odd" is true. $q$: "$9$ is prime" is false. What is $p \\lor q$?',
                id: '$p$: "$9$ ganjil" benar. $q$: "$9$ prima" salah. Apa nilai $p \\lor q$?',
              },
              options: [
                { en: 'True', id: 'Benar' },
                { en: 'False', id: 'Salah' },
                { en: 'Cannot be determined', id: 'Tak dapat ditentukan' },
                { en: 'Both true and false', id: 'Benar sekaligus salah' },
              ],
              answer: 0,
              explain: {
                en: 'A disjunction only needs one true half, and $p$ is true here — that alone makes $p \\lor q$ true, no matter what $q$ is.',
                id: 'Disjungsi hanya butuh satu bagian yang benar, dan $p$ di sini benar — itu saja sudah membuat $p \\lor q$ benar, apa pun nilai $q$.',
              },
              hint: {
                en: 'A disjunction fails in only one row of its table — the one where both halves are false. Is that the case here?',
                id: 'Disjungsi gagal hanya pada satu baris tabelnya — yaitu ketika kedua bagiannya salah. Apakah itu yang terjadi di sini?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'For which pair of truth values is $p \\lor q$ **false**?',
                id: 'Untuk pasangan nilai kebenaran manakah $p \\lor q$ **salah**?',
              },
              options: [
                { en: '$p$ true, $q$ false', id: '$p$ benar, $q$ salah' },
                { en: '$p$ false, $q$ true', id: '$p$ salah, $q$ benar' },
                { en: '$p$ false, $q$ false', id: '$p$ salah, $q$ salah' },
                { en: '$p$ true, $q$ true', id: '$p$ benar, $q$ benar' },
              ],
              answer: 2,
              explain: {
                en: 'A disjunction is false only in the one row where neither half holds — $p$ false and $q$ false together.',
                id: 'Disjungsi salah hanya pada satu baris ketika tak ada bagian yang berlaku — $p$ salah dan $q$ salah bersamaan.',
              },
              hint: {
                en: 'Disjunction needs "at least one" true half to succeed. What is the only way for that to fail?',
                id: 'Disjungsi butuh "setidaknya satu" bagian benar agar berhasil. Bagaimana satu-satunya cara itu bisa gagal?',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Put these lines in order to build the truth table for $\\neg p \\lor q$, from the header down.',
                id: 'Susun baris-baris ini agar menjadi tabel kebenaran untuk $\\neg p \\lor q$, dari judul kolom ke bawah.',
              },
              lines: {
                en: [
                  '\\begin{array} p & q & \\neg p & \\neg p \\lor q \\end{array}',
                  '\\begin{array} B & B & S & B \\end{array}',
                  '\\begin{array} B & S & S & S \\end{array}',
                  '\\begin{array} S & B & B & B \\end{array}',
                  '\\begin{array} S & S & B & B \\end{array}',
                ],
                id: [
                  '\\begin{array} p & q & \\neg p & \\neg p \\lor q \\end{array}',
                  '\\begin{array} B & B & S & B \\end{array}',
                  '\\begin{array} B & S & S & S \\end{array}',
                  '\\begin{array} S & B & B & B \\end{array}',
                  '\\begin{array} S & S & B & B \\end{array}',
                ],
              },
              explain: {
                en: 'First negate $p$ in every row, then apply the disjunction rule between the $\\neg p$ column and $q$: false only when both of those are false, which happens only in row 2.',
                id: 'Ingkarkan dulu $p$ pada setiap baris, lalu terapkan aturan disjungsi antara kolom $\\neg p$ dan $q$: salah hanya bila keduanya salah, yang hanya terjadi pada baris 2.',
              },
              hint: {
                en: 'Build the $\\neg p$ column first by flipping every value of $p$, then combine that column with $q$ using the disjunction rule, one row at a time.',
                id: 'Bangun dulu kolom $\\neg p$ dengan membalik setiap nilai $p$, lalu gabungkan kolom itu dengan $q$ memakai aturan disjungsi, satu baris demi satu baris.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: '$p$: "$-2 > 0$" and $q$: "$-2$ is an integer". Evaluate $p \\lor q$. (Type 1 for true, 0 for false.)',
                id: '$p$: "$-2 > 0$" dan $q$: "$-2$ bilangan bulat". Tentukan nilai $p \\lor q$. (Ketik 1 untuk benar, 0 untuk salah.)',
              },
              blanks: [{ label: 'p \\lor q =', answer: 1 }],
              hints: [
                { en: 'Work out $p$ and $q$ separately before combining them.', id: 'Tentukan $p$ dan $q$ secara terpisah sebelum menggabungkannya.' },
                { en: '$p$ turns out false, but disjunction only needs one true half.', id: '$p$ ternyata salah, tetapi disjungsi hanya butuh satu bagian yang benar.' },
              ],
              explain: {
                en: '$p$ is false ($-2$ is not greater than 0) but $q$ is true ($-2$ is an integer), and one true half is enough — $p \\lor q$ is true.',
                id: '$p$ salah ($-2$ tidak lebih besar dari 0) tetapi $q$ benar ($-2$ bilangan bulat), dan satu bagian yang benar sudah cukup — $p \\lor q$ benar.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'log-m1-s2-p',
        runtime: 'math',
        title: { en: 'Negation, Conjunction, and Disjunction', id: 'Negasi, Konjungsi, dan Disjungsi' },
        brief: {
          en: 'Evaluate compound statements built with "not", "and" and "or".',
          id: 'Menilai pernyataan majemuk yang dibangun dengan "tidak", "dan", dan "atau".',
        },
        requirements: [
          { en: 'Every box has to be right before a part counts as answered.', id: 'Setiap kotak harus benar sebelum satu butir dihitung terjawab.' },
          { en: 'Two of the three parts ask for a sum over a domain, not a count — work through every member before answering.', id: 'Dua dari tiga butir meminta jumlah pada suatu semesta, bukan banyaknya — kerjakan setiap anggotanya sebelum menjawab.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'Domain $\\{20, 24, 30, 40, 45, 60, 80\\}$. Let $p(x)$: "$x$ is a multiple of $4$" and $q(x)$: "$x$ is a multiple of $5$". What is the sum of every $x$ in the domain for which $p(x) \\land q(x)$ is true?',
              id: 'Semesta $\\{20, 24, 30, 40, 45, 60, 80\\}$. Misalkan $p(x)$: "$x$ kelipatan $4$" dan $q(x)$: "$x$ kelipatan $5$". Berapa jumlah semua $x$ dalam semesta yang membuat $p(x) \\land q(x)$ benar?',
            },
            blanks: [{ answer: 200 }],
            solution: ['p \\land q\\text{ benar tepat ketika }x\\text{ kelipatan }4\\text{ sekaligus kelipatan }5\\text{, yakni kelipatan }20.', '\\text{Anggota semesta yang kelipatan }20\\text{: }20, 40, 60, 80.', '20+40+60+80 = 200.'],
          },
          {
            prompt: {
              en: 'How many rows does a truth table for four simple statements need?',
              id: 'Berapa banyak baris yang dibutuhkan tabel kebenaran untuk empat pernyataan sederhana?',
            },
            blanks: [{ answer: 16 }],
            solution: ['\\text{Setiap pernyataan menggandakan banyaknya kombinasi: }2^4 = 16\\text{.}'],
          },
          {
            prompt: {
              en: 'Domain $\\{6, 9, 14, 18, 21, 27, 36\\}$. Let $r(x)$: "$x$ is a multiple of $3$" and $s(x)$: "$x$ is even". What is the sum of every $x$ in the domain for which $r(x) \\land \\neg s(x)$ is true?',
              id: 'Semesta $\\{6, 9, 14, 18, 21, 27, 36\\}$. Misalkan $r(x)$: "$x$ kelipatan $3$" dan $s(x)$: "$x$ genap". Berapa jumlah semua $x$ dalam semesta yang membuat $r(x) \\land \\neg s(x)$ benar?',
            },
            blanks: [{ answer: 57 }],
            solution: ['r \\land \\neg s\\text{ benar tepat ketika }x\\text{ kelipatan }3\\text{ tetapi ganjil.}', '\\text{Anggota semesta yang kelipatan }3\\text{: }6, 9, 18, 21, 27, 36\\text{; yang ganjil di antaranya: }9, 21, 27.', '9+21+27 = 57.'],
          },
        ],
        hints: [
          {
            en: 'Go through the domain one member at a time, decide the truth value of each simple statement for it, then evaluate the compound statement — only add up the members that pass.',
            id: 'Telusuri semestanya satu anggota demi satu anggota, tentukan nilai kebenaran tiap pernyataan sederhananya, lalu nilai pernyataan majemuknya — jumlahkan hanya anggota yang lolos.',
          },
        ],
        xp: 50,
      },
    },
  ],
}
