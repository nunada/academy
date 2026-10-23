import { useMemo, useState } from 'react'
import { useI18n } from '../../i18n'
import type { Loc } from '../../content/types'
import { exactTex, exactValue, cosDeg, sinDeg, toRad } from '../../lib/trigbasic'
import { CATALOG, EXACT_ANGLES, FALSE_CLAIMS, PROOFS, compareSources, evalNode, exprValue, harmonic, parseExpr, rotation, solveHarmonic, waveSum, type ParseError, type Reason } from '../../lib/trigident'
import { Tex } from '../ui'
import { Frame, L, useSep } from './widgetKit'

/** A number with `digits` decimals and the reader's decimal mark; `–` where it is undefined. */
function fmt(x: number, sep: string, digits = 4): string {
  if (!Number.isFinite(x)) return '–'
  return (Math.abs(x) < 0.5 * 10 ** -digits ? 0 : x).toFixed(digits).replace('.', sep)
}
function short(x: number, sep: string, digits = 4): string {
  if (!Number.isFinite(x)) return '–'
  return Number((Math.abs(x) < 0.5 * 10 ** -digits ? 0 : x).toFixed(digits)).toString().replace('.', sep)
}
function arcPath(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const p = (a: number): string => `${(cx + r * Math.cos(toRad(a))).toFixed(2)},${(cy - r * Math.sin(toRad(a))).toFixed(2)}`
  return `M${p(a0)}A${r},${r} 0 ${a1 - a0 > 180 ? 1 : 0} 0 ${p(a1)}`
}

/* ------------------------------------------------------------------------------ the tester */

const ERROR_TEXT: Record<ParseError, Loc> = {
  empty: L('Type an expression.', 'Ketik sebuah ekspresi.'),
  char: L('This character is not allowed.', 'Karakter ini tidak diperbolehkan.'),
  unknown: L('Unknown name. Use sin, cos, tan, sec, csc, cot, sqrt, abs, x and y.', 'Nama tidak dikenal. Pakai sin, cos, tan, sec, csc, cot, sqrt, abs, x, dan y.'),
  paren: L('The brackets do not match.', 'Tanda kurung tidak berpasangan.'),
  argument: L('A function needs an argument: write sin(x), or sin x.', 'Fungsi memerlukan argumen: tulis sin(x), atau sin x.'),
  end: L('The expression stops too early, or something is left over.', 'Ekspresi berhenti terlalu cepat, atau ada yang tersisa.'),
  number: L('Two numbers side by side: put an operator between them.', 'Dua bilangan berdampingan: beri operator di antaranya.'),
  operand: L('An operator or a bracket is in the wrong place.', 'Ada operator atau tanda kurung di tempat yang salah.'),
}

interface Preset {
  le: string
  re: string
  tex: string
}
const PRESETS: Preset[] = [
  ...['pythagorean', 'double-sin', 'double-cos-sin', 'sum-sin', 'power-sin', 'product-sin-cos', 'sumprod-cos-plus', 'half-tan-minus', 'cot-reciprocal'].map((id) => {
    const c = CATALOG.find((q) => q.id === id)!
    return { le: c.le, re: c.re, tex: `${c.lhs}=${c.rhs}` }
  }),
  ...FALSE_CLAIMS.slice(0, 4).map((c) => ({ le: c.le, re: c.re, tex: `${c.lhs}=${c.rhs}` })),
]
const SHOW_AT = [0, 30, 45, 60, 90, 120, 135, 180, 270]

