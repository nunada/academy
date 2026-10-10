import { useState } from 'react'
import { useI18n } from '../../i18n'
import type { Loc } from '../../content/types'
import { gcd, parseRational } from '../../lib/realnum'
import { ratMul } from '../../lib/rationals'
import { children, euclid, hypotenuse, isPrimitive, oddFirst, otherLeg, parent, triplesUpTo, triplesWithLeg, type Missing, type Rat, type Triple } from '../../lib/pythagoras'
import { Tex } from '../ui'
import { Frame, L, dec, useSep } from './widgetKit'

/* ------------------------------------------------------------------ helpers */

const num = (r: Rat): number => Number(r.n) / Number(r.d)
const ratTex = (r: Rat): string => (r.d === 1n ? `${r.n}` : `${r.n < 0n ? '-' : ''}\\frac{${r.n < 0n ? -r.n : r.n}}{${r.d}}`)
const small = (r: Rat | null): r is Rat => r !== null && (r.n < 0n ? -r.n : r.n) <= 9999n && r.d <= 99n
const sqr = (r: Rat): Rat => ratMul(r, r)
const f = (x: number, places: number, sep: string): string => dec((Math.round(x * 10 ** places) / 10 ** places).toString(), sep)
const tripleText = (t: Triple): string => `(${t[0]}, ${t[1]}, ${t[2]})`

function rootTex(m: Missing): string {
  if (m.k.n === 0n) return '0'
  if (m.m === 1n) return ratTex(m.k)
  return m.k.n === 1n && m.k.d === 1n ? `\\sqrt{${m.m}}` : `${ratTex(m.k)}\\sqrt{${m.m}}`
}

function Field({ label, value, set, width = '5em' }: { label: string; value: string; set: (s: string) => void; width?: string }) {
  return (
    <label className="lbl">
      {label} <input style={{ width }} value={value} aria-label={label} onChange={(e) => set(e.target.value)} />
    </label>
  )
}

/** A whole number typed as digits, up to a limit; null otherwise. */
const wholeNumber = (s: string, max: number): bigint | null => (/^\d{1,9}$/.test(s.trim()) && Number(s) <= max ? BigInt(s.trim()) : null)

/* --------------------------------------------- the missing side, with squares */

type Find = 'hypotenuse' | 'leg'

