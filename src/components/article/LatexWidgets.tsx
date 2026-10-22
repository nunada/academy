import { useState } from 'react'
import { useI18n } from '../../i18n'
import { ARGS, CATEGORY_NAME, SYMBOLS, texDocument, texGen, texLint, type DiagKind, type DocClass, type DocPackage, type GenKind, type GenParams, type SymbolCategory } from '../../lib/latex'
import { Tex } from '../ui'
import { Frame, L } from './widgetKit'

/** Copy text to the clipboard, saying so for a moment; the clipboard may be unavailable (an insecure page, a blocked permission). */
function CopyButton({ text, label }: { text: string; label: { en: string; id: string } }) {
  const { tc } = useI18n()
  const [done, setDone] = useState(false)
  return (
    <button
      className="btn ghost"
      onClick={() => {
        try {
          void navigator.clipboard?.writeText(text).then(() => {
            setDone(true)
            setTimeout(() => setDone(false), 1600)
          })
        } catch {
          setDone(false)
        }
      }}
    >
      {done ? tc(L('Copied', 'Tersalin')) : tc(label)}
    </button>
  )
}

/* ------------------------------------------------------------------------------------ the editor */

const MESSAGE: Record<DiagKind, (arg: string) => { en: string; id: string }> = {
  'extra-close': () => L('A closing brace } has no opening brace { before it.', 'Kurung kurawal penutup } tidak punya kurung kurawal pembuka { sebelumnya.'),
  'missing-close': () => L('This { is never closed: LaTeX says "Missing } inserted" or swallows the rest.', '{ ini tidak pernah ditutup: LaTeX berkata "Missing } inserted" atau menelan sisanya.'),
  'extra-right': () => L('\\right without a \\left before it.', '\\right tanpa \\left sebelumnya.'),
  'missing-right': () => L('\\left without a \\right: every \\left needs its \\right (write \\right. for no bracket).', '\\left tanpa \\right: setiap \\left memerlukan \\right (tulis \\right. bila tanpa kurung).'),
  'env-mismatch': (a) => L(`\\begin{${a.split('|')[0]}} is closed by \\end{${a.split('|')[1]}}: the names must match.`, `\\begin{${a.split('|')[0]}} ditutup oleh \\end{${a.split('|')[1]}}: namanya harus sama.`),
  'env-extra-end': (a) => L(`\\end{${a}} has no \\begin{${a}}.`, `\\end{${a}} tidak punya \\begin{${a}}.`),
  'env-unclosed': (a) => L(`\\begin{${a}} is never closed with \\end{${a}}.`, `\\begin{${a}} tidak pernah ditutup dengan \\end{${a}}.`),
  undefined: (a) => L(`Undefined control sequence \\${a}: the name is misspelled, or the package that defines it is not loaded.`, `Undefined control sequence \\${a}: namanya salah eja, atau paket yang mendefinisikannya belum dimuat.`),
  unsupported: (a) => L(`\\${a} is valid LaTeX, but this page's small renderer cannot draw it (a real LaTeX would).`, `\\${a} sah di LaTeX, tetapi perender kecil di halaman ini tidak dapat menggambarnya (LaTeX sungguhan bisa).`),
  'missing-arg': (a) => (a === 'begin' || a === 'end' ? L(`\\${a} needs an environment name in braces, such as \\${a}{pmatrix}.`, `\\${a} memerlukan nama lingkungan dalam kurung kurawal, misalnya \\${a}{pmatrix}.`) : L(`\\${a} needs ${ARGS[a] ?? 1} argument${(ARGS[a] ?? 1) === 1 ? '' : 's'}, each in braces: \\${a}${'{…}'.repeat(ARGS[a] ?? 1)}.`, `\\${a} memerlukan ${ARGS[a] ?? 1} argumen, masing-masing dalam kurung kurawal: \\${a}${'{…}'.repeat(ARGS[a] ?? 1)}.`)),
  dollar: () => L('Do not type $ inside the formula: the dollar signs go around it, and this one would end the mathematics early.', 'Jangan ketik $ di dalam rumus: tanda dolar ditaruh di sekelilingnya, dan yang ini akan mengakhiri matematika lebih awal.'),
  comment: () => L('% starts a comment: LaTeX ignores the rest of the line (write \\% for a percent sign).', '% memulai komentar: LaTeX mengabaikan sisa baris (tulis \\% untuk tanda persen).'),
  ampersand: () => L('& only works inside an environment such as pmatrix or align; write \\& for the character itself.', '& hanya berfungsi di dalam lingkungan seperti pmatrix atau align; tulis \\& untuk karakternya.'),
  'script-multi': (a) => L(`A script takes one character: write braces, ${a === '^' ? 'x^{10}' : 'a_{ij}'}, or only the first character is raised or lowered.`, `Skrip hanya mengambil satu karakter: tulis kurung kurawal, ${a === '^' ? 'x^{10}' : 'a_{ij}'}, atau hanya karakter pertama yang dinaikkan atau diturunkan.`),
  'script-sign': (a) => L(`The sign alone becomes the ${a === '^' ? 'exponent' : 'subscript'}: write e^{-x}, not e^-x.`, `Tandanya saja yang menjadi ${a === '^' ? 'eksponen' : 'subskrip'}: tulis e^{-x}, bukan e^-x.`),
}

