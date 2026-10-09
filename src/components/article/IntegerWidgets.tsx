import { useState } from 'react'
import { useI18n } from '../../i18n'
import type { Loc } from '../../content/types'
import { rat } from '../../lib/realnum'
import {
  FACTOR_LIMIT,
  divisibilityRules,
  divisionLadder,
  divisorsOf,
  divmods,
  euclidRows,
  factorize,
  gcd,
  lcm,
  parseInteger,
  type RuleKind,
} from '../../lib/integers'
import { Tex } from '../ui'
import { Frame, L, groupNumber } from './widgetKit'

/* ------------------------------------------------------------------ helpers */

const NOT_INT = L('Type a whole number such as -7 or 1000 (up to 30 digits).', 'Ketik bilangan bulat seperti -7 atau 1000 (sampai 30 angka).')
const NOT_POS = L('Type a positive whole number here.', 'Ketik bilangan bulat positif di sini.')

/** A number as TeX, in brackets when it is negative and follows an operator. */
const paren = (n: bigint): string => (n < 0n ? `(${n})` : `${n}`)
const sign = (n: bigint): 'pos' | 'neg' | 'zero' => (n > 0n ? 'pos' : n < 0n ? 'neg' : 'zero')

function NumberInput({ label, value, set, width = '9em' }: { label: string; value: string; set: (s: string) => void; width?: string }) {
  return (
    <label className="lbl">
      {label} <input style={{ width }} inputMode="text" value={value} aria-label={label} onChange={(e) => set(e.target.value)} />
    </label>
  )
}

/* -------------------------------------------------------------- number line */

/** One sentence that says what adding a and c does, by the signs. */
function addRule(a: bigint, c: bigint): Loc {
  if (a === 0n || c === 0n) return L('Adding 0 changes nothing.', 'Menambah 0 tidak mengubah apa pun.')
  if (a + c === 0n) return L('The two numbers are opposites, so they cancel to 0.', 'Kedua bilangan berlawanan, sehingga saling meniadakan menjadi 0.')
  if (sign(a) === sign(c)) return L('Same signs: add the sizes and keep the sign.', 'Tanda sama: jumlahkan ukurannya dan pertahankan tandanya.')
  return L('Different signs: subtract the smaller size from the larger; the answer has the sign of the larger.', 'Tanda berbeda: kurangkan ukuran yang kecil dari yang besar; jawabannya bertanda sama dengan yang besar.')
}

const LO = -20
const HI = 20
const X0 = 20
const STEP = 12
const px = (v: number): number => X0 + (v - LO) * STEP

function Arc({ from, to, below, cls }: { from: number; to: number; below: boolean; cls: string }) {
  if (from === to) return null
  const x1 = px(from)
  const x2 = px(to)
  const h = Math.min(36, 14 + Math.abs(x2 - x1) * 0.2) * (below ? 1 : -1)
  const y = 62
  const dir = x2 > x1 ? 1 : -1
  return (
    <g className={cls}>
      <path d={`M ${x1} ${y} Q ${(x1 + x2) / 2} ${y + 2 * h} ${x2} ${y}`} fill="none" strokeWidth="2.2" />
      <path d={`M ${x2} ${y} l ${-6 * dir} ${below ? 5 : -5} l 0 ${below ? -10 : 10} z`} className="arrowhead" />
    </g>
  )
}

