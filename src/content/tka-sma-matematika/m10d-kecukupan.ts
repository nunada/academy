import type { Lesson } from '../types'
import { L, shape } from './figs'

/** The data-sufficiency question: a question and two statements, and the
 *  learner decides which statements are enough to answer it. The five
 *  answer options are always the same, as in the sample items of the
 *  official framework. */

const OPTIONS = [
  L(
    'Statement (1) ALONE is sufficient to answer the question, but statement (2) ALONE is not sufficient.',
    'Pernyataan (1) SAJA cukup untuk menjawab pertanyaan, tetapi Pernyataan (2) SAJA tidak cukup.',
  ),
  L(
    'Statement (2) ALONE is sufficient to answer the question, but statement (1) ALONE is not sufficient.',
    'Pernyataan (2) SAJA cukup untuk menjawab pertanyaan, tetapi Pernyataan (1) SAJA tidak cukup.',
  ),
  L(
    'BOTH statements TOGETHER are sufficient, but NEITHER statement ALONE is sufficient.',
    'DUA pernyataan BERSAMA-SAMA cukup untuk menjawab pertanyaan, tetapi SATU pernyataan SAJA tidak cukup.',
  ),
  L(
    'Statement (1) ALONE is sufficient, and statement (2) ALONE is also sufficient.',
    'Pernyataan (1) SAJA cukup untuk menjawab pertanyaan dan Pernyataan (2) SAJA cukup.',
  ),
  L(
    'Statements (1) and (2) TOGETHER are NOT sufficient to answer the question.',
    'Pernyataan (1) dan Pernyataan (2) tidak cukup untuk menjawab pertanyaan.',
  ),
]

