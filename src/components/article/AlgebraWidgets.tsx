import { useState } from 'react'
import { useI18n } from '../../i18n'
import type { Loc } from '../../content/types'
import { parseRational, rat, type Rat } from '../../lib/realnum'
import {
  AlgebraError,
  degree,
  equal,
  evalPoly,
  factorPoly,
  kindOf,
  monoParts,
  monoTex,
  parsePoly,
  polyTex,
  termsOf,
  variables,
  type FactorPattern,
  type PolyKind,
} from '../../lib/algebra'
import { Tex } from '../ui'
import { Frame, L } from './widgetKit'

/* ------------------------------------------------------------------ helpers */

const ERRORS: Record<AlgebraError['code'], Loc> = {
  empty: L('Type an expression.', 'Ketik sebuah ekspresi.'),
  char: L('That character is not allowed. Use letters, numbers, + − * / ^ and brackets.', 'Karakter itu tidak diperbolehkan. Pakai huruf, angka, + − * / ^ dan tanda kurung.'),
  syntax: L('Check the brackets and operators, and put a number before a letter: 2x, not x2.', 'Periksa tanda kurung dan operatornya, dan taruh angka sebelum huruf: 2x, bukan x2.'),
  number: L('That number is not readable.', 'Bilangan itu tidak terbaca.'),
  division: L('Dividing by an expression is not supported here; dividing by a number is.', 'Pembagian dengan ekspresi tidak didukung di sini; pembagian dengan bilangan didukung.'),
  exponent: L('Exponents must be whole numbers from 0 to 12, with one exponent per power.', 'Eksponen harus bilangan bulat dari 0 sampai 12, dengan satu eksponen per pangkat.'),
  big: L('That expression is too large for this tool.', 'Ekspresi itu terlalu besar untuk alat ini.'),
  multi: L('Use at most three different letters.', 'Pakai paling banyak tiga huruf yang berbeda.'),
}

/** Runs `f`, turning an `AlgebraError` into the sentence to show. */
function attempt<T>(f: () => T): { ok: true; value: T } | { ok: false; code: AlgebraError['code'] } {
  try {
    return { ok: true, value: f() }
  } catch (e) {
    if (e instanceof AlgebraError) return { ok: false, code: e.code }
    throw e
  }
}

const ratTex = (r: Rat): string => (r.d === 1n ? `${r.n}` : `${r.n < 0n ? '-' : ''}\\frac{${r.n < 0n ? -r.n : r.n}}{${r.d}}`)

const KIND: Record<PolyKind, Loc> = {
  zero: L('zero', 'nol'),
  monomial: L('monomial (1 term)', 'monomial (1 suku)'),
  binomial: L('binomial (2 terms)', 'binomial (2 suku)'),
  trinomial: L('trinomial (3 terms)', 'trinomial (3 suku)'),
  polynomial: L('polynomial (4 or more terms)', 'polinomial (4 suku atau lebih)'),
}

/* ------------------------------------------------------------------ anatomy */

const GROUPS = ['grp0', 'grp1', 'grp2', 'grp3', 'grp4', 'grp5']