export function IntegerNumberLine() {
  const { tc } = useI18n()
  const [a, setA] = useState(-3)
  const [b, setB] = useState(5)
  const [op, setOp] = useState<'+' | '-'>('+')
  const c = op === '+' ? b : -b
  const r = a + c

  const slider = (name: string, v: number, set: (n: number) => void) => (
    <label className="lbl slider">
      {name} = <b>{v}</b>
      <input type="range" min={-10} max={10} value={v} aria-label={name} onChange={(e) => set(Number(e.target.value))} />
    </label>
  )

  const ticks = []
  for (let v = LO; v <= HI; v++) {
    const major = v % 5 === 0
    ticks.push(
      <g key={v}>
        <line x1={px(v)} x2={px(v)} y1={major ? 56 : 59} y2={major ? 68 : 65} className="nltick" />
        {major && (
          <text x={px(v)} y={80} textAnchor="middle" className="nllabel">
            {v < 0 ? `−${-v}` : v}
          </text>
        )}
      </g>,
    )
  }

  return (
    <Frame name="intline">
      <div className="amctl">
        {slider('a', a, setA)}
        {slider('b', b, setB)}
      </div>
      <div className="chips">
        <button className={`chip${op === '+' ? ' on' : ''}`} onClick={() => setOp('+')}>
          a + b
        </button>
        <button className={`chip${op === '-' ? ' on' : ''}`} onClick={() => setOp('-')}>
          a − b
        </button>
      </div>
      <svg viewBox="0 0 520 134" className="nlsvg" role="img" aria-label={tc(L('A number line showing the sum or difference as two jumps', 'Garis bilangan yang menunjukkan jumlah atau selisih sebagai dua lompatan'))}>
        <line x1={X0 - 6} x2={X0 + (HI - LO) * STEP + 6} y1={62} y2={62} className="nlaxis" />
        {ticks}
        <Arc from={0} to={a} below={false} cls="nlarc a" />
        <Arc from={a} to={r} below cls="nlarc b" />
        <circle cx={px(0)} cy={62} r={4} className="nldot zero" />
        <circle cx={px(a)} cy={62} r={4.5} className="nldot a" />
        <circle cx={px(r)} cy={62} r={4.5} className="nldot r" />
        <text x={px(r)} y={126} textAnchor="middle" className="nlres">
          {r < 0 ? `−${-r}` : r}
        </text>
      </svg>
      <div className="wgtout" aria-live="polite">
        <p>
          {op === '+' ? <Tex src={`${a}+${paren(BigInt(b))}=${r}`} /> : <Tex src={`${a}-${paren(BigInt(b))}=${a}+${paren(BigInt(-b))}=${r}`} />}
        </p>
        <p className="small muted">
          {op === '-' && tc(L('Subtracting b is the same as adding its opposite, −b. ', 'Mengurangi b sama dengan menambah lawannya, −b. '))}
          {tc(addRule(BigInt(a), BigInt(c)))} {tc(L('First jump (above): from 0 to a. Second jump (below): by b to the right if it is added, to the left if it is subtracted.', 'Lompatan pertama (di atas): dari 0 ke a. Lompatan kedua (di bawah): sejauh b ke kanan bila ditambah, ke kiri bila dikurangi.'))}
        </p>
      </div>
    </Frame>
  )
}

/* -------------------------------------------------------------------- operations */

type Op = '+' | '-' | '*' | '/'
const OPS: [Op, string, string][] = [
  ['+', '+', '+'],
  ['-', '−', '-'],
  ['*', '×', '\\times '],
  ['/', '÷', '\\div '],
]

