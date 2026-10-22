import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './latex.meta'

export { meta }

const L = (en: string, id: string): Loc => ({ en, id })

/** Prose is written between backticks with its TeX unescaped; the code marker
 *  inside it is ´ rather than a backtick, and `*word*` emphasis is dropped.
 *  `[words](article:id#section)` is a link to another article. */
const T = (s: TemplateStringsArray): string =>
  s.raw[0]
    .replace(/´([^´\n]+)´/g, '`$1`')
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '$1')
    .replace(/^\s+|\s+$/g, '')

export const body: ArticleBody = {
  answer: L(
    T`**LaTeX is a typesetting system: you write a plain-text file with commands such as ´\frac{a}{b}´ and ´\section{Introduction}´, and a program turns it into a cleanly formatted PDF.** It is the standard for mathematics, science and computing papers because it sets formulas beautifully, numbers pages, equations and citations automatically, and keeps the look of a document separate from its content. Mathematics goes between dollar signs, as in ´$x^2+y^2=r^2$´.`,
    T`**LaTeX adalah sistem penyusunan huruf: kamu menulis berkas teks biasa dengan perintah seperti ´\frac{a}{b}´ dan ´\section{Pendahuluan}´, dan sebuah program mengubahnya menjadi PDF yang rapi.** Ia menjadi standar untuk makalah matematika, sains, dan komputasi karena menyusun rumus dengan indah, menomori halaman, persamaan, dan kutipan secara otomatis, dan memisahkan tampilan dokumen dari isinya. Matematika ditaruh di antara tanda dolar, seperti ´$x^2+y^2=r^2$´.`,
  ),

  keyPoints: [
    L(
      T`LaTeX is *marked-up text*: you type the content and say what each part is (a section, a formula, a list), and the compiler chooses the typography. A document is a ´.tex´ file; compiling it with ´pdflatex´ gives a PDF.`,
      T`LaTeX adalah *teks bertanda*: kamu mengetik isinya dan menyatakan bagian apa tiap bagian itu (bagian, rumus, daftar), dan kompilator memilih tipografinya. Dokumen adalah berkas ´.tex´; mengompilasinya dengan ´pdflatex´ menghasilkan PDF.`,
    ),
    L(
      T`Mathematics lives in *math mode*: ´$...$´ inside a sentence, ´\[ ... \]´ on its own line. Scripts take one character unless braced: ´x^{10}´, not ´x^10´. Fractions, roots and sums are ´\frac{a}{b}´, ´\sqrt{x}´ and ´\sum_{i=1}^{n}´.`,
      T`Matematika berada dalam *mode matematika*: ´$...$´ di dalam kalimat, ´\[ ... \]´ pada barisnya sendiri. Skrip hanya mengambil satu karakter kecuali diberi kurung kurawal: ´x^{10}´, bukan ´x^10´. Pecahan, akar, dan jumlah adalah ´\frac{a}{b}´, ´\sqrt{x}´, dan ´\sum_{i=1}^{n}´.`,
    ),
    L(
      T`Every document has a ´\documentclass´, a *preamble* where the packages are loaded (´\usepackage{amsmath}´), and a body between ´\begin{document}´ and ´\end{document}´. Environments such as ´equation´, ´align´, ´pmatrix´ and ´itemize´ always come in ´\begin{...}´ and ´\end{...}´ pairs.`,
      T`Setiap dokumen memiliki ´\documentclass´, sebuah *preamble* tempat paket dimuat (´\usepackage{amsmath}´), dan isi di antara ´\begin{document}´ dan ´\end{document}´. Lingkungan seperti ´equation´, ´align´, ´pmatrix´, dan ´itemize´ selalu berpasangan ´\begin{...}´ dan ´\end{...}´.`,
    ),
    L(
      T`Ten characters are special in LaTeX text: ´# % & _ { } ~ ^ \´ and the dollar sign. To print one, escape it (´\%´, ´\&´, ´\_´) or use a command such as ´\textbackslash´. Labels and citations need several compilations: ´pdflatex´, ´bibtex´, ´pdflatex´, ´pdflatex´.`,
      T`Sepuluh karakter bersifat khusus dalam teks LaTeX: ´# % & _ { } ~ ^ \´ dan tanda dolar. Untuk mencetaknya, beri escape (´\%´, ´\&´, ´\_´) atau pakai perintah seperti ´\textbackslash´. Label dan kutipan memerlukan beberapa kali kompilasi: ´pdflatex´, ´bibtex´, ´pdflatex´, ´pdflatex´.`,
    ),
    L(
      T`Read errors from the first one down: ´Undefined control sequence´ is a misspelled command or a missing package, ´Missing $ inserted´ is mathematics outside math mode (a ´^´ in text, or a lone ´$´), ´Missing } inserted´ is an unbalanced brace. A linter can find most of them before you compile.`,
      T`Baca galat dari yang pertama ke bawah: ´Undefined control sequence´ adalah perintah yang salah eja atau paket yang hilang, ´Missing $ inserted´ adalah matematika di luar mode matematika (´^´ dalam teks, atau ´$´ yang sendirian), ´Missing } inserted´ adalah kurung kurawal yang tidak seimbang. Sebuah linter dapat menemukan kebanyakannya sebelum kamu mengompilasi.`,
    ),
    L(
      T`LaTeX is also the notation of the web and of code: MathJax and KaTeX draw it in browsers, Markdown and Jupyter notebooks accept ´$...$´, Python's SymPy prints it with ´latex()´, and Overleaf compiles documents online without installing anything.`,
      T`LaTeX juga adalah notasi web dan kode: MathJax dan KaTeX menggambarnya di peramban, Markdown dan notebook Jupyter menerima ´$...$´, SymPy Python mencetaknya dengan ´latex()´, dan Overleaf mengompilasi dokumen secara daring tanpa memasang apa pun.`,
    ),
  ],

  sections: [
    /* --------------------------------------------------------------------------------------- what */
    {
      id: 'what-is-latex',
      heading: L('What is LaTeX?', 'Apa itu LaTeX?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**LaTeX is a system for preparing documents in which you write the text and mark up its structure, and a program called a compiler lays it out and produces a PDF.** You do not drag a formula into place or choose a font size for a heading. You type ´\section{Results}´ and LaTeX decides how a section heading looks, how much space surrounds it, what number it gets and where it appears in the table of contents. This is "what you mean is what you get", as opposed to the "what you see is what you get" of a word processor.

**Why people use it.**
- **Mathematics.** Formulas are written in text and set with the care of a professional typesetter: the right spacing around operators, brackets that grow with their contents, and fractions and scripts of the correct sizes.
- **Automatic numbering and references.** Sections, equations, figures and tables are numbered for you, and ´\ref´ and ´\cite´ keep every cross-reference and citation correct when you add or move something.
- **Stability.** A source file is plain text: it opens anywhere, works with version control, and still compiles years later.
- **Consistency.** The look is a property of the *document class* and the packages, so a thesis, a paper and a set of slides keep a uniform style, and a journal can supply a class that formats your paper the way it wants.

**The names.** *TeX* (pronounced "tech", from the Greek letters τ ε χ) is the typesetting engine written by Donald Knuth. *LaTeX* (say "lah-tech" or "lay-tech") is a layer of commands on top of TeX, written by Leslie Lamport, that makes it easy to describe documents. People say "LaTeX" for both the system and the language. *Overleaf* is a website that compiles LaTeX in the browser; *TeX Live* and *MiKTeX* are the distributions you install on your own computer.

**The workflow.** You write ´main.tex´, run the compiler (´pdflatex main´), and open ´main.pdf´. The compiler also writes a ´.log´ file with its messages and a ´.aux´ file where it remembers numbers for the next run. Here is the smallest complete document:`,
            T`**LaTeX adalah sistem untuk menyiapkan dokumen yang di dalamnya kamu menulis teks dan menandai strukturnya, dan sebuah program bernama kompilator menata letaknya dan menghasilkan PDF.** Kamu tidak menyeret rumus ke tempatnya atau memilih ukuran huruf untuk judul bagian. Kamu mengetik ´\section{Hasil}´ dan LaTeX menentukan seperti apa judul bagian itu, berapa ruang di sekelilingnya, nomor berapa yang ia dapat, dan di mana ia muncul dalam daftar isi. Ini adalah "yang kamu maksud adalah yang kamu dapat", berlawanan dengan "yang kamu lihat adalah yang kamu dapat" pada pengolah kata.

**Mengapa orang memakainya.**
- **Matematika.** Rumus ditulis dalam teks dan disusun dengan ketelitian penyusun huruf profesional: spasi yang tepat di sekitar operator, kurung yang membesar mengikuti isinya, dan pecahan serta skrip berukuran benar.
- **Penomoran dan rujukan otomatis.** Bagian, persamaan, gambar, dan tabel dinomori untukmu, dan ´\ref´ serta ´\cite´ menjaga setiap rujukan silang dan kutipan tetap benar ketika kamu menambah atau memindahkan sesuatu.
- **Stabilitas.** Berkas sumber adalah teks biasa: ia terbuka di mana saja, cocok dengan kontrol versi, dan masih dapat dikompilasi bertahun-tahun kemudian.
- **Konsistensi.** Tampilannya adalah sifat *kelas dokumen* dan paket, sehingga tesis, makalah, dan seperangkat slide mempertahankan gaya yang seragam, dan sebuah jurnal dapat menyediakan kelas yang memformat makalahmu sesuai keinginannya.

**Namanya.** *TeX* (dibaca "tek", dari huruf Yunani τ ε χ) adalah mesin penyusunan huruf yang ditulis Donald Knuth. *LaTeX* (baca "la-tek" atau "lei-tek") adalah lapisan perintah di atas TeX, ditulis Leslie Lamport, yang memudahkan menguraikan dokumen. Orang menyebut "LaTeX" untuk sistem maupun bahasanya. *Overleaf* adalah situs yang mengompilasi LaTeX di peramban; *TeX Live* dan *MiKTeX* adalah distribusi yang kamu pasang di komputermu sendiri.

**Alur kerjanya.** Kamu menulis ´main.tex´, menjalankan kompilator (´pdflatex main´), dan membuka ´main.pdf´. Kompilator juga menulis berkas ´.log´ berisi pesannya dan berkas ´.aux´ tempat ia mengingat nomor untuk pengerjaan berikutnya. Inilah dokumen lengkap yang terkecil:`,
          ),
        },
        {
          kind: 'code',
          lang: 'latex',
          caption: L('main.tex: the smallest document', 'main.tex: dokumen terkecil'),
          code: String.raw`\documentclass{article}

\begin{document}

Hello, \LaTeX! The area of a circle of radius $r$ is $A = \pi r^2$.

\end{document}`,
        },
        {
          kind: 'text',
          text: L(
            T`The first line chooses the *document class* (´article´, ´report´, ´book´, ´beamer´ for slides, and so on). Everything between ´\begin{document}´ and ´\end{document}´ is the document. Anything before ´\begin{document}´ is the *preamble*: settings and packages, which you will meet next. A blank line starts a new paragraph; several spaces or a single line break count as one space.`,
            T`Baris pertama memilih *kelas dokumen* (´article´, ´report´, ´book´, ´beamer´ untuk slide, dan seterusnya). Segala sesuatu di antara ´\begin{document}´ dan ´\end{document}´ adalah dokumennya. Apa pun sebelum ´\begin{document}´ adalah *preamble*: pengaturan dan paket, yang akan kamu temui berikutnya. Baris kosong memulai paragraf baru; beberapa spasi atau satu pergantian baris dihitung satu spasi.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------------------- first doc */
    {
      id: 'first-document',
      heading: L('How do you write and compile your first LaTeX document?', 'Bagaimana menulis dan mengompilasi dokumen LaTeX pertamamu?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Write a ´.tex´ file with a document class, a preamble and a body, then compile it with ´pdflatex´; the quickest start is Overleaf, which needs no installation.** Either install a distribution (TeX Live on Linux, macOS and Windows; MiKTeX on Windows) and an editor, or make a free project on Overleaf, where the Compile button runs everything for you.

**The skeleton of a real document.** A paper has a title, an author, the ´\maketitle´ command, sections, and usually an abstract:

- ´\documentclass[11pt,a4paper]{article}´: the class, with options for the font size and the paper.
- ´\usepackage{...}´: one line per package, in the preamble only. ´amsmath´ gives the better equation environments, ´amssymb´ extra symbols, ´graphicx´ pictures, ´booktabs´ nicer table rules, ´geometry´ the margins, and ´hyperref´ clickable links (load it last).
- ´\title´, ´\author´, ´\date´: the front matter, printed by ´\maketitle´.
- ´\section´, ´\subsection´: headings (a ´report´ or ´book´ also has ´\chapter´).
- ´abstract´: a short summary, in the ´article´ and ´report´ classes (a ´book´ has none).

**How many times to compile.** A cross-reference such as ´\ref{eq:main}´ is resolved from the ´.aux´ file written on the *previous* run, so the first compilation prints "??" and the second prints the number. A bibliography needs the sequence ´pdflatex´, ´bibtex´, ´pdflatex´, ´pdflatex´. The tool ´latexmk -pdf main.tex´ (and Overleaf) repeats the steps for you until nothing changes.

Assemble one below. Choose the class, packages and parts, and read the source; it also lists the commands to compile it and the rules the page applied (for example, that ´hyperref´ goes last and that a book has no abstract).`,
            T`**Tulis berkas ´.tex´ dengan kelas dokumen, preamble, dan isi, lalu kompilasi dengan ´pdflatex´; awal tercepat adalah Overleaf, yang tidak perlu dipasang.** Pasang distribusi (TeX Live di Linux, macOS, dan Windows; MiKTeX di Windows) dan sebuah editor, atau buat proyek gratis di Overleaf, tempat tombol Compile menjalankan semuanya untukmu.

**Kerangka dokumen sungguhan.** Makalah memiliki judul, penulis, perintah ´\maketitle´, bagian, dan biasanya abstrak:

- ´\documentclass[11pt,a4paper]{article}´: kelasnya, dengan opsi untuk ukuran huruf dan kertas.
- ´\usepackage{...}´: satu baris per paket, hanya di preamble. ´amsmath´ memberi lingkungan persamaan yang lebih baik, ´amssymb´ simbol tambahan, ´graphicx´ gambar, ´booktabs´ garis tabel yang lebih indah, ´geometry´ margin, dan ´hyperref´ tautan yang dapat diklik (muat paling akhir).
- ´\title´, ´\author´, ´\date´: bagian depan, dicetak oleh ´\maketitle´.
- ´\section´, ´\subsection´: judul bagian (´report´ atau ´book´ juga memiliki ´\chapter´).
- ´abstract´: ringkasan singkat, di kelas ´article´ dan ´report´ (´book´ tidak memilikinya).

**Berapa kali mengompilasi.** Rujukan silang seperti ´\ref{eq:main}´ diselesaikan dari berkas ´.aux´ yang ditulis pada pengerjaan *sebelumnya*, sehingga kompilasi pertama mencetak "??" dan yang kedua mencetak nomornya. Daftar pustaka memerlukan urutan ´pdflatex´, ´bibtex´, ´pdflatex´, ´pdflatex´. Alat ´latexmk -pdf main.tex´ (dan Overleaf) mengulang langkah-langkah itu untukmu sampai tidak ada yang berubah.

Rakit satu di bawah. Pilih kelas, paket, dan bagian, lalu baca sumbernya; ia juga mendaftar perintah untuk mengompilasinya dan aturan yang diterapkan halaman ini (misalnya ´hyperref´ paling akhir dan buku tidak memiliki abstrak).`,
          ),
        },
        { kind: 'widget', name: 'texdoc' },
      ],
    },

    /* ------------------------------------------------------------------------------------ math */
    {
      id: 'math-mode',
      heading: L('How do you write mathematics in LaTeX?', 'Bagaimana menulis matematika di LaTeX?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Put the mathematics in *math mode*: between single dollar signs inside a sentence, or between ´\[´ and ´\]´ for a formula on its own line.** In math mode letters are italic variables, spaces are ignored (LaTeX spaces the operators itself), and commands start with a backslash. The ones you use constantly:

| You want | You type | You get |
|---|---|---|
| a superscript | ´x^2´ | $x^2$ |
| a subscript | ´a_n´ | $a_n$ |
| both | ´x_i^2´ | $x_i^2$ |
| a fraction | ´\frac{a}{b}´ | $\frac{a}{b}$ |
| a square root | ´\sqrt{x}´ | $\sqrt{x}$ |
| an $n$th root | ´\sqrt[3]{x}´ | $\sqrt[3]{x}$ |
| a Greek letter | ´\alpha \beta \pi´ | $\alpha\ \beta\ \pi$ |
| a function name | ´\sin x´ | $\sin x$ |
| a sum | ´\sum_{i=1}^{n} i´ | $\sum_{i=1}^{n} i$ |
| an integral | ´\int_0^1 x\,dx´ | $\int_0^1 x\,dx$ |
| a limit | ´\lim_{x\to 0}´ | $\lim_{x\to 0}$ |

**Braces group.** A superscript or subscript takes *one character*. So ´x^10´ is $x^1$ followed by a zero, and ´e^-x´ puts only the minus sign up. Write ´x^{10}´ and ´e^{-x}´ to raise the whole group. Braces also delimit the arguments of ´\frac´, ´\sqrt´ and the other commands. What the operations themselves mean is explained in [exponents and radicals](article:exponents-and-radicals#what-is-an-exponent) and in [algebraic fractions](article:algebraic-expressions#algebraic-fractions).

**Brackets that fit.** ´\left(´ and ´\right)´ make brackets grow to the height of what is between them, as in ´\left( \frac{a}{b} \right)´. Every ´\left´ needs a ´\right´ (write ´\right.´ for an invisible one).

**Words, spacing and functions.** Text inside a formula goes in ´\text{...}´, as in ´x > 0 \text{ and } y > 0´. Add a small space with ´\,´, a larger one with ´\quad´. Write ´\sin´, ´\log´, ´\lim´ and ´\max´ for function names: typed as plain letters, ´sin´ would be the product $s\,i\,n$ of three variables set in italics, with the wrong spacing.

**Numbering.** The ´equation´ environment numbers a formula, and ´\label{eq:name}´ lets you cite it with ´\eqref{eq:name}´ (from amsmath). Without a number, use ´\[ ... \]´ or the starred form ´equation*´.

The editor below draws a formula as you type and, like a careful teacher, points at the usual mistakes: a missing brace, ´x^10´, a mismatched environment, an undefined command. Click the broken examples to see what it says.`,
            T`**Taruh matematika dalam *mode matematika*: di antara tanda dolar tunggal di dalam kalimat, atau di antara ´\[´ dan ´\]´ untuk rumus pada barisnya sendiri.** Dalam mode matematika huruf adalah peubah miring, spasi diabaikan (LaTeX mengatur spasi operator sendiri), dan perintah dimulai dengan garis miring terbalik. Yang kamu pakai terus-menerus:

| Kamu ingin | Kamu mengetik | Kamu mendapat |
|---|---|---|
| superskrip | ´x^2´ | $x^2$ |
| subskrip | ´a_n´ | $a_n$ |
| keduanya | ´x_i^2´ | $x_i^2$ |
| pecahan | ´\frac{a}{b}´ | $\frac{a}{b}$ |
| akar kuadrat | ´\sqrt{x}´ | $\sqrt{x}$ |
| akar pangkat $n$ | ´\sqrt[3]{x}´ | $\sqrt[3]{x}$ |
| huruf Yunani | ´\alpha \beta \pi´ | $\alpha\ \beta\ \pi$ |
| nama fungsi | ´\sin x´ | $\sin x$ |
| jumlah | ´\sum_{i=1}^{n} i´ | $\sum_{i=1}^{n} i$ |
| integral | ´\int_0^1 x\,dx´ | $\int_0^1 x\,dx$ |
| limit | ´\lim_{x\to 0}´ | $\lim_{x\to 0}$ |

**Kurung kurawal mengelompokkan.** Superskrip atau subskrip mengambil *satu karakter*. Jadi ´x^10´ adalah $x^1$ diikuti nol, dan ´e^-x´ hanya menaikkan tanda minusnya. Tulis ´x^{10}´ dan ´e^{-x}´ untuk menaikkan seluruh kelompok. Kurung kurawal juga membatasi argumen ´\frac´, ´\sqrt´, dan perintah lain. Arti operasi itu sendiri dijelaskan dalam [eksponen dan akar](article:exponents-and-radicals#what-is-an-exponent) dan dalam [pecahan aljabar](article:algebraic-expressions#algebraic-fractions).

**Kurung yang pas.** ´\left(´ dan ´\right)´ membuat kurung membesar setinggi isi di antaranya, seperti pada ´\left( \frac{a}{b} \right)´. Setiap ´\left´ memerlukan ´\right´ (tulis ´\right.´ untuk yang tak terlihat).

**Kata, spasi, dan fungsi.** Teks di dalam rumus ditaruh dalam ´\text{...}´, seperti ´x > 0 \text{ dan } y > 0´. Tambahkan spasi kecil dengan ´\,´, yang lebih besar dengan ´\quad´. Tulis ´\sin´, ´\log´, ´\lim´, dan ´\max´ untuk nama fungsi: bila diketik sebagai huruf biasa, ´sin´ akan menjadi hasil kali $s\,i\,n$ dari tiga peubah bercetak miring, dengan spasi yang salah.

**Penomoran.** Lingkungan ´equation´ menomori sebuah rumus, dan ´\label{eq:nama}´ memungkinkan kamu mengutipnya dengan ´\eqref{eq:nama}´ (dari amsmath). Tanpa nomor, pakai ´\[ ... \]´ atau bentuk berbintang ´equation*´.

Editor di bawah menggambar rumus saat kamu mengetik dan, seperti guru yang teliti, menunjuk kesalahan yang lazim: kurung kurawal hilang, ´x^10´, lingkungan yang tidak cocok, perintah tak terdefinisi. Klik contoh yang rusak untuk melihat apa katanya.`,
          ),
        },
        { kind: 'widget', name: 'texlive' },
        {
          kind: 'code',
          lang: 'latex',
          caption: L('Formulas in a document: inline, displayed and numbered', 'Rumus dalam dokumen: sebaris, tampilan, dan bernomor'),
          code: String.raw`% in the preamble: \usepackage{amsmath}

The roots of $ax^2 + bx + c = 0$ are given by the formula
\[
  x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}.
\]

\begin{equation}
  \label{eq:euler}
  e^{i\pi} + 1 = 0
\end{equation}

Equation~\eqref{eq:euler} is Euler's identity. Functions are upright:
$\sin^2 x + \cos^2 x = 1$, and $\lim_{x \to 0} \frac{\sin x}{x} = 1$.`,
        },
      ],
    },

    /* ----------------------------------------------------------------------------------- symbols */
    {
      id: 'symbols',
      heading: L('Where do you find the command for a symbol?', 'Di mana mencari perintah untuk sebuah simbol?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Most symbols are named after what they are: ´\alpha´ is α, ´\leq´ is ≤, ´\infty´ is ∞, ´\rightarrow´ (or ´\to´) is →.** The names follow a few patterns that make them easy to guess:

- **Greek letters** are spelled out: ´\alpha´, ´\beta´, ´\gamma´ for lowercase and ´\Gamma´, ´\Delta´, ´\Omega´ for capitals (only the capitals that differ from Latin letters exist: there is no ´\Alpha´, because it would be an A). ´\epsilon´ and ´\varepsilon´ are two shapes of the same letter, as are ´\phi´ and ´\varphi´, and ´\theta´ and ´\vartheta´.
- **Relations** are abbreviated: ´\leq´ and ´\geq´ (less or equal, greater or equal), ´\neq´, ´\approx´, ´\equiv´, ´\sim´, ´\propto´, ´\in´, ´\subset´.
- **Negations** are made with ´\not´ in front of a relation, and many have a name of their own: ´\notin´ is ∉, ´\neq´ is ≠.
- **Arrows** are ´\to´, ´\mapsto´, ´\Rightarrow´ (⇒), ´\Leftrightarrow´ (⇔).
- **Big operators** ´\sum´, ´\prod´, ´\int´ grow in display style and take limits with ´_´ and ´^´.
- **Blackboard letters** for the number sets come from ´\mathbb{R}´, ´\mathbb{N}´, ´\mathbb{Z}´, ´\mathbb{Q}´, ´\mathbb{C}´ and need the ´amssymb´ (or ´amsfonts´) package.

A few symbols need a package: ´\therefore´ and ´\because´ need ´amssymb´, and ´\lVert´ and ´\rVert´ (norm bars) need ´amsmath´. If a symbol gives "Undefined control sequence", a missing package is the first suspect.

**When you cannot remember the name,** look it up in the table below, which lists more than a hundred, or draw the symbol in a recognition tool such as Detexify, or search the *Comprehensive LaTeX Symbol List*, a PDF that lists thousands.`,
            T`**Kebanyakan simbol dinamai menurut wujudnya: ´\alpha´ adalah α, ´\leq´ adalah ≤, ´\infty´ adalah ∞, ´\rightarrow´ (atau ´\to´) adalah →.** Namanya mengikuti beberapa pola yang membuatnya mudah ditebak:

- **Huruf Yunani** dieja: ´\alpha´, ´\beta´, ´\gamma´ untuk huruf kecil dan ´\Gamma´, ´\Delta´, ´\Omega´ untuk huruf kapital (hanya kapital yang berbeda dari huruf Latin yang ada: tidak ada ´\Alpha´, karena itu akan berupa A). ´\epsilon´ dan ´\varepsilon´ adalah dua bentuk huruf yang sama, demikian pula ´\phi´ dan ´\varphi´, serta ´\theta´ dan ´\vartheta´.
- **Relasi** disingkat: ´\leq´ dan ´\geq´ (kurang atau sama, lebih atau sama), ´\neq´, ´\approx´, ´\equiv´, ´\sim´, ´\propto´, ´\in´, ´\subset´.
- **Negasi** dibuat dengan ´\not´ di depan sebuah relasi, dan banyak yang punya nama sendiri: ´\notin´ adalah ∉, ´\neq´ adalah ≠.
- **Panah** adalah ´\to´, ´\mapsto´, ´\Rightarrow´ (⇒), ´\Leftrightarrow´ (⇔).
- **Operator besar** ´\sum´, ´\prod´, ´\int´ membesar dalam gaya tampilan dan menerima batas dengan ´_´ dan ´^´.
- **Huruf papan tulis** untuk himpunan bilangan berasal dari ´\mathbb{R}´, ´\mathbb{N}´, ´\mathbb{Z}´, ´\mathbb{Q}´, ´\mathbb{C}´ dan memerlukan paket ´amssymb´ (atau ´amsfonts´).

Beberapa simbol memerlukan paket: ´\therefore´ dan ´\because´ memerlukan ´amssymb´, dan ´\lVert´ serta ´\rVert´ (garis norma) memerlukan ´amsmath´. Jika sebuah simbol memberi "Undefined control sequence", paket yang hilang adalah tersangka pertama.

**Bila kamu tidak ingat namanya,** cari di tabel di bawah, yang mendaftar lebih dari seratus, atau gambar simbolnya pada alat pengenal seperti Detexify, atau cari di *Comprehensive LaTeX Symbol List*, PDF yang mendaftar ribuan.`,
          ),
        },
        { kind: 'widget', name: 'texsymbols' },
      ],
    },

    /* -------------------------------------------------------------------------------- structures */
    {
      id: 'structures',
      heading: L('How do you write matrices, aligned equations and piecewise functions?', 'Bagaimana menulis matriks, persamaan sejajar, dan fungsi sepotong-sepotong?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Larger structures are *environments*: a block between ´\begin{name}´ and ´\end{name}´, inside which ´&´ separates columns and ´\\´ ends a row.** The same pattern builds matrices, piecewise definitions and aligned equations.

**Matrices.** The ´amsmath´ environments ´pmatrix´ (round brackets), ´bmatrix´ (square brackets) and ´vmatrix´ (vertical bars, a determinant) differ only in the brackets:

´\begin{pmatrix} a & b \\ c & d \end{pmatrix}´ gives $\begin{pmatrix} a & b \\ c & d \end{pmatrix}$, and ´vmatrix´ with the same entries gives the determinant $\begin{vmatrix} a & b \\ c & d \end{vmatrix}$. Use ´\cdots´, ´\vdots´ and ´\ddots´ for the dots inside a large matrix.

**Piecewise functions** use ´cases´: each row has the value, ´&´, and the condition:

$$f(x) = \begin{cases} x^2 & x \ge 0 \\ -x & x < 0 \end{cases}$$

**Aligned equations.** Several lines that should line up at the equals signs go in ´align´ (numbered) or ´align*´ (unnumbered); put ´&´ just before the sign to align on it:

- ´(a+b)^2 &= a^2 + 2ab + b^2 \\´
- ´(a-b)^2 &= a^2 - 2ab + b^2´

The ´aligned´ environment does the same inside a larger formula. Do not use ´\\´ or blank lines to space equations: leave that to LaTeX.

The builder below fills in the code for the structures people look up most. Choose one, change the fields, and copy the result; the linter checks that the code is well formed.`,
            T`**Struktur yang lebih besar adalah *lingkungan*: blok di antara ´\begin{nama}´ dan ´\end{nama}´, yang di dalamnya ´&´ memisahkan kolom dan ´\\´ mengakhiri baris.** Pola yang sama membangun matriks, definisi sepotong-sepotong, dan persamaan sejajar.

**Matriks.** Lingkungan ´amsmath´ ´pmatrix´ (kurung bulat), ´bmatrix´ (kurung siku), dan ´vmatrix´ (garis tegak, determinan) hanya berbeda pada kurungnya:

´\begin{pmatrix} a & b \\ c & d \end{pmatrix}´ menghasilkan $\begin{pmatrix} a & b \\ c & d \end{pmatrix}$, dan ´vmatrix´ dengan entri yang sama menghasilkan determinan $\begin{vmatrix} a & b \\ c & d \end{vmatrix}$. Pakai ´\cdots´, ´\vdots´, dan ´\ddots´ untuk titik-titik di dalam matriks besar.

**Fungsi sepotong-sepotong** memakai ´cases´: setiap baris memuat nilai, ´&´, dan syaratnya:

$$f(x) = \begin{cases} x^2 & x \ge 0 \\ -x & x < 0 \end{cases}$$

**Persamaan sejajar.** Beberapa baris yang harus rata pada tanda sama dengan ditaruh dalam ´align´ (bernomor) atau ´align*´ (tanpa nomor); taruh ´&´ tepat sebelum tanda itu untuk meratakan padanya:

- ´(a+b)^2 &= a^2 + 2ab + b^2 \\´
- ´(a-b)^2 &= a^2 - 2ab + b^2´

Lingkungan ´aligned´ melakukan hal yang sama di dalam rumus yang lebih besar. Jangan pakai ´\\´ atau baris kosong untuk memberi spasi antarpersamaan: serahkan itu pada LaTeX.

Penyusun di bawah mengisi kode untuk struktur yang paling sering dicari orang. Pilih satu, ubah kolomnya, dan salin hasilnya; linter memeriksa bahwa kodenya terbentuk dengan baik.`,
          ),
        },
        { kind: 'widget', name: 'texgen' },
        {
          kind: 'code',
          lang: 'latex',
          caption: L('Aligned equations and a matrix (amsmath)', 'Persamaan sejajar dan matriks (amsmath)'),
          code: String.raw`\begin{align}
  (a+b)^2 &= a^2 + 2ab + b^2 \\
  (a-b)^2 &= a^2 - 2ab + b^2
\end{align}

\[
  A = \begin{bmatrix}
    1 & 2 \\
    3 & 4
  \end{bmatrix},
  \qquad
  \det A = \begin{vmatrix} 1 & 2 \\ 3 & 4 \end{vmatrix} = -2.
\]`,
        },
      ],
    },

    /* -------------------------------------------------------------------------------- text parts */
    {
      id: 'text-structure',
      heading: L('How do you write text, lists, tables and figures?', 'Bagaimana menulis teks, daftar, tabel, dan gambar?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Everything that is not a formula follows the same idea: say what the thing is, and let LaTeX lay it out.**

- **Paragraphs and lines.** A blank line starts a new paragraph. ´\\´ forces a line break and is rarely needed outside tables.
- **Emphasis.** ´\emph{word}´ is italic (it switches back to upright inside italics), ´\textbf{word}´ is bold, ´\texttt{code}´ is monospace.
- **Lists.** ´itemize´ makes bullets and ´enumerate´ numbers, with one ´\item´ per entry; they nest.
- **Special characters.** Ten characters are commands in disguise: ´#´, the dollar sign, ´%´ (a comment: the rest of the line is ignored), ´&´ (a column separator), ´_´ and ´^´ (scripts, only in math), ´{´, ´}´ (groups), ´~´ (a non-breaking space) and the backslash. To print one, escape it with a backslash (´\%´, ´\&´, ´\#´, ´\_´, ´\{´, ´\}´), or use ´\textbackslash´ for the backslash itself, ´\textasciitilde´ for the tilde and ´\textasciicircum´ for the caret.
- **Quotes and dashes.** Open a quotation with two backticks and close it with two apostrophes (the typewriter quote ´"´ closes the wrong way); a hyphen is ´-´, a range uses two hyphens (´10--20´) and a dash in a sentence uses three (´---´).
- **Tables.** ´tabular´ takes a column specification, ´l´, ´c´ and ´r´ for left, centered and right, and rows separated by ´\\´ with cells separated by ´&´. ´\hline´ draws rules (or ´\toprule´, ´\midrule´, ´\bottomrule´ with ´booktabs´). Wrap it in ´table´ to give it a caption and a label.
- **Figures.** ´\includegraphics[width=0.6\textwidth]{file.png}´ (from ´graphicx´) inside a ´figure´ environment with ´\caption´ and ´\label´.
- **References inside the text.** ´\label{tab:prices}´ right after the caption and ´Table~\ref{tab:prices}´ in the sentence. The tilde is a non-breaking space, so "Table" and its number are never split across lines.

The code below shows a list, a table and a figure with their labels.`,
            T`**Segala yang bukan rumus mengikuti gagasan yang sama: sebutkan apa bendanya, dan biarkan LaTeX menatanya.**

- **Paragraf dan baris.** Baris kosong memulai paragraf baru. ´\\´ memaksa pergantian baris dan jarang diperlukan di luar tabel.
- **Penekanan.** ´\emph{kata}´ miring (ia kembali tegak di dalam huruf miring), ´\textbf{kata}´ tebal, ´\texttt{kode}´ monospasi.
- **Daftar.** ´itemize´ membuat butir dan ´enumerate´ menomori, dengan satu ´\item´ per entri; keduanya dapat bersarang.
- **Karakter khusus.** Sepuluh karakter adalah perintah yang menyamar: ´#´, tanda dolar, ´%´ (komentar: sisa baris diabaikan), ´&´ (pemisah kolom), ´_´ dan ´^´ (skrip, hanya dalam matematika), ´{´, ´}´ (kelompok), ´~´ (spasi yang tidak dapat dipatahkan), dan garis miring terbalik. Untuk mencetaknya, beri escape dengan garis miring terbalik (´\%´, ´\&´, ´\#´, ´\_´, ´\{´, ´\}´), atau pakai ´\textbackslash´ untuk garis miring terbalik itu sendiri, ´\textasciitilde´ untuk tilde dan ´\textasciicircum´ untuk tanda sisipan.
- **Kutipan dan tanda hubung.** Buka kutipan dengan dua tanda petik balik dan tutup dengan dua apostrof (tanda kutip mesin tik ´"´ menutup ke arah yang salah); tanda hubung adalah ´-´, rentang memakai dua tanda hubung (´10--20´) dan tanda pisah dalam kalimat memakai tiga (´---´).
- **Tabel.** ´tabular´ menerima spesifikasi kolom, ´l´, ´c´, dan ´r´ untuk rata kiri, tengah, dan kanan, dan baris yang dipisah ´\\´ dengan sel yang dipisah ´&´. ´\hline´ menggambar garis (atau ´\toprule´, ´\midrule´, ´\bottomrule´ dengan ´booktabs´). Bungkus dalam ´table´ untuk memberinya keterangan dan label.
- **Gambar.** ´\includegraphics[width=0.6\textwidth]{berkas.png}´ (dari ´graphicx´) di dalam lingkungan ´figure´ dengan ´\caption´ dan ´\label´.
- **Rujukan di dalam teks.** ´\label{tab:harga}´ tepat setelah keterangan dan ´Tabel~\ref{tab:harga}´ dalam kalimat. Tilde adalah spasi yang tidak dapat dipatahkan, sehingga "Tabel" dan nomornya tidak pernah terpisah di dua baris.

Kode di bawah memperlihatkan daftar, tabel, dan gambar beserta labelnya.`,
          ),
        },
        {
          kind: 'code',
          lang: 'latex',
          caption: L('A list, a table and a figure', 'Daftar, tabel, dan gambar'),
          code: String.raw`\begin{enumerate}
  \item Write the source.
  \item Compile it \emph{twice} so that the references resolve.
\end{enumerate}

\begin{table}[ht]
  \centering
  \begin{tabular}{lr}
    \hline
    Item & Price (Rp) \\
    \hline
    Notebook & 12\,500 \\
    Pen \& ink & 4\,000 \\
    \hline
  \end{tabular}
  \caption{Two prices.}
  \label{tab:prices}
\end{table}

Table~\ref{tab:prices} lists them; the ink costs 50\% less.

\begin{figure}[ht]
  \centering
  \includegraphics[width=0.6\textwidth]{graph.png}
  \caption{A graph.}
  \label{fig:graph}
\end{figure}`,
        },
      ],
    },

    /* ----------------------------------------------------------------------------- bibliography */
    {
      id: 'bibliography',
      heading: L('How do citations and bibliographies work?', 'Bagaimana kutipan dan daftar pustaka bekerja?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Keep your sources in a ´.bib´ file, cite them by key with ´\cite´, and let BibTeX or biblatex build the reference list.** Each source is one entry with a key you choose:`,
            T`**Simpan sumbermu dalam berkas ´.bib´, kutip dengan kunci memakai ´\cite´, dan biarkan BibTeX atau biblatex menyusun daftar pustaka.** Setiap sumber adalah satu entri dengan kunci yang kamu pilih:`,
          ),
        },
        {
          kind: 'code',
          lang: 'latex',
          caption: L('references.bib and its use in main.tex', 'references.bib dan pemakaiannya di main.tex'),
          code: String.raw`% references.bib
@book{knuth1984,
  author    = {Donald E. Knuth},
  title     = {The {\TeX}book},
  publisher = {Addison-Wesley},
  year      = {1984}
}

% main.tex, in the text:
TeX was described by Knuth~\cite{knuth1984}.

% main.tex, where the list should appear (usually at the end):
\bibliographystyle{plain}
\bibliography{references}`,
        },
        {
          kind: 'text',
          text: L(
            T`The build is a small pipeline. The first ´pdflatex´ run notes every ´\cite´ in the ´.aux´ file; ´bibtex main´ reads the ´.bib´ file and writes the formatted list; the next two ´pdflatex´ runs put the list in the document and fix the numbers. Keys are case-sensitive and must be unique. The braces in ´{\TeX}´ protect capital letters from being lowercased by the style. The newer *biblatex* with the *biber* program replaces BibTeX in many projects (the steps are ´pdflatex´, ´biber´, ´pdflatex´), and gives more control over styles such as APA. ´latexmk´ and Overleaf run the right sequence automatically.`,
            T`Pembangunannya adalah saluran kecil. Pengerjaan ´pdflatex´ pertama mencatat setiap ´\cite´ dalam berkas ´.aux´; ´bibtex main´ membaca berkas ´.bib´ dan menulis daftar yang terformat; dua pengerjaan ´pdflatex´ berikutnya menaruh daftar itu dalam dokumen dan memperbaiki nomornya. Kunci peka huruf besar-kecil dan harus unik. Kurung kurawal pada ´{\TeX}´ melindungi huruf kapital dari diubah menjadi huruf kecil oleh gayanya. *biblatex* yang lebih baru dengan program *biber* menggantikan BibTeX pada banyak proyek (langkahnya ´pdflatex´, ´biber´, ´pdflatex´), dan memberi lebih banyak kendali atas gaya seperti APA. ´latexmk´ dan Overleaf menjalankan urutan yang benar secara otomatis.`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------------------------- errors */
    {
      id: 'errors',
      heading: L('What do the common LaTeX errors mean?', 'Apa arti galat LaTeX yang umum?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**LaTeX reports a problem with a message and a line number; the first error is the one to fix, because later ones are often its echoes.** Read the line it names and the one before it. The most common messages:

- ´Undefined control sequence´: a command is misspelled (´\fraq´), or the package that defines it is not loaded (´\mathbb´ without ´amssymb´).
- ´Missing $ inserted´: mathematics was used outside math mode (a ´^´ or ´_´ in text, or a symbol such as ´\alpha´ without dollar signs), or a dollar sign is unmatched.
- ´Missing } inserted´ and ´Extra }, or forgotten $´: the braces do not balance; count the opening and closing braces of the line.
- ´Runaway argument´: a brace was never closed, so an argument ran on to the end of a paragraph.
- ´\begin{...} ended by \end{...}´: the names of an environment pair differ, or an inner environment was not closed.
- ´File ended while scanning use of...´: the same kind of problem, found at the end of the file.
- ´Misplaced alignment tab character &´: an ampersand outside a table, matrix or ´align´; write ´\&´ to print one.
- ´LaTeX Error: File 'x.sty' not found´: a package is not installed; install it from your distribution, or use Overleaf.
- ´Overfull \hbox´: a warning, not an error: a line is too wide by the amount shown.

**Habits that make them easy to find.**
- Compile often, after each paragraph or formula, so a new error can only be in the new text.
- Write ´\begin{...}´ and ´\end{...}´ together, then fill in between.
- When stuck, make a *minimal working example*: delete everything that is not needed to reproduce the error. Half the time the mistake appears in the process, and if not, it is a perfect post for a forum.
- Check formulas with the linter in the editor above before compiling: it finds unbalanced braces, ´\left´ without ´\right´, mismatched environments, scripts like ´x^10´ and unknown commands.`,
            T`**LaTeX melaporkan masalah dengan pesan dan nomor baris; galat pertama adalah yang harus diperbaiki, karena yang berikutnya sering hanya gemanya.** Baca baris yang ia sebut dan baris sebelumnya. Pesan yang paling umum:

- ´Undefined control sequence´: sebuah perintah salah eja (´\fraq´), atau paket yang mendefinisikannya belum dimuat (´\mathbb´ tanpa ´amssymb´).
- ´Missing $ inserted´: matematika dipakai di luar mode matematika (´^´ atau ´_´ dalam teks, atau simbol seperti ´\alpha´ tanpa tanda dolar), atau sebuah tanda dolar tidak berpasangan.
- ´Missing } inserted´ dan ´Extra }, or forgotten $´: kurung kurawal tidak seimbang; hitung kurung kurawal pembuka dan penutup pada baris itu.
- ´Runaway argument´: sebuah kurung kurawal tidak pernah ditutup, sehingga argumen berlanjut sampai akhir paragraf.
- ´\begin{...} ended by \end{...}´: nama pasangan lingkungan berbeda, atau lingkungan dalam tidak ditutup.
- ´File ended while scanning use of...´: masalah sejenis, ditemukan di akhir berkas.
- ´Misplaced alignment tab character &´: ampersand di luar tabel, matriks, atau ´align´; tulis ´\&´ untuk mencetaknya.
- ´LaTeX Error: File 'x.sty' not found´: sebuah paket tidak terpasang; pasang dari distribusimu, atau pakai Overleaf.
- ´Overfull \hbox´: peringatan, bukan galat: sebuah baris terlalu lebar sebesar yang ditunjukkan.

**Kebiasaan yang memudahkan menemukannya.**
- Kompilasi sering, setelah setiap paragraf atau rumus, sehingga galat baru hanya mungkin ada di teks baru.
- Tulis ´\begin{...}´ dan ´\end{...}´ bersama-sama, lalu isi di antaranya.
- Bila buntu, buat *contoh minimal yang berfungsi*: hapus semua yang tidak diperlukan untuk mereproduksi galat. Separuh waktu kesalahannya muncul dalam prosesnya, dan bila tidak, itu bahan yang sempurna untuk sebuah forum.
- Periksa rumus dengan linter pada editor di atas sebelum mengompilasi: ia menemukan kurung kurawal tak seimbang, ´\left´ tanpa ´\right´, lingkungan yang tidak cocok, skrip seperti ´x^10´, dan perintah tak dikenal.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------------------------- in code */
    {
      id: 'latex-in-code',
      heading: L('How do you use LaTeX from Python, JavaScript and Markdown?', 'Bagaimana memakai LaTeX dari Python, JavaScript, dan Markdown?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**LaTeX math is the common notation of the web and of scientific code: you can write it by hand, generate it from objects, or let a library draw it.**

- **Markdown, notebooks and the web.** In Jupyter notebooks, Markdown renderers, many wikis and Wikipedia, ´$...$´ and ´$$...$$´ are drawn as formulas. In your own web pages, include **KaTeX** (fast, a subset of LaTeX) or **MathJax** (more complete) and write the same code.
- **Python.** SymPy turns expressions into LaTeX with ´latex()´; Matplotlib draws it in labels, as in ´plt.title(r"$\alpha^2$")´ (the ´r´ means *raw string*, so the backslash is kept); Pandoc converts Markdown with formulas into a PDF through LaTeX.
- **Strings and backslashes.** In Python and JavaScript a backslash starts an escape, so ´"\frac"´ contains a form-feed character (´\f´) and ´"\alpha"´ is wrong. Use raw strings: ´r"\frac"´ in Python and ´String.raw´ in JavaScript.
- **User text.** Text that comes from outside (names, titles, file contents) must be *escaped* before it goes into a LaTeX document, or a ´%´ or ´&´ in it breaks the build.

The first Python program asks SymPy for the LaTeX of some expressions (as printed by SymPy ´1.14´), and the second one escapes text and writes a table. The JavaScript program builds formulas as strings and shows the form-feed trap, and the C++ program escapes characters and prints a fraction.`,
            T`**Matematika LaTeX adalah notasi umum web dan kode ilmiah: kamu dapat menulisnya dengan tangan, membangkitkannya dari objek, atau membiarkan pustaka menggambarnya.**

- **Markdown, notebook, dan web.** Di notebook Jupyter, penerjemah Markdown, banyak wiki, dan Wikipedia, ´$...$´ dan ´$$...$$´ digambar sebagai rumus. Di halaman webmu sendiri, sertakan **KaTeX** (cepat, bagian dari LaTeX) atau **MathJax** (lebih lengkap) dan tulis kode yang sama.
- **Python.** SymPy mengubah ungkapan menjadi LaTeX dengan ´latex()´; Matplotlib menggambarnya pada label, seperti ´plt.title(r"$\alpha^2$")´ (´r´ berarti *raw string*, sehingga garis miring terbalik dipertahankan); Pandoc mengubah Markdown berisi rumus menjadi PDF lewat LaTeX.
- **String dan garis miring terbalik.** Di Python dan JavaScript garis miring terbalik memulai escape, sehingga ´"\frac"´ memuat karakter form-feed (´\f´) dan ´"\alpha"´ salah. Pakai raw string: ´r"\frac"´ di Python dan ´String.raw´ di JavaScript.
- **Teks pengguna.** Teks yang datang dari luar (nama, judul, isi berkas) harus di-*escape* sebelum masuk ke dokumen LaTeX, atau ´%´ atau ´&´ di dalamnya merusak pembangunan.

Program Python pertama meminta SymPy memberi LaTeX untuk beberapa ungkapan (seperti dicetak SymPy ´1.14´), dan yang kedua meng-escape teks dan menulis tabel. Program JavaScript membangun rumus sebagai string dan memperlihatkan jebakan form-feed, dan program C++ meng-escape karakter dan mencetak sebuah pecahan.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: LaTeX from SymPy', 'Python: LaTeX dari SymPy'),
          code: String.raw`from sympy import symbols, Integral, Sum, Rational, sqrt, oo, Matrix, latex, sin, pi, exp

x, k, n = symbols("x k n")
print(latex(Integral(x ** 2, (x, 0, 1))))
print(latex(Sum(1 / k ** 2, (k, 1, oo))))
print(latex(sqrt(x ** 2 + 1) / 2))
print(latex(Matrix([[1, 2], [3, 4]])))
print(latex(Rational(3, 4) * pi))
print(latex(exp(-x ** 2) * sin(x)))
# \int\limits_{0}^{1} x^{2}\, dx
# \sum_{k=1}^{\infty} \frac{1}{k^{2}}
# \frac{\sqrt{x^{2} + 1}}{2}
# \left[\begin{matrix}1 & 2\\3 & 4\end{matrix}\right]
# \frac{3 \pi}{4}
# e^{- x^{2}} \sin{\left(x \right)}`,
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: escape text and write a table', 'Python: escape teks dan tulis tabel'),
          code: String.raw`SPECIAL = {
    "\\": r"\textbackslash{}", "&": r"\&", "%": r"\%", "$": r"\$", "#": r"\#",
    "_": r"\_", "{": r"\{", "}": r"\}", "~": r"\textasciitilde{}", "^": r"\textasciicircum{}",
}


def escape_latex(text):
    """Write the ten special characters so that LaTeX prints them as themselves."""
    return "".join(SPECIAL.get(ch, ch) for ch in text)


def latex_table(header, rows):
    """A tabular environment from a header and a list of rows of text."""
    cols = "l" + "r" * (len(header) - 1)
    lines = [r"\begin{tabular}{" + cols + "}", r"  \hline"]
    lines.append("  " + " & ".join(escape_latex(h) for h in header) + r" \\")
    lines.append(r"  \hline")
    for row in rows:
        lines.append("  " + " & ".join(escape_latex(str(c)) for c in row) + r" \\")
    lines += [r"  \hline", r"\end{tabular}"]
    return "\n".join(lines)


print(escape_latex("50% of $5 & #1_a"))
print(latex_table(["Item", "Price (Rp)"], [["Notebook", 12500], ["Pen & ink", 4000]]))
print(r"\frac{%s}{%s}" % ("a+b", 2))
# 50\% of \$5 \& \#1\_a
# \begin{tabular}{lr}
#   \hline
#   Item & Price (Rp) \\
#   \hline
#   Notebook & 12500 \\
#   Pen \& ink & 4000 \\
#   \hline
# \end{tabular}
# \frac{a+b}{2}`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript: String.raw and escaping', 'JavaScript: String.raw dan escape'),
          code: String.raw`const special = { '\\': '\\textbackslash{}', '&': '\\&', '%': '\\%', $: '\\$', '#': '\\#', _: '\\_', '{': '\\{', '}': '\\}', '~': '\\textasciitilde{}', '^': '\\textasciicircum{}' }
const escapeLatex = (text) => Array.from(text, (c) => special[c] ?? c).join('')
escapeLatex('50% of $5 & #1_a')                      // '50\\% of \\$5 \\& \\#1\\_a'  (each \\ is one backslash)

// build formulas with ordinary strings: every backslash is written twice
const frac = (a, b) => '\\frac{' + a + '}{' + b + '}'
const sum = (v, from, to, body) => '\\sum_{' + v + '=' + from + '}^{' + to + '} ' + body
frac('a+b', 2)                                      // '\\frac{a+b}{2}'
sum('i', 1, 'n', 'i^2')                             // '\\sum_{i=1}^{n} i^2'

// a single backslash starts an escape: '\f' is a form feed, not a backslash followed by f
'\frac'.length                                      // 4: the form feed, r, a, c
// String.raw in front of a template literal keeps every backslash, so you can write each one once`,
        },
        {
          kind: 'code',
          lang: 'cpp',
          caption: L('C++: escape the special characters and print a fraction', 'C++: escape karakter khusus dan cetak sebuah pecahan'),
          code: String.raw`#include <iostream>
#include <cstdio>
using namespace std;

int main() {
  char text[] = "50% of $5 & #1_a";
  for (int i = 0; text[i] != 0; i++) {
    char c = text[i];
    if (c == '%' || c == '&' || c == '$' || c == '#' || c == '_' || c == '{' || c == '}') printf("\\%c", c);   // a backslash in front
    else printf("%c", c);
  }
  printf("\n");

  int a = 3, b = 4;
  printf("\\frac{%d}{%d} = %.2f\n", a, b, (double)a / b);   // in C++ source too, every backslash is written twice
  return 0;
}

/* output:
50\% of \$5 \& \#1\_a
\frac{3}{4} = 0.75
*/`,
        },
      ],
    },

    /* --------------------------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where does LaTeX come from?', 'Dari mana LaTeX berasal?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**LaTeX grew out of one mathematician's dislike of how his book looked.**

- **1976–1977.** Donald Knuth, finishing the second edition of volume 2 of *The Art of Computer Programming*, was dismayed by the proofs, which had been typeset by a new photographic process and looked far worse than the earlier metal type. He decided to write a system that would typeset mathematics as well as the best printers, and began TeX in 1977.
- **1978–1982.** The first TeX (TeX78) was followed by the stable TeX82, together with the METAFONT language and the *Computer Modern* typefaces designed with it. Knuth documented the result in *The TeXbook* (1984).
- **1984–1985.** Leslie Lamport wrote LaTeX, a set of macros on top of TeX that describes the structure of a document (*sections*, *lists*, *equations*) instead of the details of its layout; his book *LaTeX: A Document Preparation System* appeared in 1986.
- **1992 and 1996.** The CTAN archive collected the packages in one place, and TeX Live began as a complete distribution.
- **1994.** LaTeX2e, the version in use today, was released by a team led by Frank Mittelbach, and is still developed.
- **1997–2007.** New engines followed: pdfTeX (PDF output directly, by Hàn Thế Thành), XeTeX (Unicode and system fonts, by Jonathan Kew, 2004) and LuaTeX (2007, scriptable in Lua).
- **2009–2014.** MathJax (2009) and KaTeX (2014) brought LaTeX mathematics to web pages; Overleaf (2012) put the whole system in a browser.
- **2021.** Knuth made the last scheduled update of TeX, version 3.141592653. The version number of TeX gets closer to π with every update, and Knuth has said it will become π at his death, when the program is to be frozen. For decades he has paid a reward, starting at 2.56 US dollars and doubling every year up to 327.68, for every error found in his programs.`,
            T`**LaTeX tumbuh dari ketidaksukaan seorang matematikawan pada penampilan bukunya.**

- **1976–1977.** Donald Knuth, ketika menyelesaikan edisi kedua jilid 2 *The Art of Computer Programming*, kecewa pada contoh cetaknya, yang disusun dengan proses fotografi baru dan tampak jauh lebih buruk daripada huruf logam sebelumnya. Ia memutuskan menulis sistem yang akan menyusun matematika sebaik percetakan terbaik, dan memulai TeX pada 1977.
- **1978–1982.** TeX pertama (TeX78) disusul TeX82 yang stabil, bersama bahasa METAFONT dan huruf *Computer Modern* yang dirancang dengannya. Knuth mendokumentasikan hasilnya dalam *The TeXbook* (1984).
- **1984–1985.** Leslie Lamport menulis LaTeX, seperangkat makro di atas TeX yang menguraikan struktur dokumen (*bagian*, *daftar*, *persamaan*) alih-alih rincian tata letaknya; bukunya *LaTeX: A Document Preparation System* terbit pada 1986.
- **1992 dan 1996.** Arsip CTAN mengumpulkan paket di satu tempat, dan TeX Live dimulai sebagai distribusi lengkap.
- **1994.** LaTeX2e, versi yang dipakai sekarang, dirilis oleh tim yang dipimpin Frank Mittelbach, dan masih dikembangkan.
- **1997–2007.** Mesin baru menyusul: pdfTeX (keluaran PDF langsung, oleh Hàn Thế Thành), XeTeX (Unicode dan huruf sistem, oleh Jonathan Kew, 2004), dan LuaTeX (2007, dapat diprogram dengan Lua).
- **2009–2014.** MathJax (2009) dan KaTeX (2014) membawa matematika LaTeX ke halaman web; Overleaf (2012) menaruh seluruh sistem di peramban.
- **2021.** Knuth membuat pembaruan terjadwal terakhir TeX, versi 3,141592653. Nomor versi TeX makin dekat ke π pada setiap pembaruan, dan Knuth berkata ia akan menjadi π pada saat ia meninggal, ketika program itu dibekukan. Selama puluhan tahun ia membayar hadiah, dimulai dari 2,56 dolar AS dan berlipat dua setiap tahun sampai 327,68, untuk setiap galat yang ditemukan pada programnya.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What mistakes do beginners make in LaTeX?', 'Kesalahan apa yang sering dibuat pemula di LaTeX?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common beginner mistakes in LaTeX are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ Write ´x^10´ for ten | A script takes one character: write ´x^{10}´, and ´e^{-x}´ rather than ´e^-x´. |
| ❌ Type a percent sign, ampersand, hash or underscore in text as it is | They are special: write ´\%´, ´\&´, ´\#´, ´\_´ (and escape text that comes from outside). |
| ❌ Leave a blank line inside a formula | A blank line ends the paragraph and the formula with it: delete it, or put the pieces in ´align´. |
| ❌ Use double dollar signs for displayed equations | Use ´\[ ... \]´ or an ´equation´ environment: they space the formula correctly. |
| ❌ Use ´\\´ or several blank lines to add space | A blank line makes a paragraph and LaTeX spaces it; use ´\vspace´ only for a deliberate gap. |
| ❌ Put ´\usepackage´ after ´\begin{document}´ | Packages are loaded in the preamble, before ´\begin{document}´. |
| ❌ Compile once and wonder about the "??" | References and citations need several runs: ´pdflatex´, ´bibtex´, ´pdflatex´, ´pdflatex´, or ´latexmk´. |
| ❌ Type straight quotes around a word | Open with two backticks and close with two apostrophes, so the quotes face the right way. |
| ❌ Write ´sin x´ or ´lim´ as plain letters in a formula | Use ´\sin x´ and ´\lim´: the commands give upright names with the right spacing. |`,
            T`**Kesalahan pemula yang paling umum di LaTeX adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ Menulis ´x^10´ untuk sepuluh | Skrip mengambil satu karakter: tulis ´x^{10}´, dan ´e^{-x}´ bukan ´e^-x´. |
| ❌ Mengetik tanda persen, ampersand, pagar, atau garis bawah dalam teks apa adanya | Mereka khusus: tulis ´\%´, ´\&´, ´\#´, ´\_´ (dan beri escape pada teks yang datang dari luar). |
| ❌ Membiarkan baris kosong di dalam rumus | Baris kosong mengakhiri paragraf dan rumus bersamanya: hapus, atau taruh potongannya dalam ´align´. |
| ❌ Memakai dua tanda dolar untuk persamaan tampilan | Pakai ´\[ ... \]´ atau lingkungan ´equation´: keduanya mengatur spasi rumus dengan benar. |
| ❌ Memakai ´\\´ atau beberapa baris kosong untuk menambah ruang | Baris kosong membuat paragraf dan LaTeX mengatur spasinya; pakai ´\vspace´ hanya untuk jarak yang disengaja. |
| ❌ Menaruh ´\usepackage´ setelah ´\begin{document}´ | Paket dimuat di preamble, sebelum ´\begin{document}´. |
| ❌ Mengompilasi sekali dan heran pada "??" | Rujukan dan kutipan memerlukan beberapa kali jalan: ´pdflatex´, ´bibtex´, ´pdflatex´, ´pdflatex´, atau ´latexmk´. |
| ❌ Mengetik tanda kutip lurus di sekeliling kata | Buka dengan dua tanda petik balik dan tutup dengan dua apostrof, agar tanda kutip menghadap arah yang benar. |
| ❌ Menulis ´sin x´ atau ´lim´ sebagai huruf biasa dalam rumus | Pakai ´\sin x´ dan ´\lim´: perintah itu memberi nama tegak dengan spasi yang benar. |`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------------- practice */
    {
      id: 'practice',
      heading: L('Practice: test your understanding', 'Latihan: uji pemahamanmu'),
      blocks: [
        {
          kind: 'text',
          text: L(
            'These questions mix everything above. A wrong answer costs nothing here: read the hint and try again.',
            'Soal-soal ini mencampur semua yang dibahas di atas. Jika jawabanmu belum tepat, perhatikan petunjuk yang tersedia, lalu coba kembali.',
          ),
        },
        {
          kind: 'activity',
          title: L('True or false?', 'Benar atau salah?'),
          step: {
            kind: 'judge',
            id: 'p1',
            prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
            statements: [
              L(T`A LaTeX document is a plain-text file that a compiler turns into a PDF.`, T`Dokumen LaTeX adalah berkas teks biasa yang diubah kompilator menjadi PDF.`),
              L(T`A blank line in the source starts a new paragraph.`, T`Baris kosong dalam sumber memulai paragraf baru.`),
              L(T`´x^10´ produces $x$ to the power ten.`, T`´x^10´ menghasilkan $x$ pangkat sepuluh.`),
              L(T`´\usepackage´ may be written anywhere in the document.`, T`´\usepackage´ boleh ditulis di mana saja dalam dokumen.`),
              L(T`References and citations may need more than one compilation.`, T`Rujukan dan kutipan mungkin memerlukan lebih dari satu kompilasi.`),
              L(T`Every ´\left(´ needs a matching ´\right´.`, T`Setiap ´\left(´ memerlukan ´\right´ yang berpasangan.`),
            ],
            answer: [true, true, false, false, true, true],
            explain: L(
              T`´x^10´ raises only the 1: write ´x^{10}´. Packages go in the preamble, before ´\begin{document}´. The ´.aux´ file lets the second run fill in the numbers. A ´\left´ without its ´\right´ is an error (write ´\right.´ for an invisible one).`,
              T`´x^10´ hanya menaikkan angka 1: tulis ´x^{10}´. Paket ditaruh di preamble, sebelum ´\begin{document}´. Berkas ´.aux´ memungkinkan pengerjaan kedua mengisi nomornya. ´\left´ tanpa ´\right´ adalah galat (tulis ´\right.´ untuk yang tak terlihat).`,
            ),
            hint: L(T`Remember what a script takes, and where the preamble ends.`, T`Ingat apa yang diambil sebuah skrip, dan di mana preamble berakhir.`),
          },
        },
        {
          kind: 'activity',
          title: L('Special characters', 'Karakter khusus'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L(T`Which of these characters is special in LaTeX text and must be escaped with a backslash to print itself? Choose **all** that apply.`, T`Karakter mana yang khusus dalam teks LaTeX dan harus diberi escape dengan garis miring terbalik agar tercetak apa adanya? Pilih **semua** yang benar.`),
            options: [
              L(T`´%´`, T`´%´`),
              L(T`´&´`, T`´&´`),
              L(T`´#´`, T`´#´`),
              L(T`´@´`, T`´@´`),
              L(T`´:´`, T`´:´`),
            ],
            answer: [0, 1, 2],
            explain: L(T`The ten special characters are ´# % & _ { } ~ ^ \´ and the dollar sign. The at sign and the colon are ordinary.`, T`Sepuluh karakter khusus adalah ´# % & _ { } ~ ^ \´ dan tanda dolar. Tanda at dan titik dua biasa.`),
            hint: L(T`Think of the comment character, the column separator and the parameter sign.`, T`Pikirkan karakter komentar, pemisah kolom, dan tanda parameter.`),
          },
        },
        {
          kind: 'activity',
          title: L('A square root', 'Sebuah akar kuadrat'),
          step: {
            kind: 'quiz',
            id: 'p3',
            prompt: L(T`Which code gives the square root of $x+1$, the whole sum under the root?`, T`Kode mana yang menghasilkan akar kuadrat $x+1$, seluruh jumlah di bawah akar?`),
            options: [
              L(T`´\sqrt{x+1}´`, T`´\sqrt{x+1}´`),
              L(T`´\sqrt x+1´`, T`´\sqrt x+1´`),
              L(T`´sqrt(x+1)´`, T`´sqrt(x+1)´`),
              L(T`´\root{x+1}´`, T`´\root{x+1}´`),
            ],
            answer: 0,
            explain: L(T`The braces group the argument: ´\sqrt{x+1}´. Without them, ´\sqrt x+1´ is the root of $x$ with $1$ added after it; ´sqrt(x+1)´ is plain text, and ´\root´ is not a command of the same kind.`, T`Kurung kurawal mengelompokkan argumen: ´\sqrt{x+1}´. Tanpanya, ´\sqrt x+1´ adalah akar $x$ dengan $1$ ditambahkan sesudahnya; ´sqrt(x+1)´ adalah teks biasa, dan ´\root´ bukan perintah sejenis.`),
            hint: L(T`Which one puts the whole sum inside braces?`, T`Mana yang menaruh seluruh jumlah di dalam kurung kurawal?`),
          },
        },
        {
          kind: 'activity',
          title: L('A minus in an exponent', 'Minus dalam eksponen'),
          step: {
            kind: 'quiz',
            id: 'p4',
            prompt: L(T`What does ´e^-x´ produce?`, T`Apa yang dihasilkan ´e^-x´?`),
            options: [
              L(T`$e$ with only the minus sign raised, followed by $x$`, T`$e$ dengan hanya tanda minus yang dinaikkan, diikuti $x$`),
              L(T`$e$ to the power $-x$`, T`$e$ pangkat $-x$`),
              L(T`an error`, T`galat`),
              L(T`$e$ to the power $x$, negated`, T`$e$ pangkat $x$, dinegasikan`),
            ],
            answer: 0,
            explain: L(T`The superscript takes one character, here the minus sign, so the $x$ stays on the line. Write ´e^{-x}´ to raise the whole group.`, T`Superskrip mengambil satu karakter, di sini tanda minus, sehingga $x$ tetap di garis. Tulis ´e^{-x}´ untuk menaikkan seluruh kelompok.`),
            hint: L(T`How many characters does a script take?`, T`Berapa karakter yang diambil sebuah skrip?`),
          },
        },
        {
          kind: 'activity',
          title: L('Arguments of a fraction', 'Argumen sebuah pecahan'),
          step: {
            kind: 'math',
            id: 'p5',
            hints: [L(T`´\frac{a}{b}´: count the groups in braces.`, T`´\frac{a}{b}´: hitung kelompok dalam kurung kurawal.`), L(T`One for the numerator and one for the denominator.`, T`Satu untuk pembilang dan satu untuk penyebut.`)],
            explain: L(T`´\frac´ takes two arguments, the numerator and the denominator.`, T`´\frac´ menerima dua argumen, pembilang dan penyebut.`),
            prompt: L(T`How many arguments does ´\frac´ take?`, T`Berapa argumen yang diterima ´\frac´?`),
            given: String.raw`n=v`,
            blanks: [{ label: 'n =', answer: 2 }],
          },
        },
        {
          kind: 'activity',
          title: L('Runs of pdflatex', 'Pengerjaan pdflatex'),
          step: {
            kind: 'math',
            id: 'p6',
            hints: [L(T`The sequence is ´pdflatex´, ´bibtex´, ´pdflatex´, ´pdflatex´.`, T`Urutannya ´pdflatex´, ´bibtex´, ´pdflatex´, ´pdflatex´.`), L(T`Count the ´pdflatex´ steps.`, T`Hitung langkah ´pdflatex´.`)],
            explain: L(T`Three runs of ´pdflatex´, with ´bibtex´ between the first and the second.`, T`Tiga kali ´pdflatex´, dengan ´bibtex´ di antara yang pertama dan yang kedua.`),
            prompt: L(T`How many times is ´pdflatex´ run to build a document with a BibTeX bibliography?`, T`Berapa kali ´pdflatex´ dijalankan untuk membangun dokumen dengan daftar pustaka BibTeX?`),
            given: String.raw`k=v`,
            blanks: [{ label: 'k =', answer: 3 }],
          },
        },
        {
          kind: 'activity',
          title: L('An error message', 'Sebuah pesan galat'),
          step: {
            kind: 'quiz',
            id: 'p7',
            prompt: L(T`LaTeX says that ´\begin{pmatrix}´ was "ended by ´\end{matrix}´". What is wrong?`, T`LaTeX berkata bahwa ´\begin{pmatrix}´ "ended by ´\end{matrix}´". Apa yang salah?`),
            options: [
              L(T`the names of the beginning and the end of the environment differ`, T`nama awal dan akhir lingkungan berbeda`),
              L(T`pmatrix does not exist`, T`pmatrix tidak ada`),
              L(T`the matrix has too many rows`, T`matriks memiliki terlalu banyak baris`),
              L(T`amsmath is not installed`, T`amsmath tidak terpasang`),
            ],
            answer: 0,
            explain: L(T`An environment is closed by the ´\end´ with the same name: ´\begin{pmatrix} ... \end{pmatrix}´.`, T`Sebuah lingkungan ditutup oleh ´\end´ dengan nama yang sama: ´\begin{pmatrix} ... \end{pmatrix}´.`),
            hint: L(T`Compare the two names.`, T`Bandingkan kedua nama itu.`),
          },
        },
        {
          kind: 'activity',
          title: L('Where do packages go?', 'Di mana paket ditaruh?'),
          step: {
            kind: 'quiz',
            id: 'p8',
            prompt: L(T`Where must ´\usepackage{amsmath}´ be written?`, T`Di mana ´\usepackage{amsmath}´ harus ditulis?`),
            options: [
              L(T`in the preamble, before ´\begin{document}´`, T`di preamble, sebelum ´\begin{document}´`),
              L(T`right before the first equation`, T`tepat sebelum persamaan pertama`),
              L(T`after ´\end{document}´`, T`setelah ´\end{document}´`),
              L(T`it is loaded automatically`, T`ia dimuat otomatis`),
            ],
            answer: 0,
            explain: L(T`Packages change how the whole document is processed, so they are loaded in the preamble.`, T`Paket mengubah cara seluruh dokumen diproses, sehingga dimuat di preamble.`),
            hint: L(T`What is the part before ´\begin{document}´ called?`, T`Apa nama bagian sebelum ´\begin{document}´?`),
          },
        },
        {
          kind: 'activity',
          title: L('Count the special characters', 'Hitung karakter khusus'),
          step: {
            kind: 'math',
            id: 'p9',
            hints: [L(T`Hash, dollar sign, percent, ampersand, underscore, the two braces, tilde, caret, backslash.`, T`Pagar, tanda dolar, persen, ampersand, garis bawah, kedua kurung kurawal, tilde, tanda sisipan, garis miring terbalik.`), L(T`Count them one by one.`, T`Hitung satu per satu.`)],
            explain: L(T`The ten special characters are ´#´, the dollar sign, ´%´, ´&´, ´_´, ´{´, ´}´, ´~´, ´^´ and the backslash.`, T`Sepuluh karakter khusus adalah ´#´, tanda dolar, ´%´, ´&´, ´_´, ´{´, ´}´, ´~´, ´^´, dan garis miring terbalik.`),
            prompt: L(T`How many characters have a special meaning in LaTeX text?`, T`Berapa karakter yang memiliki arti khusus dalam teks LaTeX?`),
            given: String.raw`n=v`,
            blanks: [{ label: 'n =', answer: 10 }],
          },
        },
        {
          kind: 'activity',
          title: L('Formulas on a web page', 'Rumus di halaman web'),
          step: {
            kind: 'quiz',
            id: 'p10',
            prompt: L(T`You want LaTeX formulas drawn in a web page. What do you use?`, T`Kamu ingin rumus LaTeX digambar di halaman web. Apa yang kamu pakai?`),
            options: [
              L(T`KaTeX or MathJax`, T`KaTeX atau MathJax`),
              L(T`BibTeX`, T`BibTeX`),
              L(T`pdflatex in the browser tab`, T`pdflatex di tab peramban`),
              L(T`the ´\maketitle´ command`, T`perintah ´\maketitle´`),
            ],
            answer: 0,
            explain: L(T`KaTeX and MathJax are JavaScript libraries that read LaTeX math and draw it in the browser. BibTeX makes reference lists.`, T`KaTeX dan MathJax adalah pustaka JavaScript yang membaca matematika LaTeX dan menggambarnya di peramban. BibTeX membuat daftar pustaka.`),
            hint: L(T`Which of them are JavaScript libraries?`, T`Mana yang merupakan pustaka JavaScript?`),
          },
        },
        {
          kind: 'activity',
          title: L('Limits of a sum', 'Batas sebuah jumlah'),
          step: {
            kind: 'quiz',
            id: 'p11',
            prompt: L(T`In ´\sum_{i=1}^{n} i´, what does ´_{i=1}´ set?`, T`Pada ´\sum_{i=1}^{n} i´, apa yang diatur ´_{i=1}´?`),
            options: [
              L(T`the lower limit: the index starts at $i=1$`, T`batas bawah: indeks mulai dari $i=1$`),
              L(T`the upper limit`, T`batas atas`),
              L(T`a subscript on the letter $i$ only`, T`subskrip pada huruf $i$ saja`),
              L(T`the number of terms`, T`banyaknya suku`),
            ],
            answer: 0,
            explain: L(T`On a big operator the subscript is the lower limit and the superscript the upper limit; the braces group ´i=1´.`, T`Pada operator besar subskrip adalah batas bawah dan superskrip batas atas; kurung kurawal mengelompokkan ´i=1´.`),
            hint: L(T`Which part goes under the sigma?`, T`Bagian mana yang ditaruh di bawah sigma?`),
          },
        },
        {
          kind: 'activity',
          title: L('Columns of a matrix', 'Kolom sebuah matriks'),
          step: {
            kind: 'math',
            id: 'p12',
            hints: [L(T`The ampersand separates two neighboring cells in a row.`, T`Ampersand memisahkan dua sel bertetangga dalam satu baris.`), L(T`$n$ cells need $n-1$ separators.`, T`$n$ sel memerlukan $n-1$ pemisah.`)],
            explain: L(T`A row of $4$ cells has $3$ ampersands between them: ´a & b & c & d \\´.`, T`Satu baris $4$ sel memiliki $3$ ampersand di antaranya: ´a & b & c & d \\´.`),
            prompt: L(T`How many ´&´ are in each row of a matrix with $4$ columns?`, T`Berapa banyak ´&´ dalam setiap baris matriks dengan $4$ kolom?`),
            given: String.raw`k=v`,
            blanks: [{ label: 'k =', answer: 3 }],
          },
        },
      ],
    },

    /* --------------------------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: LaTeX at a glance', 'Ringkasan: LaTeX sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **What it is:** plain text with commands, compiled by ´pdflatex´ into a PDF; TeX (Knuth) is the engine and LaTeX (Lamport) the commands.
- **Document:** ´\documentclass´, a preamble with ´\usepackage´, and ´\begin{document}´ ... ´\end{document}´.
- **Math mode:** ´$...$´ inline, ´\[ ... \]´ displayed, ´equation´ for numbered; scripts take one character, so use braces: ´x^{10}´.
- **Commands:** ´\frac{a}{b}´, ´\sqrt[n]{x}´, ´\sum_{i=1}^{n}´, ´\int_a^b´, ´\left( ... \right)´, Greek letters by name, ´\sin´ and ´\lim´ for functions.
- **Environments:** ´pmatrix´, ´cases´, ´align´, ´itemize´, ´tabular´, ´figure´: ´&´ separates cells, ´\\´ ends a row.
- **Special characters:** ´# $ % & _ { } ~ ^ \´ must be escaped; escape text that comes from outside.
- **Builds:** several runs for labels and citations; ´pdflatex´, ´bibtex´, ´pdflatex´, ´pdflatex´, or ´latexmk´ and Overleaf.
- **Errors:** read the first one; undefined control sequence, missing $, unbalanced braces; compile often and use a minimal example.
- **Elsewhere:** KaTeX and MathJax on the web, SymPy ´latex()´, raw strings for backslashes.`,
            T`- **Apa itu:** teks biasa dengan perintah, dikompilasi ´pdflatex´ menjadi PDF; TeX (Knuth) adalah mesinnya dan LaTeX (Lamport) perintahnya.
- **Dokumen:** ´\documentclass´, preamble dengan ´\usepackage´, dan ´\begin{document}´ ... ´\end{document}´.
- **Mode matematika:** ´$...$´ sebaris, ´\[ ... \]´ tampilan, ´equation´ untuk yang bernomor; skrip mengambil satu karakter, jadi pakai kurung kurawal: ´x^{10}´.
- **Perintah:** ´\frac{a}{b}´, ´\sqrt[n]{x}´, ´\sum_{i=1}^{n}´, ´\int_a^b´, ´\left( ... \right)´, huruf Yunani menurut nama, ´\sin´ dan ´\lim´ untuk fungsi.
- **Lingkungan:** ´pmatrix´, ´cases´, ´align´, ´itemize´, ´tabular´, ´figure´: ´&´ memisahkan sel, ´\\´ mengakhiri baris.
- **Karakter khusus:** ´# $ % & _ { } ~ ^ \´ harus di-escape; beri escape pada teks yang datang dari luar.
- **Pembangunan:** beberapa kali jalan untuk label dan kutipan; ´pdflatex´, ´bibtex´, ´pdflatex´, ´pdflatex´, atau ´latexmk´ dan Overleaf.
- **Galat:** baca yang pertama; undefined control sequence, missing $, kurung kurawal tak seimbang; kompilasi sering dan pakai contoh minimal.
- **Di tempat lain:** KaTeX dan MathJax di web, ´latex()´ SymPy, raw string untuk garis miring terbalik.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('LaTeX', 'LaTeX'), definition: L('A system of commands on top of TeX for writing documents, in which you describe the structure and a compiler produces the layout.', 'Sistem perintah di atas TeX untuk menulis dokumen, yang di dalamnya kamu menguraikan struktur dan kompilator menghasilkan tata letaknya.') },
    { term: L('TeX', 'TeX'), definition: L('The typesetting engine written by Donald Knuth, which LaTeX is built on.', 'Mesin penyusunan huruf yang ditulis Donald Knuth, tempat LaTeX dibangun.') },
    { term: L('Compiler', 'Kompilator'), definition: L('The program, such as pdflatex, that reads the source file and produces the PDF.', 'Program, seperti pdflatex, yang membaca berkas sumber dan menghasilkan PDF.') },
    { term: L('Preamble', 'Preamble'), definition: L('The part of a LaTeX file before the begin document line, where the class, packages and settings are given.', 'Bagian berkas LaTeX sebelum baris begin document, tempat kelas, paket, dan pengaturan diberikan.') },
    { term: L('Package', 'Paket'), definition: L('An add-on loaded with the usepackage command that provides new commands or changes how the document is built, such as amsmath.', 'Tambahan yang dimuat dengan perintah usepackage yang menyediakan perintah baru atau mengubah cara dokumen dibangun, seperti amsmath.') },
    { term: L('Environment', 'Lingkungan'), definition: L('A block between a begin command and an end command with the same name, such as equation, itemize or pmatrix.', 'Blok di antara perintah begin dan perintah end dengan nama yang sama, seperti equation, itemize, atau pmatrix.') },
    { term: L('Math mode', 'Mode matematika'), definition: L('The state in which LaTeX reads formulas: between dollar signs inside text, or in a displayed equation.', 'Keadaan ketika LaTeX membaca rumus: di antara tanda dolar dalam teks, atau dalam persamaan tampilan.') },
    { term: L('BibTeX', 'BibTeX'), definition: L('A program that turns a bib file of sources into the formatted list of references cited in a document.', 'Program yang mengubah berkas bib berisi sumber menjadi daftar pustaka terformat yang dikutip dalam dokumen.') },
    { term: L('Escape character', 'Karakter escape'), definition: L('The backslash that turns a special character into an ordinary one, as in the percent escape, so that it prints itself.', 'Garis miring terbalik yang mengubah karakter khusus menjadi biasa, seperti pada escape persen, agar ia tercetak apa adanya.') },
  ],

  howTo: [
    {
      name: L('How to write your first LaTeX document', 'Cara menulis dokumen LaTeX pertamamu'),
      description: L('Start from a minimal file with a class and a body, compile it, and add one thing at a time.', 'Mulai dari berkas minimal dengan kelas dan isi, kompilasi, dan tambahkan satu hal sekali waktu.'),
      steps: [
        { name: L('Choose where to compile', 'Pilih tempat mengompilasi'), text: L('Create a free Overleaf project, or install TeX Live or MiKTeX and an editor.', 'Buat proyek Overleaf gratis, atau pasang TeX Live atau MiKTeX dan sebuah editor.') },
        { name: L('Write the skeleton', 'Tulis kerangkanya'), text: L('Create main.tex with the document class, the begin document and end document lines, and a sentence between them.', 'Buat main.tex dengan kelas dokumen, baris begin document dan end document, dan sebuah kalimat di antaranya.') },
        { name: L('Compile and look', 'Kompilasi dan lihat'), text: L('Run pdflatex main, or press Compile, and open the PDF.', 'Jalankan pdflatex main, atau tekan Compile, dan buka PDF-nya.') },
        { name: L('Add one thing at a time', 'Tambahkan satu hal sekali waktu'), text: L('Add a section, a formula or a list, compile again after each, and read the first error message if one appears.', 'Tambahkan bagian, rumus, atau daftar, kompilasi lagi setelah masing-masing, dan baca pesan galat pertama bila ada.') },
      ],
    },
    {
      name: L('How to write a formula in LaTeX', 'Cara menulis rumus di LaTeX'),
      description: L('Choose inline or displayed math, build the structure with braces, then add the symbols.', 'Pilih matematika sebaris atau tampilan, bangun strukturnya dengan kurung kurawal, lalu tambahkan simbolnya.'),
      steps: [
        { name: L('Enter math mode', 'Masuk ke mode matematika'), text: L('Put the formula between dollar signs inside a sentence, or between backslash bracket commands for a formula on its own line.', 'Taruh rumus di antara tanda dolar dalam kalimat, atau di antara perintah kurung siku bergaris miring terbalik untuk rumus pada barisnya sendiri.') },
        { name: L('Build the structure', 'Bangun strukturnya'), text: L('Use frac for fractions, sqrt for roots, and the caret and underscore for scripts, with braces around anything longer than one character.', 'Pakai frac untuk pecahan, sqrt untuk akar, dan tanda sisipan serta garis bawah untuk skrip, dengan kurung kurawal di sekeliling apa pun yang lebih dari satu karakter.') },
        { name: L('Add symbols and function names', 'Tambahkan simbol dan nama fungsi'), text: L('Write Greek letters and operators by name, and write sin, cos, log and lim with a backslash so they come out upright.', 'Tulis huruf Yunani dan operator menurut nama, dan tulis sin, cos, log, dan lim dengan garis miring terbalik agar tampil tegak.') },
        { name: L('Check before compiling', 'Periksa sebelum mengompilasi'), text: L('Make sure every brace, left and right, and begin and end is paired, and preview the formula.', 'Pastikan setiap kurung kurawal, left dan right, serta begin dan end berpasangan, dan pratinjau rumusnya.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is LaTeX used for?', 'Untuk apa LaTeX dipakai?'),
      a: L(
        'It is used to write documents with a lot of mathematics or structure: research papers, theses, textbooks, problem sets and slides. It sets formulas well, numbers sections and equations automatically, manages citations, and keeps the style consistent.',
        'Ia dipakai untuk menulis dokumen yang banyak matematika atau strukturnya: makalah penelitian, tesis, buku teks, kumpulan soal, dan slide. Ia menyusun rumus dengan baik, menomori bagian dan persamaan secara otomatis, mengelola kutipan, dan menjaga gaya tetap konsisten.',
      ),
    },
    {
      q: L('Is LaTeX a programming language?', 'Apakah LaTeX bahasa pemrograman?'),
      a: L(
        'LaTeX is a markup language built from macros, and the TeX engine underneath it is capable of real computation. In practice you write documents, not programs, and you can ignore the programming side.',
        'LaTeX adalah bahasa markah yang dibangun dari makro, dan mesin TeX di bawahnya mampu melakukan komputasi sungguhan. Dalam praktik kamu menulis dokumen, bukan program, dan kamu dapat mengabaikan sisi pemrogramannya.',
      ),
    },
    {
      q: L('What is the difference between TeX and LaTeX?', 'Apa beda TeX dan LaTeX?'),
      a: L(
        'TeX is the typesetting engine written by Donald Knuth. LaTeX is a set of commands on top of it, by Leslie Lamport, that lets you describe a document by its structure, with sections, lists and equations, instead of its layout.',
        'TeX adalah mesin penyusunan huruf yang ditulis Donald Knuth. LaTeX adalah seperangkat perintah di atasnya, oleh Leslie Lamport, yang memungkinkan kamu menguraikan dokumen menurut strukturnya, dengan bagian, daftar, dan persamaan, bukan tata letaknya.',
      ),
    },
    {
      q: L('How do you write a fraction, a square root or a sum in LaTeX?', 'Bagaimana menulis pecahan, akar kuadrat, atau jumlah di LaTeX?'),
      a: L(
        'Use frac with two braced arguments for a fraction, sqrt with one for a root, and sum with an underscore and a caret for the limits, all inside math mode between dollar signs.',
        'Pakai frac dengan dua argumen berkurung kurawal untuk pecahan, sqrt dengan satu untuk akar, dan sum dengan garis bawah dan tanda sisipan untuk batasnya, semuanya dalam mode matematika di antara tanda dolar.',
      ),
    },
    {
      q: L('How do you compile a LaTeX document?', 'Bagaimana mengompilasi dokumen LaTeX?'),
      a: L(
        'Save it as main.tex and run pdflatex main, or press Compile on Overleaf. If the document has references or a bibliography, run it again, with bibtex in between for citations, or let latexmk repeat the steps.',
        'Simpan sebagai main.tex dan jalankan pdflatex main, atau tekan Compile di Overleaf. Jika dokumen memiliki rujukan atau daftar pustaka, jalankan lagi, dengan bibtex di antaranya untuk kutipan, atau biarkan latexmk mengulang langkahnya.',
      ),
    },
    {
      q: L('Why does LaTeX say "Undefined control sequence"?', 'Mengapa LaTeX berkata "Undefined control sequence"?'),
      a: L(
        'LaTeX met a command it does not know. Either the name is misspelled, or the package that defines it is not loaded in the preamble, as with mathbb without amssymb. Fix the first such error, since the others often follow from it.',
        'LaTeX menemui perintah yang tidak dikenalnya. Entah namanya salah eja, atau paket yang mendefinisikannya belum dimuat di preamble, seperti mathbb tanpa amssymb. Perbaiki galat pertama seperti itu, karena yang lain sering mengikutinya.',
      ),
    },
    {
      q: L('How do you write LaTeX in Markdown or on a website?', 'Bagaimana menulis LaTeX di Markdown atau di situs web?'),
      a: L(
        'Many Markdown tools, Jupyter notebooks and wikis draw formulas written between single or double dollar signs. On your own page, include KaTeX or MathJax, which read the same code and draw it in the browser.',
        'Banyak alat Markdown, notebook Jupyter, dan wiki menggambar rumus yang ditulis di antara tanda dolar tunggal atau ganda. Di halamanmu sendiri, sertakan KaTeX atau MathJax, yang membaca kode yang sama dan menggambarnya di peramban.',
      ),
    },
    {
      q: L('How does LaTeX compare with a word processor?', 'Bagaimana LaTeX dibandingkan dengan pengolah kata?'),
      a: L(
        'A word processor shows the page as you type; LaTeX makes you describe the content and builds the page after. LaTeX wins for formulas, long documents and references; a word processor is quicker for short, visual, collaborative notes.',
        'Pengolah kata menampilkan halaman saat kamu mengetik; LaTeX membuat kamu menguraikan isi dan menyusun halaman sesudahnya. LaTeX unggul untuk rumus, dokumen panjang, dan rujukan; pengolah kata lebih cepat untuk catatan pendek, visual, dan kolaboratif.',
      ),
    },
  ],

  references: [
    { title: 'LaTeX: A Document Preparation System (2nd ed.)', author: 'Leslie Lamport', year: 1994, source: 'Addison-Wesley' },
    { title: 'The TeXbook', author: 'Donald E. Knuth', year: 1984, source: 'Addison-Wesley' },
    { title: 'The Not So Short Introduction to LaTeX2e', author: 'Tobias Oetiker, Hubert Partl, Irene Hyna, Elisabeth Schlegl', year: 2021, source: 'CTAN (lshort)' },
    { title: 'The LaTeX Companion (2nd ed.)', author: 'Frank Mittelbach, Michel Goossens', year: 2004, source: 'Addison-Wesley' },
    { title: 'Digital Typography', author: 'Donald E. Knuth', year: 1999, source: 'CSLI Publications' },
    { title: 'User\'s Guide for the amsmath Package', author: 'American Mathematical Society', year: 2002, source: 'AMS' },
  ],

  related: ['algebraic-expressions', 'exponents-and-radicals', 'real-numbers', 'big-o-notation'],
}