export function TrigIdentTest() {
  const { tc } = useI18n()
  const sep = useSep()
  const [left, setLeft] = useState('sin(2x)')
  const [right, setRight] = useState('2 sin(x) cos(x)')
  const out = useMemo(() => compareSources(left, right), [left, right])
  const show = (v: number): string => (Number.isNaN(v) ? tc(L('undefined', 'tak terdefinisi')) : fmt(v, sep, 6))
  const pa = parseExpr(left)
  const pb = parseExpr(right)
  return (
    <Frame name="idtest">
      <div className="chips">
        {PRESETS.map((p, i) => (
          <button
            key={i}
            className="chip ghost"
            onClick={() => {
              setLeft(p.le)
              setRight(p.re)
            }}
          >
            <Tex src={p.tex} />
          </button>
        ))}
      </div>
      <div className="inrow">
        <label className="lbl" style={{ flex: '1 1 12em' }}>
          {tc(L('left side', 'ruas kiri'))} <input style={{ flex: '1 1 8em', minWidth: 0, width: '100%' }} value={left} spellCheck={false} aria-label={tc(L('left side', 'ruas kiri'))} onChange={(e) => setLeft(e.target.value)} />
        </label>
        <label className="lbl" style={{ flex: '1 1 12em' }}>
          {tc(L('right side', 'ruas kanan'))} <input style={{ flex: '1 1 8em', minWidth: 0, width: '100%' }} value={right} spellCheck={false} aria-label={tc(L('right side', 'ruas kanan'))} onChange={(e) => setRight(e.target.value)} />
        </label>
      </div>
      <p className="small muted">{tc(L('Write angles in degrees with x (and y): sin(2x), sin^2(x), 2cos(x)cos(y), sqrt(1 - cos(x)), tan(x/2).', 'Tulis sudut dalam derajat dengan x (dan y): sin(2x), sin^2(x), 2cos(x)cos(y), sqrt(1 - cos(x)), tan(x/2).'))}</p>
      {'error' in out ? (
        <p className="warnline">
          {tc(out.error.side === 'left' ? L('Left side:', 'Ruas kiri:') : L('Right side:', 'Ruas kanan:'))} {tc(ERROR_TEXT[out.error.error])}
        </p>
      ) : (
        <div className="wgtout" aria-live="polite">
          {(() => {
            const r = out.result
            const total = r.compared
            if (r.verdict === 'identity')
              return (
                <p className="okline">
                  {tc(L(`The two sides agree at all ${total} angles compared (every whole degree from 0° to 359°, and hundreds of others). It looks like an identity.`, `Kedua ruas sama pada semua ${total} sudut yang dibandingkan (setiap derajat bulat dari 0° sampai 359°, dan ratusan sudut lain). Ini tampak seperti identitas.`))}
                </p>
              )
            if (r.verdict === 'domain' && r.domainGap)
              return (
                <p className="okline">
                  {tc(L(`The sides agree at all ${total} angles where both are defined, but at x = ${short(r.domainGap.x, sep, 5)}° only the ${r.domainGap.side === 'left' ? 'left' : 'right'} side is defined. It is an identity on the angles where both sides make sense.`, `Kedua ruas sama pada semua ${total} sudut tempat keduanya terdefinisi, tetapi pada x = ${short(r.domainGap.x, sep, 5)}° hanya ruas ${r.domainGap.side === 'left' ? 'kiri' : 'kanan'} yang terdefinisi. Ini identitas pada sudut-sudut tempat kedua ruas bermakna.`))}
                </p>
              )
            if (r.verdict === 'not' && r.counterexample)
              return (
                <p className="badline">
                  {tc(L(`Not an identity. A counterexample: x = ${short(r.counterexample.x, sep, 5)}°${r.usesY ? `, y = ${short(r.counterexample.y, sep, 5)}°` : ''} gives ${fmt(r.counterexample.l, sep, 6)} on the left and ${fmt(r.counterexample.r, sep, 6)} on the right. The sides differ at ${r.mismatches} of the ${total} angles compared.`, `Bukan identitas. Contoh penyangkal: x = ${short(r.counterexample.x, sep, 5)}°${r.usesY ? `, y = ${short(r.counterexample.y, sep, 5)}°` : ''} memberi ${fmt(r.counterexample.l, sep, 6)} di kiri dan ${fmt(r.counterexample.r, sep, 6)} di kanan. Kedua ruas berbeda pada ${r.mismatches} dari ${total} sudut yang dibandingkan.`))}
                </p>
              )
            return <p className="warnline">{tc(L('The two sides are never defined at the same angle, so there is nothing to compare.', 'Kedua ruas tidak pernah terdefinisi pada sudut yang sama, jadi tidak ada yang dapat dibandingkan.'))}</p>
          })()}
          <p className="small muted">
            {tc(L('A test of this kind is evidence, never a proof: an identity is proved with algebra or geometry (see the proofs above). Values below use y = 25°.', 'Uji seperti ini adalah bukti pendukung, bukan pembuktian: identitas dibuktikan dengan aljabar atau geometri (lihat pembuktian di atas). Nilai di bawah memakai y = 25°.'))}
          </p>
          {pa.ok && pb.ok && (
            <div style={{ overflowX: 'auto' }}>
              <table className="rtable">
                <thead>
                  <tr>
                    <th>x</th>
                    <th>{tc(L('left', 'kiri'))}</th>
                    <th>{tc(L('right', 'kanan'))}</th>
                  </tr>
                </thead>
                <tbody>
                  {SHOW_AT.map((x) => (
                    <tr key={x}>
                      <td>{x}°</td>
                      <td>{show(evalNode(pa.node, x, 25).v)}</td>
                      <td>{show(evalNode(pb.node, x, 25).v)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </Frame>
  )
}

/* --------------------------------------------------------------------------------- the proofs */

const REASON: Record<Reason, Loc> = {
  definition: L('definition', 'definisi'),
  quotient: L('quotient identity: tan = sin / cos', 'identitas hasil bagi: tan = sin / cos'),
  reciprocal: L('reciprocal identity', 'identitas kebalikan'),
  pythagorean: L('Pythagorean identity: sin² + cos² = 1', 'identitas Pythagoras: sin² + cos² = 1'),
  common: L('common denominator', 'penyebut sama'),
  expand: L('expand the brackets', 'jabarkan tanda kurung'),
  factor: L('factor out the common factor', 'keluarkan faktor persekutuan'),
  cancel: L('cancel the common factor', 'coret faktor persekutuan'),
  squares: L('difference of squares', 'selisih kuadrat'),
  sum: L('sum formula', 'rumus jumlah'),
  double: L('double-angle formula', 'rumus sudut ganda'),
  rewrite: L('rewrite', 'tulis ulang'),
  half: L('half-angle formula', 'rumus sudut paruh'),
  multiply: L('multiply top and bottom by cos² x', 'kalikan pembilang dan penyebut dengan cos² x'),
  combine: L('collect like terms', 'kumpulkan suku sejenis'),
}

export function TrigIdentProof() {
  const { tc } = useI18n()
  const [id, setId] = useState('tan-cot')
  const [shown, setShown] = useState(1)
  const proof = PROOFS.find((p) => p.id === id)!
  const n = proof.steps.length
  return (
    <Frame name="idproof">
      <div className="chips">
        {PROOFS.map((p) => (
          <button
            key={p.id}
            className={`chip ${id === p.id ? 'on' : ''}`}
            onClick={() => {
              setId(p.id)
              setShown(1)
            }}
            aria-pressed={id === p.id}
          >
            <Tex src={`${p.lhs}=${p.rhs}`} />
          </button>
        ))}
      </div>
      <p className="small">
        {tc(proof.start === 'lhs' ? L('Start from the left side and change it, one step at a time, into the right side.', 'Mulai dari ruas kiri dan ubah, satu langkah demi satu langkah, menjadi ruas kanan.') : L('Start from the right side and change it, one step at a time, into the left side.', 'Mulai dari ruas kanan dan ubah, satu langkah demi satu langkah, menjadi ruas kiri.'))}
      </p>
      <ol className="proofsteps">
        {proof.steps.slice(0, shown).map((s, i) => (
          <li key={i} style={{ marginBottom: 6 }}>
            <Tex src={`${i === 0 ? '' : '= '}${s.tex}`} />
            {s.reason && <span className="small muted"> {tc(L('because:', 'karena:'))} {tc(REASON[s.reason])}</span>}
          </li>
        ))}
      </ol>
      <div className="inrow" aria-live="polite">
        <button className="btn soft" onClick={() => setShown(Math.min(n, shown + 1))} disabled={shown >= n}>
          {tc(L('next step', 'langkah berikutnya'))}
        </button>
        <button className="btn ghost" onClick={() => setShown(n)} disabled={shown >= n}>
          {tc(L('show all', 'tampilkan semua'))}
        </button>
        <button className="btn ghost" onClick={() => setShown(1)} disabled={shown <= 1}>
          {tc(L('start again', 'ulangi'))}
        </button>
      </div>
      {shown >= n && (
        <p className="okline">
          {tc(L('Done: both ends are the claim, and each line equals the one before it wherever both are defined.', 'Selesai: kedua ujung adalah klaimnya, dan setiap baris sama dengan baris sebelumnya di mana pun keduanya terdefinisi.'))}
        </p>
      )}
    </Frame>
  )
}

/* ------------------------------------------------------------------------------- the rotation */

export function TrigIdentRotate() {
  const { tc } = useI18n()
  const sep = useSep()
  const [x, setX] = useState(50)
  const [y, setY] = useState(30)
  const [minus, setMinus] = useState(false)
  const r = rotation(x, y)
  const angle = minus ? x - y : x + y
  const cx = 120
  const cy = 110
  const R = 80
  const pt = (a: number): [number, number] => [cx + R * cosDeg(a), cy - R * sinDeg(a)]
  const P = pt(x)
  const Q = pt(angle)
  const target = minus ? r.viaProductsDiff : r.viaProducts
  const sign = minus ? '-' : '+'
  const label = `${tc(L('The point at', 'Titik pada'))} ${x}° ${tc(L('turned through', 'diputar sebesar'))} ${minus ? '−' : ''}${y}° ${tc(L('lands at', 'jatuh di'))} (${fmt(target.cos, sep, 4)}; ${fmt(target.sin, sep, 4)})`
  return (
    <Frame name="idrotate">
      <label className="lbl slider">
        x = <b>{x}°</b>
        <input type="range" min={0} max={360} step={1} value={x} aria-label="x" onChange={(e) => setX(Number(e.target.value))} />
      </label>
      <label className="lbl slider">
        y = <b>{y}°</b>
        <input type="range" min={0} max={360} step={1} value={y} aria-label="y" onChange={(e) => setY(Number(e.target.value))} />
      </label>
      <div className="chips">
        <button className={`chip ${!minus ? 'on' : ''}`} onClick={() => setMinus(false)} aria-pressed={!minus}>
          <Tex src="x+y" />
        </button>
        <button className={`chip ${minus ? 'on' : ''}`} onClick={() => setMinus(true)} aria-pressed={minus}>
          <Tex src="x-y" />
        </button>
      </div>
      <svg viewBox="0 0 240 220" role="img" aria-label={label} style={{ width: '100%', maxWidth: 320, display: 'block', margin: '6px auto' }}>
        <line x1={10} y1={cy} x2={230} y2={cy} stroke="var(--muted)" strokeWidth={1} />
        <line x1={cx} y1={10} x2={cx} y2={210} stroke="var(--muted)" strokeWidth={1} />
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--border)" strokeWidth={1.6} />
        <line x1={cx} y1={cy} x2={P[0]} y2={P[1]} stroke="var(--muted)" strokeWidth={2} />
        <line x1={cx} y1={cy} x2={Q[0]} y2={Q[1]} stroke="var(--bad)" strokeWidth={2.6} />
        <path d={arcPath(cx, cy, 30, Math.min(x, angle), Math.max(x, angle))} fill="none" stroke="var(--gold)" strokeWidth={2.4} />
        <circle cx={P[0]} cy={P[1]} r={4} fill="var(--muted)" />
        <circle cx={Q[0]} cy={Q[1]} r={5} fill="var(--bad)" />
        <text x={P[0] + (cosDeg(x) >= 0 ? 7 : -7)} y={P[1] - 6} fontSize={11} textAnchor={cosDeg(x) >= 0 ? 'start' : 'end'} fill="var(--muted)">
          x
        </text>
        <text x={Q[0] + (cosDeg(angle) >= 0 ? 7 : -7)} y={Q[1] + 14} fontSize={11} fontWeight={700} textAnchor={cosDeg(angle) >= 0 ? 'start' : 'end'} fill="var(--bad)">
          {minus ? 'x − y' : 'x + y'}
        </text>
      </svg>
      <div className="wgtout" aria-live="polite">
        <p className="small">{tc(L('Turning the point at x through y: its new x-coordinate and y-coordinate are made of the same four products.', 'Memutar titik pada x sebesar y: koordinat-x dan koordinat-y barunya tersusun dari empat hasil kali yang sama.'))}</p>
        <div style={{ overflowX: 'auto' }}>
          <table className="rtable">
            <tbody>
              <tr>
                <td>
                  <Tex src={`\\cos(x${sign}y)`} />
                </td>
                <td>
                  {fmt(target.cos, sep, 5)} = {fmt(r.cxcy, sep, 4)} {minus ? '+' : '−'} {fmt(r.sxsy, sep, 4)}
                </td>
                <td>{fmt(minus ? r.directDiff.cos : r.direct.cos, sep, 5)}</td>
              </tr>
              <tr>
                <td>
                  <Tex src={`\\sin(x${sign}y)`} />
                </td>
                <td>
                  {fmt(target.sin, sep, 5)} = {fmt(r.sxcy, sep, 4)} {minus ? '−' : '+'} {fmt(r.cxsy, sep, 4)}
                </td>
                <td>{fmt(minus ? r.directDiff.sin : r.direct.sin, sep, 5)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="small muted">{tc(L('Middle column: the formula with the four products; last column: cos and sin of the angle itself.', 'Kolom tengah: rumus dengan empat hasil kali; kolom terakhir: cos dan sin dari sudutnya sendiri.'))}</p>
      </div>
    </Frame>
  )
}

/* ---------------------------------------------------------------------------- exact values */

const tx = (fn: 'sin' | 'cos' | 'tan', d: number): string => {
  const e = exactValue(fn, d)
  return e === null || e === 'undefined' ? '?' : exactTex(e)
}
/** The derivation of an angle as lines of TeX, built from the exact values of 30°, 45° and 60°. */
function derivation(deg: number): string[] {
  const sum = (a: number, b: number, plus: boolean): string[] => {
    const op = plus ? '+' : '-'
    const sOp = plus ? '+' : '-'
    const total = plus ? a + b : a - b
    return [
      `\\sin${total}^\\circ=\\sin(${a}^\\circ${op}${b}^\\circ)=\\sin${a}^\\circ\\cos${b}^\\circ${sOp}\\cos${a}^\\circ\\sin${b}^\\circ`,
      `=${tx('sin', a)}\\cdot${tx('cos', b)}${sOp}${tx('cos', a)}\\cdot${tx('sin', b)}`,
      `\\cos${total}^\\circ=\\cos${a}^\\circ\\cos${b}^\\circ${plus ? '-' : '+'}\\sin${a}^\\circ\\sin${b}^\\circ`,
      `=${tx('cos', a)}\\cdot${tx('cos', b)}${plus ? '-' : '+'}${tx('sin', a)}\\cdot${tx('sin', b)}`,
    ]
  }
  switch (deg) {
    case 15:
      return sum(45, 30, false)
    case 75:
      return sum(45, 30, true)
    case 105:
      return sum(60, 45, true)
    case 165:
      return ['\\sin165^\\circ=\\sin(180^\\circ-15^\\circ)=\\sin15^\\circ', '\\cos165^\\circ=\\cos(180^\\circ-15^\\circ)=-\\cos15^\\circ']
    case 22.5:
      return ['\\sin^2 22.5^\\circ=\\frac{1-\\cos45^\\circ}{2}=\\frac{1-\\frac{\\sqrt2}{2}}{2}=\\frac{2-\\sqrt2}{4}', '\\cos^2 22.5^\\circ=\\frac{1+\\cos45^\\circ}{2}=\\frac{2+\\sqrt2}{4}', '22.5^\\circ\\text{ is acute, so both roots are positive}']
    case 67.5:
      return ['\\sin67.5^\\circ=\\cos22.5^\\circ\\quad\\text{(cofunction)}', '\\cos67.5^\\circ=\\sin22.5^\\circ', '\\tan67.5^\\circ=\\frac{\\cos22.5^\\circ}{\\sin22.5^\\circ}']
    case 36:
      return ['c=\\cos36^\\circ,\\quad \\cos108^\\circ=-\\cos72^\\circ', '4c^3-3c=-(2c^2-1)\\ \\Rightarrow\\ 4c^3+2c^2-3c-1=0', '(c+1)(4c^2-2c-1)=0,\\quad c>0\\ \\Rightarrow\\ c=\\frac{1+\\sqrt5}{4}']
    case 72:
      return ['\\cos72^\\circ=2\\cos^2 36^\\circ-1=2\\cdot\\frac{6+2\\sqrt5}{16}-1=\\frac{\\sqrt5-1}{4}']
    case 54:
      return ['\\sin54^\\circ=\\cos(90^\\circ-54^\\circ)=\\cos36^\\circ=\\frac{1+\\sqrt5}{4}']
    default:
      return ['\\sin18^\\circ=\\cos(90^\\circ-18^\\circ)=\\cos72^\\circ=\\frac{\\sqrt5-1}{4}']
  }
}

export function TrigIdentExact() {
  const { tc } = useI18n()
  const sep = useSep()
  const [deg, setDeg] = useState(15)
  const e = EXACT_ANGLES.find((q) => q.deg === deg)!
  const VIA: Record<string, Loc> = {
    difference: L('Use the difference or supplement formula with angles you know.', 'Pakai rumus selisih atau pelurus dengan sudut yang sudah diketahui.'),
    sum: L('Use the sum formula with angles you know.', 'Pakai rumus jumlah dengan sudut yang sudah diketahui.'),
    half: L('Use the half-angle formulas: the angle is half of one you know.', 'Pakai rumus sudut paruh: sudut itu setengah dari sudut yang sudah diketahui.'),
    pentagon: L('These come from the regular pentagon: 36° solves a cubic equation that factors.', 'Ini berasal dari segi lima beraturan: 36° memecahkan persamaan kubik yang dapat difaktorkan.'),
  }
  const label = (d: number): string => (Number.isInteger(d) ? String(d) : short(d, '.', 1))
  const rows: ['sin' | 'cos' | 'tan', string, string][] = [
    ['sin', e.sin.tex, e.sin.expr],
    ['cos', e.cos.tex, e.cos.expr],
    ['tan', e.tan.tex, e.tan.expr],
  ]
  return (
    <Frame name="idexact">
      <div className="chips">
        {EXACT_ANGLES.map((q) => (
          <button key={q.deg} className={`chip ${deg === q.deg ? 'on' : ''}`} onClick={() => setDeg(q.deg)} aria-pressed={deg === q.deg}>
            {short(q.deg, sep, 1)}°
          </button>
        ))}
      </div>
      <p className="small">{tc(VIA[e.via])}</p>
      <div>
        {derivation(deg).map((line, i) => (
          <Tex key={i} src={line} display />
        ))}
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="rtable">
          <thead>
            <tr>
              <th>{tc(L('function', 'fungsi'))}</th>
              <th>{tc(L('exact', 'eksak'))}</th>
              <th>{tc(L('decimal', 'desimal'))}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([fn, t, expr]) => (
              <tr key={fn}>
                <td>
                  <Tex src={`\\${fn}\\,${label(deg)}^\\circ`} />
                </td>
                <td>
                  <Tex src={t} />
                </td>
                <td>{fmt(exprValue(expr), sep, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="small muted">{tc(L(`The decimals come from evaluating the exact expressions; the checker compares them with sin, cos and tan of ${label(deg)}° to 55 digits.`, `Desimalnya berasal dari menghitung ekspresi eksak; pemeriksa membandingkannya dengan sin, cos, dan tan ${label(deg)}° sampai 55 digit.`))}</p>
    </Frame>
  )
}

/* ------------------------------------------------------------------------- one single wave */

const AB = [-6, -5, -4, -3, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 3, 4, 5, 6]

export function TrigIdentHarmonic() {
  const { tc } = useI18n()
  const sep = useSep()
  const [ai, setAi] = useState(AB.indexOf(3))
  const [bi, setBi] = useState(AB.indexOf(4))
  const [cText, setCText] = useState('2.5')
  const a = AB[ai]
  const b = AB[bi]
  const h = harmonic(a, b)
  const c = Number(cText.trim().replace(',', '.'))
  const sols = cText.trim() !== '' && Number.isFinite(c) ? solveHarmonic(a, b, c) : []
  const W = 340
  const H = 190
  const ymax = Math.max(h ? h.R : 1, 1) + 0.6
  const X = (x: number): number => 14 + (x / 360) * (W - 28)
  const Y = (y: number): number => H / 2 - (y / ymax) * (H / 2 - 12)
  let d1 = ''
  let d2 = ''
  for (let x = 0; x <= 360; x += 2) {
    d1 += `${x === 0 ? 'M' : 'L'}${X(x).toFixed(1)},${Y(waveSum(a, b, x)).toFixed(1)}`
    if (h) d2 += `${x === 0 ? 'M' : 'L'}${X(x).toFixed(1)},${Y(h.R * sinDeg(x + h.phi)).toFixed(1)}`
  }
  const num = (v: number): string => short(v, '.', 2)
  const lhsTex = `${a === 0 ? '' : `${a === 1 ? '' : a === -1 ? '-' : num(a)}\\sin x`}${b === 0 ? '' : `${b > 0 && a !== 0 ? '+' : ''}${b === 1 ? '' : b === -1 ? '-' : num(b)}\\cos x`}`
  const phiTex = h ? (h.phi >= 0 ? `+${num(h.phi)}^\\circ` : `-${num(-h.phi)}^\\circ`) : ''
  const label = h ? `${tc(L('The wave', 'Gelombang'))} ${num(a)} sin x + ${num(b)} cos x ${tc(L('has amplitude', 'beramplitudo'))} ${fmt(h.R, sep, 3)} ${tc(L('and equals', 'dan sama dengan'))} ${fmt(h.R, sep, 3)} sin(x ${h.phi >= 0 ? '+' : '−'} ${fmt(Math.abs(h.phi), sep, 2)}°)` : tc(L('The zero wave', 'Gelombang nol'))
  return (
    <Frame name="idharmonic">
      <label className="lbl slider">
        a = <b>{short(a, sep, 1)}</b>
        <input type="range" min={0} max={AB.length - 1} step={1} value={ai} aria-label="a" aria-valuetext={String(a)} onChange={(e) => setAi(Number(e.target.value))} />
      </label>
      <label className="lbl slider">
        b = <b>{short(b, sep, 1)}</b>
        <input type="range" min={0} max={AB.length - 1} step={1} value={bi} aria-label="b" aria-valuetext={String(b)} onChange={(e) => setBi(Number(e.target.value))} />
      </label>
      {h ? (
        <>
          <Tex src={`${lhsTex}=${num(h.R)}\\sin\\left(x${phiTex}\\right)`} display />
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} style={{ width: '100%', maxWidth: 460, display: 'block', margin: '6px auto' }}>
            <line x1={14} y1={Y(0)} x2={W - 14} y2={Y(0)} stroke="var(--muted)" strokeWidth={1} />
            {[0, 90, 180, 270, 360].map((v) => (
              <text key={v} x={X(v)} y={H - 2} fontSize={9} textAnchor="middle" fill="var(--muted)">
                {v}°
              </text>
            ))}
            <line x1={14} y1={Y(h.R)} x2={W - 14} y2={Y(h.R)} stroke="var(--gold)" strokeWidth={1} strokeDasharray="4 4" />
            <line x1={14} y1={Y(-h.R)} x2={W - 14} y2={Y(-h.R)} stroke="var(--gold)" strokeWidth={1} strokeDasharray="4 4" />
            <path d={d1} fill="none" stroke="var(--brand)" strokeWidth={4} opacity={0.55} />
            <path d={d2} fill="none" stroke="var(--bad)" strokeWidth={1.8} strokeDasharray="5 4" />
            {sols.map((v) => (
              <circle key={v} cx={X(v)} cy={Y(c)} r={4} fill="var(--bad)" />
            ))}
            {Number.isFinite(c) && Math.abs(c) <= ymax && <line x1={14} y1={Y(c)} x2={W - 14} y2={Y(c)} stroke="var(--coral)" strokeWidth={1.2} strokeDasharray="2 4" />}
          </svg>
          <div style={{ overflowX: 'auto' }}>
            <table className="rtable">
              <tbody>
                <tr>
                  <td>R = √(a² + b²)</td>
                  <td>{fmt(h.R, sep, 4)}</td>
                  <td>{tc(L('maximum and minimum', 'maksimum dan minimum'))}</td>
                  <td>
                    ±{fmt(h.R, sep, 3)}
                  </td>
                </tr>
                <tr>
                  <td>φ = atan2(b, a)</td>
                  <td>{fmt(h.phi, sep, 3)}°</td>
                  <td>α = atan2(a, b)</td>
                  <td>{fmt(h.alpha, sep, 3)}°</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="inrow">
            <label className="lbl">
              {tc(L('solve', 'selesaikan'))} {tc(L('the equation', 'persamaan'))} … = <input style={{ width: '5em' }} value={cText} inputMode="decimal" aria-label="c" onChange={(e) => setCText(e.target.value)} />
            </label>
          </div>
          <div className="wgtout" aria-live="polite">
            {cText.trim() === '' || !Number.isFinite(c) ? (
              <p className="warnline">{tc(L('Type a number.', 'Ketik sebuah bilangan.'))}</p>
            ) : sols.length === 0 ? (
              <p className="badline">{tc(L(`No solution: |${short(c, sep, 3)}| is larger than R = ${fmt(h.R, sep, 3)}, the highest the wave goes.`, `Tidak ada penyelesaian: |${short(c, sep, 3)}| lebih besar dari R = ${fmt(h.R, sep, 3)}, tertinggi yang dicapai gelombang.`))}</p>
            ) : (
              <p className="okline" style={{ overflowWrap: 'anywhere' }}>
                {tc(L('Between 0° and 360°', 'Di antara 0° dan 360°'))}: x = {sols.map((v) => `${short(v, sep, 4)}°`).join(` ${tc(L('and', 'dan'))} `)}
              </p>
            )}
          </div>
          <p className="small muted">{tc(L('The wide faint curve is a sin x + b cos x; the thin dashed red curve is R sin(x + φ) drawn on top of it: they are the same curve.', 'Kurva lebar yang samar adalah a sin x + b cos x; kurva merah putus-putus yang tipis adalah R sin(x + φ) yang digambar di atasnya: keduanya kurva yang sama.'))}</p>
        </>
      ) : (
        <p className="warnline">{tc(L('With a = 0 and b = 0 there is no wave. Move one slider.', 'Dengan a = 0 dan b = 0 tidak ada gelombang. Geser salah satu penggeser.'))}</p>
      )}
    </Frame>
  )
}