export function IntegerOperations() {
  const { tc } = useI18n()
  const [sa, setSa] = useState('-7')
  const [sb, setSb] = useState('-3')
  const [op, setOp] = useState<Op>('*')
  const a = parseInteger(sa)
  const b = parseInteger(sb)
  const tex = OPS.find((o) => o[0] === op)![2]

  let body
  if (a === null || b === null) body = <p className="noline">{tc(NOT_INT)}</p>
  else if (op === '/' && b === 0n) body = <p className="noline">{tc(L('Division by zero is undefined: no integer times 0 gives a non-zero number.', 'Pembagian dengan nol tidak terdefinisi: tidak ada bilangan bulat yang jika dikali 0 memberi bilangan bukan nol.'))}</p>
  else {
    const head = `${paren(a)}${tex}${paren(b)}`
    let result: string
    let note: Loc
    if (op === '+') {
      result = `${a + b}`
      note = L('The integers are closed under addition: the sum of two integers is an integer.', 'Bilangan bulat tertutup terhadap penjumlahan: jumlah dua bilangan bulat adalah bilangan bulat.')
    } else if (op === '-') {
      result = `${a - b}`
      note = L('Subtracting is adding the opposite, so the result is an integer as well.', 'Mengurangi sama dengan menambah lawannya, sehingga hasilnya juga bilangan bulat.')
    } else if (op === '*') {
      result = `${a * b}`
      note =
        a === 0n || b === 0n
          ? L('A product with a factor of 0 is 0.', 'Hasil kali dengan faktor 0 adalah 0.')
          : sign(a) === sign(b)
            ? L('Same signs give a positive product.', 'Tanda sama menghasilkan hasil kali positif.')
            : L('Different signs give a negative product.', 'Tanda berbeda menghasilkan hasil kali negatif.')
    } else if (a % b === 0n) {
      result = `${a / b}`
      note =
        a === 0n
          ? L('0 divided by any non-zero number is 0.', '0 dibagi bilangan bukan nol mana pun adalah 0.')
          : sign(a) === sign(b)
            ? L('Same signs give a positive quotient.', 'Tanda sama menghasilkan hasil bagi positif.')
            : L('Different signs give a negative quotient.', 'Tanda berbeda menghasilkan hasil bagi negatif.')
    } else {
      const f = rat(a, b)
      result = `\\frac{${f.n < 0n ? -f.n : f.n}}{${f.d}}`
      if (f.n < 0n) result = `-${result}`
      note = L('Not an integer: the integers are not closed under division. Use the division-with-remainder tool below to see the quotient and what is left over.', 'Bukan bilangan bulat: bilangan bulat tidak tertutup terhadap pembagian. Pakai alat pembagian bersisa di bawah untuk melihat hasil bagi dan sisanya.')
    }
    body = (
      <>
        <p className="bigcn">
          <Tex src={`${head}=${result}`} />
        </p>
        <p className="small muted">{tc(note)}</p>
      </>
    )
  }

  return (
    <Frame name="intops">
      <div className="inrow">
        <NumberInput label="a" value={sa} set={setSa} />
        <NumberInput label="b" value={sb} set={setSb} />
      </div>
      <div className="chips">
        {OPS.map(([id, sym]) => (
          <button key={id} className={`chip${op === id ? ' on' : ''}`} onClick={() => setOp(id)} aria-label={sym}>
            a {sym} b
          </button>
        ))}
        {[['-7', '-3'], ['6', '-4'], ['-12', '4'], ['0', '-5']].map(([x, y]) => (
          <button
            key={x + y}
            className="chip ghost"
            onClick={() => {
              setSa(x)
              setSb(y)
            }}
          >
            {x}, {y}
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}

/* ---------------------------------------------------------------- divmod */

export function DivisionWithRemainder() {
  const { tc } = useI18n()
  const [sa, setSa] = useState('-7')
  const [sn, setSn] = useState('3')
  const a = parseInteger(sa)
  const n = parseInteger(sn)

  let body
  if (a === null || n === null) body = <p className="noline">{tc(NOT_INT)}</p>
  else if (n === 0n) body = <p className="noline">{tc(L('The divisor cannot be 0.', 'Pembagi tidak boleh 0.'))}</p>
  else {
    const d = divmods(a, n)
    const rows: { name: Loc; where: string; q: bigint; r: bigint }[] = [
      { name: L('Mathematics (the division algorithm)', 'Matematika (algoritma pembagian)'), where: 'euclid', ...d.euclid },
      { name: L('Python: // and %', 'Python: // dan %'), where: 'floor', ...d.floor },
      { name: L('JavaScript, C, C++, Java: % (and truncated division)', 'JavaScript, C, C++, Java: % (dan pembagian terpotong)'), where: 'trunc', ...d.trunc },
    ]
    const same = rows.every((x) => x.q === rows[0].q && x.r === rows[0].r)
    body = (
      <>
        <div className="gridwrap">
          <table className="rtable">
            <thead>
              <tr>
                <th>{tc(L('Convention', 'Aturan'))}</th>
                <th>q</th>
                <th>r</th>
                <th>{tc(L('Check', 'Periksa'))}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((x) => (
                <tr key={x.where}>
                  <td>{tc(x.name)}</td>
                  <td>
                    <Tex src={`${x.q}`} />
                  </td>
                  <td>
                    <Tex src={`${x.r}`} />
                  </td>
                  <td>
                    <Tex src={`${a}=${paren(n)}\\cdot${paren(x.q)}+${paren(x.r)}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="small muted">
          {same
            ? tc(L('All three conventions agree here: the dividend and the divisor are both non-negative, or the division is exact.', 'Ketiga aturan sama di sini: bilangan yang dibagi dan pembagi sama-sama tidak negatif, atau pembagiannya habis.'))
            : tc(L('They disagree. All three satisfy a = n·q + r, but they choose a different q, so a different r. Mathematics keeps r from 0 up to |n| − 1; Python gives r the sign of n; JavaScript gives r the sign of a.', 'Ketiganya berbeda. Semuanya memenuhi a = n·q + r, tetapi memilih q yang berbeda, sehingga r yang berbeda. Matematika menjaga r dari 0 sampai |n| − 1; Python memberi r tanda yang sama dengan n; JavaScript memberi r tanda yang sama dengan a.'))}
        </p>
      </>
    )
  }

  return (
    <Frame name="divmod">
      <div className="inrow">
        <NumberInput label="a" value={sa} set={setSa} />
        <NumberInput label="n" value={sn} set={setSn} />
      </div>
      <div className="chips">
        {[['17', '5'], ['-7', '3'], ['7', '-3'], ['-7', '-3'], ['100', '7']].map(([x, y]) => (
          <button
            key={x + y}
            className="chip ghost"
            onClick={() => {
              setSa(x)
              setSn(y)
            }}
          >
            {x} ÷ {y}
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}

/* ------------------------------------------------------------ divisibility */

const RULE_TEXT: Record<RuleKind, (v: bigint, k: number) => Loc> = {
  lastDigit: (v, k) =>
    k === 2
      ? L(`last digit ${v} is ${v % 2n === 0n ? 'even' : 'odd'}`, `angka terakhir ${v} ${v % 2n === 0n ? 'genap' : 'ganjil'}`)
      : k === 5
        ? L(`last digit is ${v} (needs 0 or 5)`, `angka terakhir ${v} (harus 0 atau 5)`)
        : L(`last digit is ${v} (needs 0)`, `angka terakhir ${v} (harus 0)`),
  digitSum: (v, k) => L(`digit sum ${v}, ${v % BigInt(k) === 0n ? 'a' : 'not a'} multiple of ${k}`, `jumlah angka ${v}, ${v % BigInt(k) === 0n ? 'kelipatan' : 'bukan kelipatan'} ${k}`),
  lastTwo: (v) => L(`last two digits form ${v}`, `dua angka terakhir membentuk ${v}`),
  lastThree: (v) => L(`last three digits form ${v}`, `tiga angka terakhir membentuk ${v}`),
  both: () => L('', ''),
  alternating: (v) => L(`alternating digit sum ${v}`, `jumlah angka berselang-seling ${v}`),
}

export function DivisibilityRules() {
  const { tc, lang } = useI18n()
  const [s, setS] = useState('918082')
  const n = parseInteger(s)
  const yes = tc(L('yes', 'ya'))
  const no = tc(L('no', 'tidak'))

  let body
  if (n === null) body = <p className="noline">{tc(NOT_INT)}</p>
  else if (n === 0n) body = <p className="muted">{tc(L('0 is divisible by every non-zero integer.', '0 habis dibagi setiap bilangan bulat bukan nol.'))}</p>
  else {
    const m = n < 0n ? -n : n
    const rules = divisibilityRules(n)
    body = (
      <>
        <div className="gridwrap">
          <table className="rtable">
            <thead>
              <tr>
                <th>{tc(L('Divisible by', 'Habis dibagi'))}</th>
                <th>{tc(L('What the rule looks at', 'Yang dilihat aturan'))}</th>
                <th>{tc(L('By the rule', 'Menurut aturan'))}</th>
                <th>{tc(L('Remainder', 'Sisa'))}</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r) => (
                <tr key={r.k} className={r.holds ? 'grp3' : ''}>
                  <td>
                    <b>{r.k}</b>
                  </td>
                  <td>
                    {r.kind === 'both'
                      ? tc(L(`by 2: ${r.parts![0] ? 'yes' : 'no'}; by 3: ${r.parts![1] ? 'yes' : 'no'}`, `oleh 2: ${r.parts![0] ? 'ya' : 'tidak'}; oleh 3: ${r.parts![1] ? 'ya' : 'tidak'}`))
                      : tc(RULE_TEXT[r.kind](r.value, r.k))}
                  </td>
                  <td>{r.holds ? `✓ ${yes}` : `✗ ${no}`}</td>
                  <td>{(m % BigInt(r.k)).toString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="small muted">
          {tc(L('The last column divides the whole number and is only there to check the rule: they always agree.', 'Kolom terakhir membagi seluruh bilangan dan hanya ada untuk memeriksa aturannya: keduanya selalu sama.'))}{' '}
          {groupNumber(m, lang)}
        </p>
      </>
    )
  }

  return (
    <Frame name="divrules">
      <div className="inrow">
        <NumberInput label="n" value={s} set={setS} width="16em" />
      </div>
      <div className="chips">
        {['918082', '123456789', '1001', '7200', '-4455'].map((p) => (
          <button key={p} className="chip ghost" onClick={() => setS(p)}>
            {p}
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}

/* ------------------------------------------------------------- factorising */

export function PrimeFactoriser() {
  const { tc, lang } = useI18n()
  const [s, setS] = useState('360')
  const n = parseInteger(s, 13)

  let body
  if (n === null) body = <p className="noline">{tc(NOT_INT)}</p>
  else if (n < 1n) body = <p className="noline">{tc(NOT_POS)}</p>
  else if (n > FACTOR_LIMIT) body = <p className="noline">{tc(L('This tool factorises numbers up to 10^12 (a trillion).', 'Alat ini memfaktorkan bilangan sampai 10^12 (satu triliun).'))}</p>
  else if (n === 1n) body = <p className="muted">{tc(L('1 is neither prime nor composite: it has only one divisor, itself, and it is the empty product.', '1 bukan prima dan bukan komposit: ia hanya punya satu pembagi, yaitu dirinya sendiri, dan ia hasil kali kosong.'))}</p>
  else {
    const f = factorize(n)
    const prime = f.length === 1 && f[0][1] === 1
    const texF = f.map(([p, e]) => (e > 1 ? `${p}^{${e}}` : `${p}`)).join('\\cdot ')
    const count = f.reduce((c, [, e]) => c * (e + 1), 1)
    const square = f.every(([, e]) => e % 2 === 0)
    const ladder = divisionLadder(n)
    const divs = count <= 48 ? divisorsOf(n) : null
    body = prime ? (
      <>
        <p className="bigcn">
          <Tex src={`${n}`} /> {tc(L('is prime', 'adalah bilangan prima'))}
        </p>
        <p className="small muted">{tc(L('Its only divisors are 1 and itself. It was tested by trial division by every number up to its square root.', 'Satu-satunya pembaginya adalah 1 dan dirinya sendiri. Ia diuji dengan pembagian oleh setiap bilangan sampai akar kuadratnya.'))}</p>
      </>
    ) : (
      <>
        <p className="bigcn">
          <Tex src={`${n}=${texF}`} />
        </p>
        <div className="gridwrap">
          <table className="rtable">
            <tbody>
              {ladder.map((st, i) => (
                <tr key={i}>
                  <td>
                    <Tex src={`${st.from}\\div${st.p}=${st.to}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="small">
          {tc(L('Number of divisors', 'Banyak pembagi'))}: <Tex src={`${f.map(([, e]) => `(${e}+1)`).join('')}=${count}`} />
          {square && <> · {tc(L('a perfect square (every exponent is even)', 'kuadrat sempurna (semua eksponen genap)'))}</>}
        </p>
        {divs && <p className="small muted">{divs.map((d) => groupNumber(d, lang)).join(', ')}</p>}
      </>
    )
  }

  return (
    <Frame name="primefactor">
      <div className="inrow">
        <NumberInput label="n" value={s} set={setS} width="12em" />
      </div>
      <div className="chips">
        {['360', '97', '1001', '1024', '999999999989'].map((p) => (
          <button key={p} className="chip ghost" onClick={() => setS(p)}>
            {p}
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}

/* --------------------------------------------------------------- gcd and lcm */

export function GcdLcm() {
  const { tc } = useI18n()
  const [sa, setSa] = useState('48')
  const [sb, setSb] = useState('180')
  const a = parseInteger(sa, 15)
  const b = parseInteger(sb, 15)

  let body
  if (a === null || b === null) body = <p className="noline">{tc(NOT_INT)}</p>
  else if (a < 1n || b < 1n) body = <p className="noline">{tc(NOT_POS)}</p>
  else {
    const g = gcd(a, b)
    const l = lcm(a, b)
    // Euclid wants the larger number first; the table then reads from the top.
    const rows = euclidRows(a >= b ? a : b, a >= b ? b : a)
    const fa = a <= FACTOR_LIMIT ? factorize(a) : null
    const fb = b <= FACTOR_LIMIT ? factorize(b) : null
    const primes = fa && fb ? [...new Set([...fa, ...fb].map(([p]) => p))].sort((x, y) => (x < y ? -1 : 1)) : null
    const exp = (f: [bigint, number][], p: bigint): number => f.find(([q]) => q === p)?.[1] ?? 0
    body = (
      <>
        <div className="gridwrap">
          <table className="rtable">
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className={r.r === 0n ? 'grp3' : ''}>
                  <td>
                    <Tex src={`${r.a}=${r.q}\\cdot${r.b}+${r.r}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="bigcn">
          <Tex src={`\\gcd(${a},${b})=${g}`} />
          {'  '}
          <Tex src={`\\operatorname{lcm}=${l}`} />
        </p>
        <p className="small">
          <Tex src={`${g}\\cdot${l}=${g * l}=${a}\\cdot${b}`} />
          {g === 1n && <> · {tc(L('the numbers are coprime', 'kedua bilangan saling prima'))}</>}
        </p>
        {primes && fa && fb && (
          <div className="gridwrap">
            <table className="rtable">
              <thead>
                <tr>
                  <th>{tc(L('Prime', 'Prima'))}</th>
                  <th>{a.toString()}</th>
                  <th>{b.toString()}</th>
                  <th>{tc(L('smaller → gcd', 'terkecil → FPB'))}</th>
                  <th>{tc(L('larger → lcm', 'terbesar → KPK'))}</th>
                </tr>
              </thead>
              <tbody>
                {primes.map((p) => (
                  <tr key={p.toString()}>
                    <td>{p.toString()}</td>
                    <td>{exp(fa, p)}</td>
                    <td>{exp(fb, p)}</td>
                    <td>{Math.min(exp(fa, p), exp(fb, p))}</td>
                    <td>{Math.max(exp(fa, p), exp(fb, p))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    )
  }

  return (
    <Frame name="gcdlcm">
      <div className="inrow">
        <NumberInput label="a" value={sa} set={setSa} />
        <NumberInput label="b" value={sb} set={setSb} />
      </div>
      <div className="chips">
        {[['48', '180'], ['17', '5'], ['84', '126'], ['1071', '462'], ['12', '18']].map(([x, y]) => (
          <button
            key={x + y}
            className="chip ghost"
            onClick={() => {
              setSa(x)
              setSb(y)
            }}
          >
            {x}, {y}
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}