export function PythagorasSolver() {
  const { tc } = useI18n()
  const sep = useSep()
  const [find, setFind] = useState<Find>('hypotenuse')
  const [x, setX] = useState('3')
  const [y, setY] = useState('4')
  const pick = (m: Find) => {
    setFind(m)
    if (m === 'hypotenuse') {
      setX('3')
      setY('4')
    } else {
      setX('5')
      setY('13')
    }
  }
  const a = parseRational(x)
  const b = parseRational(y)
  const ok = small(a) && small(b) && a.n > 0n && b.n > 0n

  let body
  if (!ok) body = <p className="noline">{tc(L('Type two positive numbers or fractions such as 3, 4.5 or 7/2.', 'Ketik dua bilangan atau pecahan positif seperti 3, 4,5, atau 7/2.'))}</p>
  else {
    const A = a as Rat
    const B = b as Rat
    const res: Missing | null = find === 'hypotenuse' ? hypotenuse(A, B) : otherLeg(A, B)
    if (!res)
      body = <p className="noline">{tc(L('The hypotenuse is the longest side, so it must be longer than the leg.', 'Hipotenusa adalah sisi terpanjang, sehingga ia harus lebih panjang daripada sisi tegak.'))}</p>
    else {
      const aN = num(A)
      const bN = find === 'hypotenuse' ? num(B) : res.value
      const W = 340
      const H = 300
      const xMin = -bN
      const yMin = -aN
      const wx = aN + 2 * bN
      const wy = aN + bN + aN
      const pad = 10
      const sc = Math.min((W - 2 * pad) / wx, (H - 2 * pad) / wy)
      const px = (u: number) => pad + (u - xMin) * sc + (W - 2 * pad - wx * sc) / 2
      const py = (v: number) => H - pad - (v - yMin) * sc - (H - 2 * pad - wy * sc) / 2
      const poly = (pts: [number, number][]) => pts.map(([u, v]) => `${px(u).toFixed(1)},${py(v).toFixed(1)}`).join(' ')
      const label = (u: number, v: number, t: string) => (
        <text x={px(u)} y={py(v) + 4} textAnchor="middle" className="pythlabel">
          {t}
        </text>
      )
      const exactTriple = res.rational && A.d === 1n && B.d === 1n
      const sides: Triple | null = exactTriple ? (find === 'hypotenuse' ? [A.n, B.n, res.k.n] : [A.n, res.k.n, B.n]) : null
      body = (
        <>
          <svg viewBox={`0 0 ${W} ${H}`} className="quadsvg pythsvg" role="img" aria-label={tc(L('A right triangle with a square on each side', 'Segitiga siku-siku dengan persegi pada setiap sisi'))}>
            <polygon points={poly([[0, 0], [aN, 0], [aN, -aN], [0, -aN]])} className="pythsqa" />
            <polygon points={poly([[0, 0], [-bN, 0], [-bN, bN], [0, bN]])} className="pythsqb" />
            <polygon points={poly([[aN, 0], [0, bN], [bN, bN + aN], [aN + bN, aN]])} className="pythsqc" />
            <polygon points={poly([[0, 0], [aN, 0], [0, bN]])} className="pythtri" />
            {label(aN / 2, -aN / 2, 'a²')}
            {label(-bN / 2, bN / 2, 'b²')}
            {label((aN + bN) / 2, (aN + bN) / 2, 'c²')}
            <text x={px(aN / 2)} y={py(0) - 5} textAnchor="middle" className="quadlabel">a</text>
            <text x={px(0) + 9} y={py(bN / 2)} className="quadlabel">b</text>
            <text x={px(aN / 2) + 8} y={py(bN / 2) - 4} className="quadlabel">c</text>
          </svg>
          <p>
            {find === 'hypotenuse' ? (
              <Tex src={`c^2=a^2+b^2=${ratTex(sqr(A))}+${ratTex(sqr(B))}=${ratTex(res.square)}`} />
            ) : (
              <Tex src={`b^2=c^2-a^2=${ratTex(sqr(B))}-${ratTex(sqr(A))}=${ratTex(res.square)}`} />
            )}
          </p>
          <p className="okline">
            {find === 'hypotenuse' ? 'c' : 'b'} = <Tex src={rootTex(res)} />
            {res.rational ? null : (
              <>
                {' '}
                ≈ <b>{f(res.value, 4, sep)}</b> — {tc(L('an irrational length, left as a root', 'panjang irasional, dibiarkan sebagai akar'))}
              </>
            )}
          </p>
          {sides && (
            <p className="small muted">
              {tc(L('Whole numbers all round: a Pythagorean triple', 'Semuanya bilangan bulat: sebuah tripel Pythagoras'))} {tripleText(sides)}
              {isPrimitive(sides) ? ` — ${tc(L('primitive', 'primitif'))}` : ''}
            </p>
          )}
        </>
      )
    }
  }

  return (
    <Frame name="pythsolve">
      <div className="chips">
        <button className={`chip ${find === 'hypotenuse' ? 'on' : ''}`} onClick={() => pick('hypotenuse')} aria-pressed={find === 'hypotenuse'}>
          {tc(L('find the hypotenuse', 'cari hipotenusa'))}
        </button>
        <button className={`chip ${find === 'leg' ? 'on' : ''}`} onClick={() => pick('leg')} aria-pressed={find === 'leg'}>
          {tc(L('find a leg', 'cari sisi tegak'))}
        </button>
      </div>
      <div className="inrow">
        <Field label={find === 'hypotenuse' ? tc(L('leg a', 'sisi tegak a')) : tc(L('leg a', 'sisi tegak a'))} value={x} set={setX} />
        <Field label={find === 'hypotenuse' ? tc(L('leg b', 'sisi tegak b')) : tc(L('hypotenuse c', 'hipotenusa c'))} value={y} set={setY} />
      </div>
      <div className="chips">
        {(find === 'hypotenuse' ? [['3', '4'], ['5', '12'], ['1', '1'], ['6', '4'], ['2', '3'], ['1.5', '2']] : [['5', '13'], ['9', '15'], ['1', '2'], ['4', '7']]).map(([p, q]) => {
          const lp = sep === ',' ? p.replace('.', ',') : p
          return (
            <button
              key={p + q}
              className="chip ghost"
              onClick={() => {
                setX(lp)
                setY(q)
              }}
            >
              {lp}, {q}
            </button>
          )
        })}
      </div>
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}

/* ---------------------------------------------- the proof by rearrangement */

export function PythagorasProof() {
  const { tc } = useI18n()
  const [a, setA] = useState(3)
  const [b, setB] = useState(4)
  const [mode, setMode] = useState<'tilted' | 'squares'>('tilted')
  const s = a + b
  const W = 300
  const sc = (W - 20) / s
  const px = (u: number) => 10 + u * sc
  const py = (v: number) => 10 + (s - v) * sc
  const poly = (pts: [number, number][]) => pts.map(([u, v]) => `${px(u).toFixed(1)},${py(v).toFixed(1)}`).join(' ')
  const lab = (u: number, v: number, t: string) => (
    <text x={px(u)} y={py(v) + 4} textAnchor="middle" className="pythlabel">
      {t}
    </text>
  )
  const c2 = a * a + b * b
  const tilted = mode === 'tilted'
  const triangles: [number, number][][] = tilted
    ? [[[0, 0], [a, 0], [0, b]], [[a, 0], [s, 0], [s, a]], [[s, a], [s, s], [b, s]], [[b, s], [0, s], [0, b]]]
    : [[[a, 0], [s, 0], [s, a]], [[a, 0], [a, a], [s, a]], [[0, a], [a, a], [a, s]], [[0, a], [0, s], [a, s]]]

  return (
    <Frame name="pythproof">
      <div className="chips">
        <button className={`chip ${tilted ? 'on' : ''}`} onClick={() => setMode('tilted')} aria-pressed={tilted}>
          {tc(L('four triangles round a tilted square', 'empat segitiga mengelilingi persegi miring'))}
        </button>
        <button className={`chip ${!tilted ? 'on' : ''}`} onClick={() => setMode('squares')} aria-pressed={!tilted}>
          {tc(L('the same triangles, rearranged', 'segitiga yang sama, ditata ulang'))}
        </button>
      </div>
      <div className="amctl">
        <label className="lbl slider">
          a = <b>{a}</b>
          <input type="range" min={1} max={9} value={a} aria-label="a" onChange={(e) => setA(Number(e.target.value))} />
        </label>
        <label className="lbl slider">
          b = <b>{b}</b>
          <input type="range" min={1} max={9} value={b} aria-label="b" onChange={(e) => setB(Number(e.target.value))} />
        </label>
      </div>
      <svg viewBox={`0 0 ${W} ${W}`} className="quadsvg pythsvg" role="img" aria-label={tc(L('A square of side a plus b filled by four equal right triangles and either one tilted square or two squares', 'Persegi bersisi a ditambah b yang diisi empat segitiga siku-siku sama besar dan satu persegi miring atau dua persegi'))}>
        <polygon points={poly([[0, 0], [s, 0], [s, s], [0, s]])} className="pythframe" />
        {tilted ? (
          <polygon points={poly([[a, 0], [s, a], [b, s], [0, b]])} className="pythsqc" />
        ) : (
          <>
            <polygon points={poly([[0, 0], [a, 0], [a, a], [0, a]])} className="pythsqa" />
            <polygon points={poly([[a, a], [s, a], [s, s], [a, s]])} className="pythsqb" />
          </>
        )}
        {triangles.map((t, i) => (
          <polygon key={i} points={poly(t)} className="pythtri" />
        ))}
        {tilted ? lab((a + b) / 2, (a + b) / 2, `c² = ${c2}`) : <>{lab(a / 2, a / 2, `a² = ${a * a}`)}{lab(a + b / 2, a + b / 2, `b² = ${b * b}`)}</>}
      </svg>
      <p>
        <Tex src={`(a+b)^2=4\\cdot\\tfrac12ab+${tilted ? 'c^2' : 'a^2+b^2'}\\quad\\Rightarrow\\quad ${s * s}=${2 * a * b}+${c2}`} />
      </p>
      <p className="okline">
        {tilted
          ? tc(L(`The square in the middle has area c² = ${s * s} − ${2 * a * b} = ${c2}.`, `Persegi di tengah berluas c² = ${s * s} − ${2 * a * b} = ${c2}.`))
          : tc(L(`The two squares have area a² + b² = ${a * a} + ${b * b} = ${c2}: the same ${c2}.`, `Kedua persegi berluas a² + b² = ${a * a} + ${b * b} = ${c2}: ${c2} yang sama.`))}
      </p>
    </Frame>
  )
}

/* ---------------------------------------------------------- the triples */

type TripleMode = 'hyp' | 'leg' | 'euclid'

export function PythagoreanTriples() {
  const { tc } = useI18n()
  const [mode, setMode] = useState<TripleMode>('hyp')
  const [limit, setLimit] = useState('100')
  const [prim, setPrim] = useState(true)
  const [leg, setLeg] = useState('12')
  const [mm, setMm] = useState('5')
  const [nn, setNn] = useState('2')

  let body
  if (mode === 'hyp') {
    const N = wholeNumber(limit, 500)
    if (N === null || N < 5n) body = <p className="noline">{tc(L('Type a whole number from 5 to 500.', 'Ketik bilangan bulat dari 5 sampai 500.'))}</p>
    else {
      const all = triplesUpTo(Number(N), prim)
      const rows = all.slice(0, 40)
      body = (
        <>
          <p className="okline">
            {tc(L(`${all.length} ${prim ? 'primitive ' : ''}triple${all.length === 1 ? '' : 's'} with hypotenuse up to ${N}.`, `${all.length} tripel ${prim ? 'primitif ' : ''}dengan hipotenusa sampai ${N}.`))}
          </p>
          <div className="gridwrap">
            <table className="rtable">
              <tbody>
                <tr>
                  <th>a</th>
                  <th>b</th>
                  <th>c</th>
                  <th>{tc(L('primitive', 'primitif'))}</th>
                </tr>
                {rows.map((t) => (
                  <tr key={t.join()}>
                    <td>{String(t[0])}</td>
                    <td>{String(t[1])}</td>
                    <td>{String(t[2])}</td>
                    <td>{isPrimitive(t) ? '✓' : `× ${gcd(gcd(t[0], t[1]), t[2])}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {all.length > rows.length && <p className="small muted">{tc(L(`…and ${all.length - rows.length} more.`, `…dan ${all.length - rows.length} lainnya.`))}</p>}
        </>
      )
    }
  } else if (mode === 'leg') {
    const a = wholeNumber(leg, 100000)
    if (a === null || a < 1n) body = <p className="noline">{tc(L('Type a whole number from 1 to 100000.', 'Ketik bilangan bulat dari 1 sampai 100000.'))}</p>
    else {
      const rows = triplesWithLeg(a)
      body = rows.length === 0 ? (
        <p className="noline">{tc(L(`No right triangle with whole sides has a leg of ${a}.`, `Tidak ada segitiga siku-siku bersisi bilangan bulat dengan sisi tegak ${a}.`))}</p>
      ) : (
        <>
          <p className="okline">{tc(L(`${rows.length} right triangle${rows.length === 1 ? '' : 's'} with whole sides and a leg of ${a}:`, `${rows.length} segitiga siku-siku bersisi bilangan bulat dengan sisi tegak ${a}:`))}</p>
          <ul className="steps">
            {rows.slice(0, 30).map((t) => (
              <li key={t.join()}>
                <Tex src={`${t[0]}^2+${t[1]}^2=${t[0] * t[0] + t[1] * t[1]}=${t[2]}^2`} /> {isPrimitive(t) ? `(${tc(L('primitive', 'primitif'))})` : ''}
              </li>
            ))}
          </ul>
          <p className="small muted">{tc(L('Found by factoring a² = (c − b)(c + b): both factors must have the same parity.', 'Ditemukan dengan memfaktorkan a² = (c − b)(c + b): kedua faktor harus sama paritasnya.'))}</p>
        </>
      )
    }
  } else {
    const m = wholeNumber(mm, 999)
    const n = wholeNumber(nn, 999)
    if (m === null || n === null || n < 1n || m <= n) body = <p className="noline">{tc(L('Type whole numbers with m > n > 0.', 'Ketik bilangan bulat dengan m > n > 0.'))}</p>
    else {
      const t = euclid(m, n)
      const primitive = gcd(m, n) === 1n && (m - n) % 2n === 1n
      body = (
        <>
          <p>
            <Tex src={`(m^2-n^2,\\ 2mn,\\ m^2+n^2)=(${t[0]},\\ ${t[1]},\\ ${t[2]})`} />
          </p>
          <p>
            <Tex src={`${t[0]}^2+${t[1]}^2=${t[0] * t[0]}+${t[1] * t[1]}=${t[2] * t[2]}=${t[2]}^2`} />
          </p>
          <p className={primitive ? 'okline' : 'small muted'}>
            {primitive
              ? tc(L('m and n have no common factor and one of them is even, so this triple is primitive.', 'm dan n tidak punya faktor persekutuan dan salah satunya genap, sehingga tripel ini primitif.'))
              : tc(L(`Not primitive: it is ${isPrimitive(t) ? 'still primitive' : `${gcd(gcd(t[0], t[1]), t[2])} times a smaller triple`} (m and n should be coprime with opposite parity for a primitive one).`, `Tidak primitif: ${isPrimitive(t) ? 'ternyata tetap primitif' : `${gcd(gcd(t[0], t[1]), t[2])} kali tripel yang lebih kecil`} (m dan n harus saling prima dengan paritas berbeda agar primitif).`))}
          </p>
        </>
      )
    }
  }

  return (
    <Frame name="pythtriples">
      <div className="chips">
        {([['hyp', L('by hypotenuse', 'menurut hipotenusa')], ['leg', L('by a leg', 'menurut sisi tegak')], ['euclid', L("Euclid's formula", 'rumus Euclid')]] as [TripleMode, Loc][]).map(([id, label]) => (
          <button key={id} className={`chip ${mode === id ? 'on' : ''}`} onClick={() => setMode(id)} aria-pressed={mode === id}>
            {tc(label)}
          </button>
        ))}
      </div>
      <div className="inrow">
        {mode === 'hyp' && (
          <>
            <Field label={tc(L('c up to', 'c sampai'))} value={limit} set={setLimit} />
            <label className="lbl">
              <input type="checkbox" checked={prim} onChange={(e) => setPrim(e.target.checked)} /> {tc(L('primitive only', 'hanya primitif'))}
            </label>
          </>
        )}
        {mode === 'leg' && (
          <>
            <Field label={tc(L('leg a', 'sisi tegak a'))} value={leg} set={setLeg} width="7em" />
            {['3', '12', '20', '24', '1', '60'].map((v) => (
              <button key={v} className="chip ghost" onClick={() => setLeg(v)}>
                {v}
              </button>
            ))}
          </>
        )}
        {mode === 'euclid' && (
          <>
            <Field label="m" value={mm} set={setMm} width="4em" />
            <Field label="n" value={nn} set={setNn} width="4em" />
            {[['2', '1'], ['3', '2'], ['4', '1'], ['5', '2'], ['4', '2']].map(([p, q]) => (
              <button
                key={p + q}
                className="chip ghost"
                onClick={() => {
                  setMm(p)
                  setNn(q)
                }}
              >
                {p}, {q}
              </button>
            ))}
          </>
        )}
      </div>
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}

/* -------------------------------------------------- the tree of primitive triples */

export function PythagoreanTree() {
  const { tc } = useI18n()
  const [path, setPath] = useState<Triple[]>([[3n, 4n, 5n]])
  const cur = path[path.length - 1]
  const kids = children(cur)
  const names = ['A', 'B', 'C']
  const up = parent(cur)

  return (
    <Frame name="pythtree">
      <p className="small muted">{tc(L('Every primitive triple appears exactly once. Start at (3, 4, 5) and choose a branch.', 'Setiap tripel primitif muncul tepat satu kali. Mulai dari (3, 4, 5) dan pilih sebuah cabang.'))}</p>
      <p className="okline">
        {tc(L('Path', 'Jalur'))}: {path.map(tripleText).join(' → ')}
      </p>
      <p>
        <Tex src={`${cur[0]}^2+${cur[1]}^2=${cur[0] * cur[0]}+${cur[1] * cur[1]}=${cur[2] * cur[2]}=${cur[2]}^2`} />
      </p>
      <p className="small">
        {tc(L('Area', 'Luas'))} = {String((cur[0] * cur[1]) / 2n)} · {tc(L('perimeter', 'keliling'))} = {String(cur[0] + cur[1] + cur[2])} · {tc(L('depth', 'kedalaman'))} {path.length - 1}
      </p>
      <div className="chips">
        {kids.map((k, i) => (
          <button key={names[i]} className="chip" onClick={() => setPath((p) => [...p, oddFirst(k)])}>
            {names[i]}: {tripleText(oddFirst(k))}
          </button>
        ))}
      </div>
      <div className="chips">
        <button className="chip ghost" disabled={path.length === 1} onClick={() => setPath((p) => p.slice(0, -1))}>
          ← {tc(L('back', 'kembali'))}
        </button>
        <button className="chip ghost" disabled={path.length === 1} onClick={() => setPath([[3n, 4n, 5n]])}>
          {tc(L('restart', 'mulai ulang'))}
        </button>
        {up && <span className="small muted">{tc(L('parent', 'induk'))}: {tripleText(up)}</span>}
      </div>
    </Frame>
  )
}