const PRESETS: { src: string; label?: string }[] = [
  { src: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
  { src: 'e^{i\\pi} + 1 = 0' },
  { src: '\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}' },
  { src: '\\int_{0}^{1} x^2 \\, dx = \\frac{1}{3}' },
  { src: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1' },
  { src: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
  { src: 'f(x) = \\begin{cases} x^2 & x \\ge 0 \\\\ -x & x < 0 \\end{cases}' },
]
const BROKEN = ['\\frac{a}{b', 'x^10 + e^-x', '\\left( \\frac{a}{b}', '\\binom{n}{k}', '\\begin{pmatrix} 1 & 2 \\end{matrix}']

export function LatexLive() {
  const { tc } = useI18n()
  const [src, setSrc] = useState(PRESETS[0].src)
  const [display, setDisplay] = useState(true)
  const diags = texLint(src)
  const lineCol = (pos: number): string => {
    const before = src.slice(0, pos)
    const line = before.split('\n').length
    const col = pos - (before.lastIndexOf('\n') + 1) + 1
    return `${line}:${col}`
  }
  return (
    <Frame name="texlive">
      <label className="lbl" style={{ display: 'block' }}>
        {tc(L('LaTeX (without the dollar signs)', 'LaTeX (tanpa tanda dolar)'))}
        <textarea
          value={src}
          rows={3}
          spellCheck={false}
          aria-label={tc(L('LaTeX formula', 'Rumus LaTeX'))}
          onChange={(e) => setSrc(e.target.value)}
          style={{ width: '100%', fontFamily: 'var(--mono)', fontSize: '0.9rem', boxSizing: 'border-box', marginTop: 4 }}
        />
      </label>
      <div className="chips">
        {PRESETS.map((p) => (
          <button key={p.src} className="chip ghost" onClick={() => setSrc(p.src)}>
            <Tex src={p.src} />
          </button>
        ))}
      </div>
      <div className="chips">
        {BROKEN.map((p) => (
          <button key={p} className="chip ghost" onClick={() => setSrc(p)} style={{ fontFamily: 'var(--mono)' }}>
            {p.length > 22 ? `${p.slice(0, 20)}…` : p}
          </button>
        ))}
        <button className={`chip ${display ? 'on' : ''}`} onClick={() => setDisplay(!display)} aria-pressed={display}>
          {tc(L('display style', 'gaya tampilan'))}
        </button>
      </div>
      <div style={{ overflowX: 'auto', padding: '8px 4px', minHeight: '3.5em' }} aria-live="polite">
        <Tex src={src} display={display} />
      </div>
      <div className="wgtout" aria-live="polite">
        {diags.length === 0 ? (
          <p className="okline">{tc(L('No mistakes found by the linter.', 'Linter tidak menemukan kesalahan.'))}</p>
        ) : (
          <ul style={{ margin: '4px 0', paddingLeft: '1.2em' }}>
            {diags.map((d, i) => (
              <li key={i} className={d.kind === 'comment' || d.kind === 'unsupported' ? 'small' : 'noline'} style={{ overflowWrap: 'anywhere' }}>
                <b>{lineCol(d.pos)}</b> <code>{src.slice(d.pos, d.pos + 14).split('\n')[0]}</code>: {tc(MESSAGE[d.kind](d.arg ?? ''))}
              </li>
            ))}
          </ul>
        )}
        <p className="small muted">{tc(L('The preview is drawn by this page\'s small renderer; a real LaTeX knows many more commands. The linter finds the mistakes that make LaTeX stop or print something else.', 'Pratinjau digambar oleh perender kecil di halaman ini; LaTeX sungguhan mengenal jauh lebih banyak perintah. Linter menemukan kesalahan yang membuat LaTeX berhenti atau mencetak hal lain.'))}</p>
      </div>
    </Frame>
  )
}

/* ---------------------------------------------------------------------------------------- symbols */

export function LatexSymbols() {
  const { tc, lang } = useI18n()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<SymbolCategory | 'all'>('all')
  const needle = q.trim().toLowerCase().replace(/^\\/, '')
  const rows = SYMBOLS.filter((x) => (cat === 'all' || x.category === cat) && (needle === '' || x.cmd.toLowerCase().includes(needle) || x.name.en.toLowerCase().includes(needle) || x.name.id.toLowerCase().includes(needle)))
  return (
    <Frame name="texsymbols">
      <div className="inrow">
        <label className="lbl" style={{ flex: '1 1 10em' }}>
          {tc(L('search', 'cari'))} <input style={{ flex: '1 1 8em', minWidth: 0, width: 'auto' }} value={q} aria-label={tc(L('search a symbol', 'cari simbol'))} placeholder={tc(L('alpha, integral, ≤ …', 'alfa, integral, kurang dari …'))} onChange={(e) => setQ(e.target.value)} />
        </label>
      </div>
      <div className="chips">
        <button className={`chip ${cat === 'all' ? 'on' : ''}`} onClick={() => setCat('all')} aria-pressed={cat === 'all'}>
          {tc(L('all', 'semua'))}
        </button>
        {(Object.keys(CATEGORY_NAME) as SymbolCategory[]).map((c) => (
          <button key={c} className={`chip ghost ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)} aria-pressed={cat === c}>
            {tc(CATEGORY_NAME[c])}
          </button>
        ))}
      </div>
      <p className="small muted" aria-live="polite">
        {rows.length} {tc(L('of', 'dari'))} {SYMBOLS.length}
      </p>
      <div style={{ overflow: 'auto', maxHeight: '20em' }}>
        <table className="rtable">
          <thead>
            <tr>
              <th>{tc(L('symbol', 'simbol'))}</th>
              <th>{tc(L('type this', 'ketik ini'))}</th>
              <th>{tc(L('name', 'nama'))}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x.cmd}>
                <td>
                  <Tex src={`\\${x.cmd}`} />
                </td>
                <td>
                  <code>\{x.cmd}</code>
                </td>
                <td>
                  {lang === 'id' ? x.name.id : x.name.en}
                  {x.pkg && <span className="small muted"> · {tc(L('needs', 'perlu'))} {x.pkg}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && <p className="noline">{tc(L('Nothing matches. Try the name in English or Indonesian, or part of the command.', 'Tidak ada yang cocok. Coba nama dalam bahasa Inggris atau Indonesia, atau sebagian perintahnya.'))}</p>}
    </Frame>
  )
}

/* ----------------------------------------------------------------------------------------- builder */

interface Field {
  key: string
  label: { en: string; id: string }
  def: string
}

const BUILD: { kind: GenKind; icon: string; name: { en: string; id: string }; fields: Field[] }[] = [
  { kind: 'fraction', icon: '\\frac{a}{b}', name: L('fraction', 'pecahan'), fields: [{ key: 'num', label: L('numerator', 'pembilang'), def: 'a+b' }, { key: 'den', label: L('denominator', 'penyebut'), def: '2' }] },
  { kind: 'root', icon: '\\sqrt{x}', name: L('root', 'akar'), fields: [{ key: 'radicand', label: L('inside', 'di dalam'), def: 'x' }, { key: 'index', label: L('index (optional)', 'indeks (opsional)'), def: '3' }] },
  { kind: 'power', icon: 'x^{n}', name: L('power', 'pangkat'), fields: [{ key: 'base', label: L('base', 'basis'), def: 'x' }, { key: 'exponent', label: L('exponent', 'eksponen'), def: '10' }] },
  { kind: 'sum', icon: '\\sum', name: L('sum', 'jumlah'), fields: [{ key: 'var', label: L('variable', 'peubah'), def: 'i' }, { key: 'from', label: L('from', 'dari'), def: '1' }, { key: 'to', label: L('to', 'sampai'), def: 'n' }, { key: 'body', label: L('term', 'suku'), def: 'i^2' }] },
  { kind: 'product', icon: '\\prod', name: L('product', 'hasil kali'), fields: [{ key: 'var', label: L('variable', 'peubah'), def: 'k' }, { key: 'from', label: L('from', 'dari'), def: '1' }, { key: 'to', label: L('to', 'sampai'), def: 'n' }, { key: 'body', label: L('factor', 'faktor'), def: 'k' }] },
  { kind: 'integral', icon: '\\int', name: L('integral', 'integral'), fields: [{ key: 'var', label: L('variable', 'peubah'), def: 'x' }, { key: 'from', label: L('from', 'dari'), def: '0' }, { key: 'to', label: L('to', 'sampai'), def: '1' }, { key: 'body', label: L('integrand', 'integran'), def: 'x^2' }] },
  { kind: 'limit', icon: '\\lim', name: L('limit', 'limit'), fields: [{ key: 'var', label: L('variable', 'peubah'), def: 'x' }, { key: 'to', label: L('tends to', 'menuju'), def: '0' }, { key: 'body', label: L('expression', 'ungkapan'), def: '\\frac{\\sin x}{x}' }] },
  { kind: 'matrix', icon: '\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}', name: L('matrix', 'matriks'), fields: [{ key: 'rows', label: L('rows (1–5)', 'baris (1–5)'), def: '2' }, { key: 'cols', label: L('columns (1–5)', 'kolom (1–5)'), def: '3' }, { key: 'entry', label: L('entry letter', 'huruf entri'), def: 'a' }] },
  { kind: 'cases', icon: '\\begin{cases}x&y\\end{cases}', name: L('piecewise', 'sepotong-sepotong'), fields: [{ key: 'name', label: L('name', 'nama'), def: 'f(x)' }, { key: 'e1', label: L('value 1', 'nilai 1'), def: 'x^2' }, { key: 'c1', label: L('when 1', 'bila 1'), def: 'x \\ge 0' }, { key: 'e2', label: L('value 2', 'nilai 2'), def: '-x' }, { key: 'c2', label: L('when 2', 'bila 2'), def: 'x < 0' }, { key: 'e3', label: L('value 3', 'nilai 3'), def: '' }, { key: 'c3', label: L('when 3', 'bila 3'), def: '' }] },
]

export function LatexBuilder() {
  const { tc } = useI18n()
  const [kind, setKind] = useState<GenKind>('fraction')
  const [values, setValues] = useState<Record<string, GenParams>>(() => Object.fromEntries(BUILD.map((b) => [b.kind, { ...Object.fromEntries(b.fields.map((f) => [f.key, f.def])), fence: 'pmatrix' }])))
  const cur = BUILD.find((b) => b.kind === kind) as (typeof BUILD)[number]
  const p = values[kind]
  const out = texGen(kind, p)
  const diags = texLint(out)
  const set = (key: string, v: string): void => setValues({ ...values, [kind]: { ...p, [key]: v } })
  return (
    <Frame name="texgen">
      <div className="chips">
        {BUILD.map((b) => (
          <button key={b.kind} className={`chip ${kind === b.kind ? 'on' : ''}`} onClick={() => setKind(b.kind)} aria-pressed={kind === b.kind} title={tc(b.name)}>
            <Tex src={b.icon} />
          </button>
        ))}
      </div>
      <p className="small muted">{tc(cur.name)}</p>
      <div className="inrow">
        {cur.fields.map((f) => (
          <label key={f.key} className="lbl" style={{ flex: '1 1 7em' }}>
            {tc(f.label)} <input style={{ flex: '1 1 5em', minWidth: 0, width: 'auto' }} value={p[f.key] ?? ''} aria-label={tc(f.label)} onChange={(e) => set(f.key, e.target.value)} />
          </label>
        ))}
      </div>
      {kind === 'matrix' && (
        <div className="chips">
          {(['pmatrix', 'bmatrix', 'vmatrix'] as const).map((fe) => (
            <button key={fe} className={`chip ghost ${p.fence === fe ? 'on' : ''}`} onClick={() => set('fence', fe)} aria-pressed={p.fence === fe} style={{ fontFamily: 'var(--mono)' }}>
              {fe}
            </button>
          ))}
        </div>
      )}
      <pre className="code" style={{ overflowX: 'auto', margin: '8px 0' }}>
        {out}
      </pre>
      <div style={{ overflowX: 'auto', padding: '4px' }} aria-live="polite">
        <Tex src={out} display />
      </div>
      <div className="inrow">
        <CopyButton text={out} label={L('Copy the code', 'Salin kodenya')} />
        <span className={diags.length === 0 ? 'small okline' : 'small noline'}>{diags.length === 0 ? tc(L('no mistakes found', 'tidak ada kesalahan')) : tc(L('check the fields: the code has a mistake', 'periksa isiannya: kodenya punya kesalahan'))}</span>
      </div>
      <p className="small muted">{tc(L('Put the code between $ … $ in a sentence, or between \\[ and \\] on its own lines.', 'Taruh kodenya di antara $ … $ dalam kalimat, atau di antara \\[ dan \\] pada barisnya sendiri.'))}</p>
    </Frame>
  )
}

/* --------------------------------------------------------------------------------------- document */

const CLASS_NOTE: Record<DocClass, { en: string; id: string }> = {
  article: L('short papers and reports: \\section, optional abstract', 'makalah dan laporan pendek: \\section, abstrak opsional'),
  report: L('longer reports: \\chapter, optional abstract', 'laporan lebih panjang: \\chapter, abstrak opsional'),
  book: L('books: \\chapter, no abstract', 'buku: \\chapter, tanpa abstrak'),
}
const PKG: { id: DocPackage; note: { en: string; id: string } }[] = [
  { id: 'amsmath', note: L('align, \\eqref, \\text in math', 'align, \\eqref, \\text dalam matematika') },
  { id: 'amssymb', note: L('\\mathbb, \\therefore, more symbols', '\\mathbb, \\therefore, lebih banyak simbol') },
  { id: 'graphicx', note: L('\\includegraphics for pictures', '\\includegraphics untuk gambar') },
  { id: 'booktabs', note: L('professional table rules', 'garis tabel profesional') },
  { id: 'hyperref', note: L('clickable links and references', 'tautan dan referensi yang dapat diklik') },
]
const NOTE_TEXT = {
  'graphicx-added': L('graphicx was added because the document has a figure.', 'graphicx ditambahkan karena dokumen memiliki gambar.'),
  'geometry-added': L('geometry sets the page margins.', 'geometry mengatur margin halaman.'),
  'no-abstract': L('A book class has no abstract environment, so the abstract was left out.', 'Kelas book tidak memiliki lingkungan abstract, sehingga abstrak dihilangkan.'),
  'hyperref-last': L('hyperref is loaded last, as it should be.', 'hyperref dimuat paling akhir, sebagaimana mestinya.'),
  'ref-instead-of-eqref': L('Without amsmath there is no \\eqref, so the equation is cited with \\ref and parentheses.', 'Tanpa amsmath tidak ada \\eqref, sehingga persamaan dirujuk dengan \\ref dan tanda kurung.'),
}

export function LatexDocument() {
  const { tc } = useI18n()
  const [docClass, setDocClass] = useState<DocClass>('article')
  const [size, setSize] = useState<10 | 11 | 12>(11)
  const [paper, setPaper] = useState<'a4paper' | 'letterpaper'>('a4paper')
  const [packages, setPackages] = useState<DocPackage[]>(['amsmath'])
  const [margin, setMargin] = useState('2.5cm')
  const [title, setTitle] = useState('My First Document')
  const [author, setAuthor] = useState('Your Name')
  const [abstract, setAbstract] = useState(true)
  const [units, setUnits] = useState(2)
  const [equation, setEquation] = useState(true)
  const [table, setTable] = useState(false)
  const [figure, setFigure] = useState(false)
  const [bibliography, setBibliography] = useState(false)
  const r = texDocument({ docClass, size, paper, packages, margin, title, author, abstract, units, equation, table, figure, bibliography })
  const toggle = (id: DocPackage): void => setPackages(packages.includes(id) ? packages.filter((x) => x !== id) : [...packages, id])
  const flag = (label: { en: string; id: string }, on: boolean, set: (v: boolean) => void) => (
    <button className={`chip ghost ${on ? 'on' : ''}`} onClick={() => set(!on)} aria-pressed={on}>
      {tc(label)}
    </button>
  )
  const bib = '@book{knuth1984,\n  author    = {Donald E. Knuth},\n  title     = {The {\\TeX}book},\n  publisher = {Addison-Wesley},\n  year      = {1984}\n}'
  return (
    <Frame name="texdoc">
      <div className="chips">
        {(['article', 'report', 'book'] as DocClass[]).map((c) => (
          <button key={c} className={`chip ${docClass === c ? 'on' : ''}`} onClick={() => setDocClass(c)} aria-pressed={docClass === c} style={{ fontFamily: 'var(--mono)' }}>
            {c}
          </button>
        ))}
        {([10, 11, 12] as const).map((n) => (
          <button key={n} className={`chip ghost ${size === n ? 'on' : ''}`} onClick={() => setSize(n)} aria-pressed={size === n}>
            {n} pt
          </button>
        ))}
        {(['a4paper', 'letterpaper'] as const).map((n) => (
          <button key={n} className={`chip ghost ${paper === n ? 'on' : ''}`} onClick={() => setPaper(n)} aria-pressed={paper === n} style={{ fontFamily: 'var(--mono)' }}>
            {n}
          </button>
        ))}
      </div>
      <p className="small muted">{tc(CLASS_NOTE[docClass])}</p>
      <div className="chips">
        {PKG.map((x) => (
          <button key={x.id} className={`chip ghost ${packages.includes(x.id) ? 'on' : ''}`} onClick={() => toggle(x.id)} aria-pressed={packages.includes(x.id)} title={tc(x.note)} style={{ fontFamily: 'var(--mono)' }}>
            {x.id}
          </button>
        ))}
      </div>
      <div className="inrow">
        <label className="lbl" style={{ flex: '2 1 9em' }}>
          {tc(L('title', 'judul'))} <input style={{ flex: '1 1 6em', minWidth: 0, width: 'auto' }} value={title} aria-label={tc(L('title', 'judul'))} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label className="lbl" style={{ flex: '1 1 7em' }}>
          {tc(L('author', 'penulis'))} <input style={{ flex: '1 1 5em', minWidth: 0, width: 'auto' }} value={author} aria-label={tc(L('author', 'penulis'))} onChange={(e) => setAuthor(e.target.value)} />
        </label>
        <label className="lbl">
          {tc(L('margin', 'margin'))} <input style={{ width: '5em' }} value={margin} aria-label={tc(L('margin', 'margin'))} onChange={(e) => setMargin(e.target.value)} />
        </label>
      </div>
      <div className="chips">
        {flag(L('abstract', 'abstrak'), abstract, setAbstract)}
        {flag(L('equation', 'persamaan'), equation, setEquation)}
        {flag(L('table', 'tabel'), table, setTable)}
        {flag(L('figure', 'gambar'), figure, setFigure)}
        {flag(L('bibliography', 'daftar pustaka'), bibliography, setBibliography)}
      </div>
      <label className="lbl slider">
        {docClass === 'article' ? tc(L('sections', 'bagian')) : tc(L('chapters', 'bab'))} <b>{units}</b>
        <input type="range" min={1} max={4} value={units} aria-label={tc(L('units', 'satuan'))} onChange={(e) => setUnits(Number(e.target.value))} />
      </label>
      <pre className="code" style={{ overflowX: 'auto', margin: '8px 0', maxHeight: '26em' }}>
        {r.source}
      </pre>
      <div className="inrow">
        <CopyButton text={r.source} label={L('Copy main.tex', 'Salin main.tex')} />
        <span className="small muted">{r.source.split('\n').length - 1} {tc(L('lines', 'baris'))}</span>
      </div>
      <div className="wgtout" aria-live="polite">
        <p className="small">
          {tc(L('Save it as main.tex and run', 'Simpan sebagai main.tex dan jalankan'))}: <code style={{ overflowWrap: 'anywhere' }}>{r.commands.join(' && ')}</code>
        </p>
        {bibliography && (
          <>
            <p className="small">{tc(L('and put this in references.bib:', 'dan taruh ini di references.bib:'))}</p>
            <pre className="code" style={{ overflowX: 'auto', margin: '4px 0' }}>
              {bib}
            </pre>
          </>
        )}
        <ul style={{ margin: '4px 0', paddingLeft: '1.2em' }}>
          {r.notes.map((n) => (
            <li key={n} className="small">
              {tc(NOTE_TEXT[n])}
            </li>
          ))}
        </ul>
      </div>
    </Frame>
  )
}