export function ExpressionAnatomy() {
  const { tc } = useI18n()
  const [text, setText] = useState('3x^2 - 5x + 7 + 2x')
  const r = attempt(() => termsOf(text))

  let body
  if (!r.ok)
    body = (
      <p className="noline">
        {r.code === 'syntax' && text.includes('(')
          ? tc(L('Write it as a sum of terms like 3x^2 - 5x + 7. A product of brackets such as (x+1)(x+2) has no single coefficient until it is expanded: use the expand tool first.', 'Tulis sebagai jumlah suku seperti 3x^2 - 5x + 7. Hasil kali kurung seperti (x+1)(x+2) belum punya satu koefisien sebelum dijabarkan: pakai alat penjabaran lebih dulu.'))
          : tc(ERRORS[r.code])}
      </p>
    )
  else {
    const terms = r.value
    const order = [...new Set(terms.map((t) => t.mono))]
    const likeGroups = order.filter((m) => terms.filter((t) => t.mono === m).length > 1)
    body = (
      <>
        <div className="gridwrap">
          <table className="rtable">
            <thead>
              <tr>
                <th>{tc(L('Term', 'Suku'))}</th>
                <th>{tc(L('Coefficient', 'Koefisien'))}</th>
                <th>{tc(L('Variable part', 'Bagian variabel'))}</th>
                <th>{tc(L('Degree', 'Derajat'))}</th>
              </tr>
            </thead>
            <tbody>
              {terms.map((t, i) => {
                const like = terms.filter((x) => x.mono === t.mono).length > 1
                return (
                  <tr key={i} className={like ? GROUPS[order.indexOf(t.mono) % GROUPS.length] : ''}>
                    <td>
                      <Tex src={polyTex(new Map([[t.mono, t.coef]]))} />
                    </td>
                    <td>
                      <Tex src={ratTex(t.coef)} />
                    </td>
                    <td>{t.mono === '' ? tc(L('none (a constant)', 'tidak ada (konstanta)')) : <Tex src={monoTex(t.mono)} />}</td>
                    <td>{t.degree}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="small">
          {tc(L('Terms', 'Suku'))}: <b>{terms.length}</b> · {tc(L('Degree of the expression', 'Derajat ekspresi'))}: <b>{Math.max(...terms.map((t) => t.degree))}</b>
        </p>
        <p className="small muted">
          {likeGroups.length
            ? tc(L('Rows with the same color are like terms: they have the same variable part, so they can be combined.', 'Baris yang warnanya sama adalah suku sejenis: bagian variabelnya sama, sehingga dapat digabung.'))
            : tc(L('No two terms are alike, so nothing can be combined.', 'Tidak ada dua suku yang sejenis, sehingga tidak ada yang dapat digabung.'))}
        </p>
      </>
    )
  }

  return (
    <Frame name="terms">
      <div className="inrow">
        <input style={{ width: '18em' }} value={text} aria-label={tc(L('An expression', 'Sebuah ekspresi'))} onChange={(e) => setText(e.target.value)} />
      </div>
      <div className="chips">
        {['3x^2 - 5x + 7', '4xy + 2x - xy + 9', '2x + 3x - 7 + 4', 'a^2 - 2ab + b^2'].map((p) => (
          <button key={p} className="chip" onClick={() => setText(p)}>
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

/* ------------------------------------------------------------------- expand */

export function ExpandSimplify() {
  const { tc } = useI18n()
  const [text, setText] = useState('(x+2)(x-3)')
  const r = attempt(() => parsePoly(text))

  return (
    <Frame name="expand">
      <div className="inrow">
        <input style={{ width: '18em' }} value={text} aria-label={tc(L('An expression', 'Sebuah ekspresi'))} onChange={(e) => setText(e.target.value)} />
      </div>
      <div className="chips">
        {['(x+2)(x-3)', '5x^2+3x-2x^2+7x-4', '(2x+3)^2', '3(x+2)-2(x-1)', '(a+b)(a-b)', '(x+1)^3'].map((p) => (
          <button key={p} className="chip" onClick={() => setText(p)}>
            {p}
          </button>
        ))}
      </div>
      <p className="muted small">{tc(L('Use + − * / ^ and brackets; 2x and 2*x both work. Dividing by a number is fine.', 'Pakai + − * / ^ dan tanda kurung; 2x dan 2*x sama-sama bisa. Pembagian dengan bilangan diperbolehkan.'))}</p>
      <div className="wgtout" aria-live="polite">
        {!r.ok ? (
          <p className="noline">{tc(ERRORS[r.code])}</p>
        ) : (
          <>
            <p className="bigcn">
              <Tex src={polyTex(r.value)} />
            </p>
            <p className="small">
              {tc(L('Terms', 'Suku'))}: <b>{r.value.size}</b> · {tc(L('Degree', 'Derajat'))}: <b>{degree(r.value)}</b> · {tc(KIND[kindOf(r.value)])}
            </p>
          </>
        )}
      </div>
    </Frame>
  )
}

/* ----------------------------------------------------------------- evaluate */

/** The typed expression with every letter replaced by its value in brackets. */
function substitutedTex(text: string, values: Record<string, string>): string {
  return text
    .replace(/−/g, '-')
    .replace(/\s+/g, '')
    .replace(/\^(\d+)/g, '^{$1}')
    .replace(/[*×·]/g, '\\cdot ')
    .replace(/[A-Za-z]/g, (c) => `(${values[c] ?? c})`)
}

export function EvaluateExpression() {
  const { tc } = useI18n()
  const [text, setText] = useState('3x^2 - 5x + 1')
  const [vals, setVals] = useState<Record<string, string>>({ x: '2', y: '3', a: '2', b: '3' })
  const r = attempt(() => parsePoly(text))
  const letters = r.ok ? variables(r.value) : []
  const rats: Record<string, Rat> = {}
  let missing = false
  for (const l of letters) {
    const v = parseRational((vals[l] ?? '').trim())
    if (v && (v.n < 0n ? -v.n : v.n) <= 999n && v.d <= 99n) rats[l] = v
    else missing = true
  }
  const value = r.ok && !missing ? evalPoly(r.value, rats) : null

  return (
    <Frame name="evalexpr">
      <div className="inrow">
        <input style={{ width: '18em' }} value={text} aria-label={tc(L('An expression', 'Sebuah ekspresi'))} onChange={(e) => setText(e.target.value)} />
      </div>
      <div className="chips">
        {['3x^2 - 5x + 1', '2x^2 - 3x', 'a^2 + 2ab + b^2', 'x^3 - x'].map((p) => (
          <button key={p} className="chip" onClick={() => setText(p)}>
            {p}
          </button>
        ))}
      </div>
      {r.ok && letters.length > 0 && (
        <div className="inrow">
          {letters.map((l) => (
            <label key={l} className="lbl">
              {l} = <input aria-label={l} value={vals[l] ?? ''} onChange={(e) => setVals({ ...vals, [l]: e.target.value })} />
            </label>
          ))}
        </div>
      )}
      <div className="wgtout" aria-live="polite">
        {!r.ok ? (
          <p className="noline">{tc(ERRORS[r.code])}</p>
        ) : letters.length === 0 ? (
          <p className="muted">{tc(L('There is no variable to replace: this expression is just a number.', 'Tidak ada variabel yang diganti: ekspresi ini hanya sebuah bilangan.'))}</p>
        ) : missing ? (
          <p className="muted">{tc(L('Give each letter a whole number or a simple fraction.', 'Beri tiap huruf sebuah bilangan bulat atau pecahan sederhana.'))}</p>
        ) : (
          <>
            <p>
              <Tex src={`${substitutedTex(text, Object.fromEntries(letters.map((l) => [l, ratTex(rats[l])])))}=${value ? ratTex(value) : '?'}`} />
            </p>
            {letters.length === 1 && (
              <div className="gridwrap">
                <table className="rtable">
                  <thead>
                    <tr>
                      <th>{letters[0]}</th>
                      {[-3, -2, -1, 0, 1, 2, 3].map((n) => (
                        <td key={n}>{n}</td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>{tc(L('value', 'nilai'))}</th>
                      {[-3, -2, -1, 0, 1, 2, 3].map((n) => {
                        const v = evalPoly(r.value, { [letters[0]]: rat(BigInt(n), 1n) })
                        return (
                          <td key={n}>
                            <Tex src={v ? ratTex(v) : '?'} />
                          </td>
                        )
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </Frame>
  )
}

/* ---------------------------------------------------------------- area model */

export function AreaModel() {
  const { tc } = useI18n()
  const [a, setA] = useState(5)
  const [b, setB] = useState(3)
  const [c, setC] = useState(4)
  const [d, setD] = useState(2)

  const W = 340
  const H = 240
  const pad = 26
  const u = Math.min((W - pad - 8) / (a + b), (H - pad - 8) / (c + d))
  const x0 = pad
  const y0 = pad
  const rects = [
    { x: 0, y: 0, w: a, h: c, label: `${a}·${c}`, area: a * c, cls: 'am0' },
    { x: a, y: 0, w: b, h: c, label: `${b}·${c}`, area: b * c, cls: 'am1' },
    { x: 0, y: c, w: a, h: d, label: `${a}·${d}`, area: a * d, cls: 'am2' },
    { x: a, y: c, w: b, h: d, label: `${b}·${d}`, area: b * d, cls: 'am3' },
  ]
  const total = (a + b) * (c + d)

  const slider = (name: string, v: number, set: (n: number) => void) => (
    <label className="lbl slider">
      {name} = <b>{v}</b>
      <input type="range" min={1} max={9} value={v} aria-label={name} onChange={(e) => set(Number(e.target.value))} />
    </label>
  )

  return (
    <Frame name="areamodel">
      <div className="amctl">
        {slider('a', a, setA)}
        {slider('b', b, setB)}
        {slider('c', c, setC)}
        {slider('d', d, setD)}
      </div>
      <div className="chips">
        <button
          className="chip"
          onClick={() => {
            setC(a)
            setD(b)
          }}
        >
          {tc(L('Make it a square: c = a, d = b', 'Jadikan persegi: c = a, d = b'))}
        </button>
        <button className="chip" onClick={() => (setA(5), setB(3), setC(4), setD(2))}>
          {tc(L('Reset', 'Ulangi'))}
        </button>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="amsvg" role="img" aria-label={tc(L('Area model of a product of two sums', 'Model luas dari hasil kali dua jumlah'))}>
        {rects.map((r) => (
          <g key={r.cls}>
            <rect x={x0 + r.x * u} y={y0 + r.y * u} width={r.w * u} height={r.h * u} className={`amrect ${r.cls}`} />
            <text x={x0 + (r.x + r.w / 2) * u} y={y0 + (r.y + r.h / 2) * u - 4} textAnchor="middle" className="amtext">
              {r.label}
            </text>
            <text x={x0 + (r.x + r.w / 2) * u} y={y0 + (r.y + r.h / 2) * u + 12} textAnchor="middle" className="amtext big">
              {r.area}
            </text>
          </g>
        ))}
        <text x={x0 + (a / 2) * u} y={16} textAnchor="middle" className="amside">
          a = {a}
        </text>
        <text x={x0 + (a + b / 2) * u} y={16} textAnchor="middle" className="amside">
          b = {b}
        </text>
        <text x={12} y={y0 + (c / 2) * u + 4} textAnchor="middle" className="amside">
          c
        </text>
        <text x={12} y={y0 + (c + d / 2) * u + 4} textAnchor="middle" className="amside">
          d
        </text>
      </svg>
      <div className="wgtout" aria-live="polite">
        <p>
          <Tex src={`(${a}+${b})(${c}+${d})=${a}\\cdot${c}+${b}\\cdot${c}+${a}\\cdot${d}+${b}\\cdot${d}=${a * c}+${b * c}+${a * d}+${b * d}=${total}`} />
        </p>
        <p className="small muted">
          <Tex src={`${a + b}\\times${c + d}=${total}`} /> {tc(L('— the rectangle has the same area however it is cut.', '— luas persegi panjang itu sama seperti apa pun cara memotongnya.'))}
        </p>
      </div>
    </Frame>
  )
}

/* -------------------------------------------------------------------- factor */

const PATTERN: Record<FactorPattern, Loc> = {
  common: L('common factor taken out', 'faktor persekutuan dikeluarkan'),
  square: L('perfect square trinomial', 'trinomial kuadrat sempurna'),
  diffsq: L('difference of squares', 'selisih dua kuadrat'),
  trinomial: L('trinomial split into two brackets', 'trinomial dipecah menjadi dua kurung'),
}

export function FactorWidget() {
  const { tc } = useI18n()
  const [text, setText] = useState('x^2 - 5x + 6')
  const r = attempt(() => parsePoly(text))
  const f = r.ok ? factorPoly(r.value) : null
  const vars = r.ok ? variables(r.value) : []

  let body
  if (!r.ok) body = <p className="noline">{tc(ERRORS[r.code])}</p>
  else if (r.value.size === 0) body = <p className="muted">{tc(L('That is 0: there is nothing to factor.', 'Itu 0: tidak ada yang difaktorkan.'))}</p>
  else if (vars.length > 1) body = <p className="muted">{tc(L('This tool factors expressions in one letter.', 'Alat ini memfaktorkan ekspresi dengan satu huruf.'))}</p>
  else if (!f) body = <p className="muted">{tc(L('Use whole-number coefficients, for example 2x^2 + 7x + 3.', 'Pakai koefisien bilangan bulat, misalnya 2x^2 + 7x + 3.'))}</p>
  else if (r.value.size === 1)
    body = (
      <>
        <p className="bigcn">
          <Tex src={polyTex(r.value)} />
        </p>
        <p className="small">{tc(L('A single term is already a product: there is nothing to factor.', 'Satu suku sudah berupa hasil kali: tidak ada yang difaktorkan.'))}</p>
      </>
    )
  else if (f.patterns.length === 0 && f.note === null && (f.tex === polyTex(r.value) || f.tex === `(${polyTex(r.value)})`))
    body = (
      <>
        <p className="bigcn">
          <Tex src={polyTex(r.value)} />
        </p>
        <p className="small">{tc(L('Nothing to take out: this is already as factored as it gets.', 'Tidak ada yang dikeluarkan: ini sudah sefaktor mungkin.'))}</p>
      </>
    )
  else if (f.patterns.length === 0 && f.note === 'irreducible')
    body = (
      <>
        <p className="bigcn">
          <Tex src={polyTex(r.value)} />
        </p>
        <p className="small">{tc(L('This does not factor over the whole numbers: there is no common factor, and the quadratic has no pair of whole-number factors (its discriminant is not a perfect square).', 'Ini tidak dapat difaktorkan di bilangan bulat: tidak ada faktor persekutuan, dan kuadratnya tidak punya pasangan faktor bilangan bulat (diskriminannya bukan kuadrat sempurna).'))}</p>
      </>
    )
  else
    body = (
      <>
        <p className="bigcn">
          <Tex src={`${polyTex(r.value)}=${f.tex}`} />
        </p>
        <p className="small">
          {f.patterns.length > 0 ? (
            <>
              {tc(L('Used', 'Dipakai'))}: {f.patterns.map((p) => tc(PATTERN[p])).join(' → ')}
            </>
          ) : f.note === 'irreducible' ? null : (
            tc(L('Nothing to take out: this is already as factored as it gets.', 'Tidak ada yang dikeluarkan: ini sudah sefaktor mungkin.'))
          )}
        </p>
        {f.note === 'irreducible' && <p className="small">{tc(L('The quadratic in the bracket has no whole-number factors (its discriminant is not a perfect square), so it stays as it is.', 'Kuadrat di dalam kurung tidak punya faktor bilangan bulat (diskriminannya bukan kuadrat sempurna), sehingga ia dibiarkan.'))}</p>}
        {f.note === 'degree' && <p className="small">{tc(L('What is left in the bracket has degree 3 or more, which this tool does not break down further.', 'Yang tersisa di dalam kurung berderajat 3 atau lebih, yang tidak dipecah lagi oleh alat ini.'))}</p>}
        <p className={equal(f.product, r.value) ? 'okline small' : 'noline small'}>
          {equal(f.product, r.value)
            ? tc(L('Check: multiplying the factors out gives the original expression.', 'Pemeriksaan: menjabarkan faktor-faktornya memberi ekspresi semula.'))
            : tc(L('The factors do not multiply back: please report this.', 'Faktornya tidak kembali ke semula: mohon laporkan ini.'))}
        </p>
      </>
    )

  return (
    <Frame name="factor">
      <div className="inrow">
        <input style={{ width: '18em' }} value={text} aria-label={tc(L('An expression', 'Sebuah ekspresi'))} onChange={(e) => setText(e.target.value)} />
      </div>
      <div className="chips">
        {['x^2 - 5x + 6', 'x^2 - 25', '6x^2 + 9x', '2x^2 + 7x + 3', 'x^2 + 6x + 9', 'x^3 - x', 'x^2 + 1', '-x^2 + 4'].map((p) => (
          <button key={p} className="chip" onClick={() => setText(p)}>
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

// `monoParts` is re-exported for callers that build their own term tables.
export { monoParts }