export const lessonSufficiency: Lesson = {
  id: 'tka-sma-m10-s2-l3',
  title: L('Data Sufficiency Questions', 'Soal Kecukupan Data'),
  goal: L(
    'You can decide whether the information in two statements is enough to answer a question, without having to solve it completely.',
    'Kamu bisa memutuskan apakah informasi pada dua pernyataan cukup untuk menjawab suatu pertanyaan, tanpa harus menyelesaikannya sampai tuntas.',
  ),
  xp: 20,
  steps: [
    {
      kind: 'concept',
      id: 'c1',
      title: L('Look Closely: A Question and Two Statements', 'Ayo Amati: Satu Pertanyaan dan Dua Pernyataan'),
      body: L(
        'Some reasoning questions of the TKA do not ask for the answer. They ask: **is the information enough to find it?** You get a question, two extra statements (1) and (2), and always the same five options:\n\n- (1) alone is enough, (2) alone is not;\n- (2) alone is enough, (1) alone is not;\n- both together are enough, but neither alone;\n- each alone is enough;\n- even together they are not enough.\n\n**"Enough" means the information leads to ONE definite answer**, which may be "yes" or "no". It does not have to be "yes".\n\nExample: a rectangle has width 4. **Is its perimeter greater than 20?**\n\n- (1) The area is 24.\n- (2) The length is 7.\n\nStatement (1): length $=\\frac{24}{4}=6$, perimeter $=2(4+6)=20$: **not** greater than 20. A definite "no", so (1) is enough. Statement (2): perimeter $=2(4+7)=22$, greater than 20. A definite "yes", so (2) is enough. Each alone is enough.',
        'Sebagian soal penalaran TKA tidak menanyakan jawabannya. Soal itu menanyakan: **apakah informasinya cukup untuk menemukannya?** Kamu mendapat satu pertanyaan, dua pernyataan tambahan (1) dan (2), dan selalu lima pilihan yang sama:\n\n- (1) saja cukup, (2) saja tidak;\n- (2) saja cukup, (1) saja tidak;\n- keduanya bersama-sama cukup, tetapi masing-masing tidak;\n- masing-masing cukup;\n- bahkan bersama-sama pun tidak cukup.\n\n**"Cukup" berarti informasi itu mengarah ke SATU jawaban yang pasti**, yang boleh "ya" atau "tidak". Tidak harus "ya".\n\nContoh: sebuah persegi panjang berlebar 4. **Apakah kelilingnya lebih dari 20?**\n\n- (1) Luasnya 24.\n- (2) Panjangnya 7.\n\nPernyataan (1): panjang $=\\frac{24}{4}=6$, keliling $=2(4+6)=20$: **tidak** lebih dari 20. Jawaban pasti "tidak", jadi (1) cukup. Pernyataan (2): keliling $=2(4+7)=22$, lebih dari 20. Jawaban pasti "ya", jadi (2) cukup. Masing-masing cukup.',
      ),
      figure: {
        ...shape({
          pts: [[0, 0], [6, 0], [6, 4], [0, 4]],
          rights: [0, 1, 2, 3],
          sides: ['l', undefined, undefined, '4'],
        }),
        caption: L('A rectangle with width 4 and an unknown length l.', 'Persegi panjang berlebar 4 dan panjang l yang belum diketahui.'),
      },
    },
    {
      kind: 'concept',
      id: 'c2',
      title: L('Step by Step: Test Each Statement Alone, Then Together', 'Contoh Bertahap: Uji Tiap Pernyataan Sendiri, Lalu Bersama'),
      body: L(
        'Use the same routine every time.\n\n1. Step 1: Read the question and decide what would count as a definite answer.\n2. Step 2: Take statement (1) **alone**. Forget statement (2). Is the answer definite?\n3. Step 3: Take statement (2) **alone**. Forget statement (1).\n4. Step 4: Only if **neither** is enough alone, put them **together**.\n5. Step 5: Choose the option that matches.\n\nExample: **What is the value of $x$?** (1) $x^2=9$. (2) $x>0$.\n\n- (1) alone: $x=3$ or $x=-3$. Not definite.\n- (2) alone: any positive number. Not definite.\n- Together: $x=3$ or $-3$, and $x>0$, so $x=3$. Definite.\n\nSo the answer is "together, but neither alone".\n\nYou do **not** need to find every number. Often you only need to see that a value is **determined**.',
        'Pakai rutinitas yang sama setiap kali.\n\n1. Langkah 1: Baca pertanyaan dan tentukan apa yang dianggap sebagai jawaban pasti.\n2. Langkah 2: Ambil pernyataan (1) **sendiri**. Lupakan pernyataan (2). Apakah jawabannya pasti?\n3. Langkah 3: Ambil pernyataan (2) **sendiri**. Lupakan pernyataan (1).\n4. Langkah 4: Hanya jika **keduanya** tidak cukup sendiri-sendiri, gabungkan **bersama**.\n5. Langkah 5: Pilih pilihan yang cocok.\n\nContoh: **Berapakah nilai $x$?** (1) $x^2=9$. (2) $x>0$.\n\n- (1) saja: $x=3$ atau $x=-3$. Tidak pasti.\n- (2) saja: sembarang bilangan positif. Tidak pasti.\n- Bersama: $x=3$ atau $-3$, dan $x>0$, jadi $x=3$. Pasti.\n\nJadi jawabannya "bersama-sama, tetapi masing-masing tidak".\n\nKamu **tidak** perlu mencari semua bilangan. Sering kali cukup melihat bahwa suatu nilai **ditentukan**.',
      ),
    },
    {
      kind: 'concept',
      id: 'c3',
      title: L('Watch Out!: Traps in Sufficiency Questions', 'Awas, Jebakan!: Jebakan pada Soal Kecukupan'),
      body: L(
        '- **Do not mix the statements** while testing one alone. When you test (1), (2) does not exist.\n- **"No" is a valid answer.** A statement that proves the perimeter is exactly 20 settles the question "greater than 20?" just as well as one that proves 22.\n- **Do not trust the picture.** A drawing is not to scale: use only the numbers and facts that are given.\n- **Count the unknowns.** One unknown needs one equation; two unknowns usually need two (but check for repeated information).\n- **Two statements saying the same thing** do not add anything: together they can still be not enough.\n- **Stop when the answer is clear.** You never have to finish the whole calculation, only to see that it can be done and gives one answer.',
        '- **Jangan mencampur pernyataan** saat menguji satu pernyataan sendiri. Saat menguji (1), pernyataan (2) tidak ada.\n- **"Tidak" adalah jawaban yang sah.** Pernyataan yang membuktikan keliling tepat 20 menuntaskan pertanyaan "lebih dari 20?" sama baiknya dengan yang membuktikan 22.\n- **Jangan percaya gambar.** Gambar tidak sesuai skala: pakai hanya bilangan dan fakta yang diberikan.\n- **Hitung banyak yang tidak diketahui.** Satu yang tidak diketahui memerlukan satu persamaan; dua biasanya memerlukan dua (tetapi periksa informasi yang berulang).\n- **Dua pernyataan yang mengatakan hal yang sama** tidak menambah apa pun: bersama-sama pun bisa tetap tidak cukup.\n- **Berhenti saat jawabannya jelas.** Kamu tidak harus menyelesaikan seluruh perhitungan, cukup melihat bahwa hal itu dapat dilakukan dan memberi satu jawaban.',
      ),
    },
    {
      kind: 'quiz',
      id: 'q1',
      prompt: L(
        'In the triangle $ABC$, is the angle at $B$ a right angle? Statement (1): $AB=3$ and $BC=4$. Statement (2): $AC=5$.',
        'Pada segitiga $ABC$, apakah sudut di $B$ siku-siku? Pernyataan (1): $AB=3$ dan $BC=4$. Pernyataan (2): $AC=5$.',
      ),
      figure: {
        ...shape({
          pts: [[0, 0], [8, 0], [2, 5]],
          names: 'ABC',
          sides: ['3', '4', '5'],
        }),
        caption: L('A triangle ABC. The picture is not to scale.', 'Segitiga ABC. Gambar tidak sesuai skala.'),
      },
      options: [OPTIONS[0], OPTIONS[1], OPTIONS[2], OPTIONS[3], OPTIONS[4]],
      answer: 2,
      explain: L(
        '(1) alone gives two sides but not $AC$: we cannot check $AB^2+BC^2=AC^2$. (2) alone gives only $AC$. Together the sides are 3, 4, 5 and $3^2+4^2=5^2$, so the angle at $B$ is a right angle. Together they are enough, but neither alone.',
        '(1) saja memberi dua sisi tetapi bukan $AC$: kita tidak dapat memeriksa $AB^2+BC^2=AC^2$. (2) saja hanya memberi $AC$. Bersama-sama sisinya 3, 4, 5 dan $3^2+4^2=5^2$, jadi sudut di $B$ siku-siku. Bersama-sama cukup, tetapi masing-masing tidak.',
      ),
      hint: L(
        'Test each statement alone first. To prove a right angle you need all three sides.',
        'Uji tiap pernyataan sendiri dulu. Untuk membuktikan sudut siku-siku kamu memerlukan ketiga sisi.',
      ),
    },
    {
      kind: 'fill',
      id: 'f1',
      math: true,
      prompt: L(
        'Try it together: the rectangle has width 4 and area 24. Find its length and its perimeter.',
        'Coba bersama: persegi panjang berlebar 4 dan berluas 24. Cari panjang dan kelilingnya.',
      ),
      template: 'l=\\frac{24}{4}=___ \\qquad 2(4+l)=___',
      blanks: ['6', '20'],
      explain: L(
        '$l=6$ and the perimeter is $2(4+6)=20$, which is not more than 20.',
        '$l=6$ dan kelilingnya $2(4+6)=20$, yang tidak lebih dari 20.',
      ),
      hint: L(
        'Area $=$ length $\\times$ width, so the length is the area divided by the width.',
        'Luas $=$ panjang $\\times$ lebar, jadi panjang adalah luas dibagi lebar.',
      ),
    },
    {
      kind: 'multi',
      id: 'mc1',
      prompt: L('Choose the TWO true statements about sufficiency questions.', 'Pilih DUA pernyataan yang benar tentang soal kecukupan.'),
      options: [
        L('A statement can be sufficient when it proves the answer is "no".', 'Suatu pernyataan dapat cukup bila membuktikan bahwa jawabannya "tidak".'),
        L('You should test each statement alone before you put them together.', 'Kamu sebaiknya menguji tiap pernyataan sendiri sebelum menggabungkannya.'),
        L('You must always calculate the final answer completely.', 'Kamu harus selalu menghitung jawaban akhir sampai tuntas.'),
        L('The drawing may be used to measure missing lengths.', 'Gambar boleh dipakai untuk mengukur panjang yang belum diketahui.'),
      ],
      answer: [0, 1],
      explain: L(
        'A definite "no" settles the question. You only need to see that the answer is determined, and a drawing is not to scale.',
        '"Tidak" yang pasti menuntaskan pertanyaan. Kamu hanya perlu melihat bahwa jawabannya ditentukan, dan gambar tidak sesuai skala.',
      ),
      hint: L(
        'Ask: what does "enough" mean? One definite answer.',
        'Tanyakan: apa arti "cukup"? Satu jawaban yang pasti.',
      ),
    },
    {
      kind: 'judge',
      id: 'j1',
      prompt: L(
        'Question: What is the value of $x$? Statement (1): $x^2=9$. Statement (2): $x>0$. Decide whether each statement is True or False.',
        'Pertanyaan: Berapakah nilai $x$? Pernyataan (1): $x^2=9$. Pernyataan (2): $x>0$. Tentukan tiap pernyataan Benar atau Salah.',
      ),
      statements: [
        L('Statement (1) alone is sufficient.', 'Pernyataan (1) saja cukup.'),
        L('Statement (2) alone is sufficient.', 'Pernyataan (2) saja cukup.'),
        L('Both statements together are sufficient.', 'Kedua pernyataan bersama-sama cukup.'),
        L('Together they give $x=3$.', 'Bersama-sama keduanya memberi $x=3$.'),
      ],
      answer: [false, false, true, true],
      explain: L(
        '(1) allows $x=3$ and $x=-3$. (2) allows every positive number. Together only $x=3$ is left.',
        '(1) memperbolehkan $x=3$ dan $x=-3$. (2) memperbolehkan setiap bilangan positif. Bersama-sama hanya $x=3$ yang tersisa.',
      ),
      hint: L(
        'Solve $x^2=9$ first. Then see which solution fits $x>0$.',
        'Selesaikan $x^2=9$ dulu. Lalu lihat penyelesaian mana yang cocok dengan $x>0$.',
      ),
    },
    {
      kind: 'math',
      id: 'm1',
      prompt: L(
        'A rectangle has width 4 and area 24. What is its perimeter?',
        'Sebuah persegi panjang berlebar 4 dan berluas 24. Berapa kelilingnya?',
      ),
      blanks: [{ answer: 20 }],
      hints: [
        L('First find the length from the area and the width.', 'Cari dulu panjang dari luas dan lebar.'),
        L('$l=\\frac{24}{4}=6$.', '$l=\\frac{24}{4}=6$.'),
        L('Perimeter $=2\\times(\\text{width}+\\text{length})$.', 'Keliling $=2\\times(\\text{lebar}+\\text{panjang})$.'),
      ],
      explain: L(
        '$2\\times(4+6)=20$.',
        '$2\\times(4+6)=20$.',
      ),
      solution: ['l=\\frac{24}{4}=6', '2(4+6)=20'],
    },
  ],
}
