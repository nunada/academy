/** The block editor and the robot's grid.
 *
 *  Controlled: the page above owns the program and the verdict, so a lesson
 *  step and a project can both use it and decide for themselves what a wrong
 *  answer costs. What lives here is only what a run needs: the frame being
 *  shown, and which stack new blocks are dropped into.
 *
 *  Blocks are placed by pressing them in the palette, not by dragging: it works
 *  with a keyboard and a thumb alike, and the target stack is always visible.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import type { Loc } from '../content/types'
import {
  levelConds,
  parseWorld,
  runProgram,
  type Block,
  type BlockKind,
  type BlocksLevel,
  type Cond,
  type CondKind,
  type Dir,
  type Frame,
  type Issue,
  type LevelReport,
  type Num,
  type Program,
  type ProgramIssue,
  type Run,
  type Val,
} from '../lib/blocks'

/* ------------------------------------------------------------------ words */

const L = (en: string, id: string): Loc => ({ en, id })

const KIND_LABEL: Record<BlockKind, Loc> = {
  move: L('move forward', 'maju'),
  turn: L('turn', 'belok'),
  collect: L('pick up the star', 'ambil bintang'),
  say: L('say', 'ucapkan'),
  repeat: L('repeat', 'ulangi'),
  if: L('if', 'jika'),
  while: L('while', 'selama'),
  set: L('set', 'atur'),
  change: L('change', 'ubah'),
  call: L('run', 'jalankan'),
}

const COND_LABEL: Record<Exclude<CondKind, 'cmp'>, Loc> = {
  'front-clear': L('the way ahead is clear', 'jalan di depan terbuka'),
  'front-blocked': L('there is a wall ahead', 'ada tembok di depan'),
  'left-clear': L('the way on the left is clear', 'jalan di kiri terbuka'),
  'right-clear': L('the way on the right is clear', 'jalan di kanan terbuka'),
  'on-star': L('standing on a star', 'berdiri di atas bintang'),
  'on-goal': L('standing on the goal', 'berdiri di garis finis'),
  'not-on-goal': L('not on the goal yet', 'belum di garis finis'),
}

/** The colour family of each block, as a CSS custom property set in the stylesheet. */
const FAMILY: Record<BlockKind, string> = {
  move: 'motion',
  turn: 'motion',
  collect: 'motion',
  say: 'look',
  repeat: 'control',
  if: 'control',
  while: 'control',
  set: 'data',
  change: 'data',
  call: 'custom',
}

export const issueText = (i: Issue | ProgramIssue, tc: (l: Loc) => string): string => {
  switch (i.code) {
    case 'fault': {
      const f = i.fault
      switch (f.code) {
        case 'wall':
          return tc(L('The robot bumped into a wall.', 'Robot menabrak tembok.'))
        case 'budget':
          return tc(L('The program ran for too long. Is there a loop that never ends?', 'Program berjalan terlalu lama. Adakah perulangan yang tidak pernah berhenti?'))
        case 'depth':
          return tc(L('A block runs itself again and again without stopping.', 'Sebuah blok menjalankan dirinya sendiri terus-menerus tanpa berhenti.'))
        case 'no-block':
          return tc(L(`The block “${f.name}” has not been built yet.`, `Blok “${f.name}” belum dibuat.`))
        case 'no-var':
          return tc(L(`The variable “${f.name}” has no value yet. Set it first.`, `Variabel “${f.name}” belum bernilai. Atur dulu.`))
        case 'bad-count':
          return tc(L(`A count has to be a whole number from 0 to 200 (it was ${f.n}).`, `Banyaknya harus bilangan bulat dari 0 sampai 200 (tadi ${f.n}).`))
      }
      return ''
    }
    case 'not-at-goal':
      return tc(L('The robot did not stop on the goal.', 'Robot tidak berhenti di garis finis.'))
    case 'stars-left':
      return tc(L(`${i.n} star${i.n === 1 ? ' is' : 's are'} still on the grid.`, `Masih ada ${i.n} bintang di peta.`))
    case 'said-wrong':
      return tc(
        L(
          `The robot said ${i.said.length ? i.said.join(', ') : 'nothing'}, but it should say ${i.want.join(', ')}.`,
          `Robot mengucapkan ${i.said.length ? i.said.join(', ') : 'apa-apa'}, padahal seharusnya ${i.want.join(', ')}.`,
        ),
      )
    case 'too-many':
      return tc(L(`Too many blocks: ${i.used} used, at most ${i.max} allowed.`, `Terlalu banyak blok: dipakai ${i.used}, paling banyak ${i.max}.`))
    case 'must-use':
      return tc(L(`This level needs a “${KIND_LABEL[i.kind].en}” block.`, `Level ini memerlukan blok “${KIND_LABEL[i.kind].id}”.`))
  }
}

/* ------------------------------------------------------------ the program */

type Path = string

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T

/** The list a container path names, inside `program` (mutable: pass a copy). */
function listAt(program: Program, path: Path): Block[] | undefined {
  const parts = path.split('.')
  let list: Block[] | undefined
  let i = 1
  if (parts[0] === 'main') list = program.main
  else if (parts[0] === 'defs') {
    list = program.defs?.[parts[1]]
    i = 2
  } else return undefined
  while (list && i < parts.length) {
    const block = list[Number(parts[i])]
    const slot = parts[i + 1] as 'body' | 'then' | 'otherwise' | undefined
    if (!block || !slot) return undefined
    const next = (block as unknown as Record<string, Block[] | undefined>)[slot]
    list = next
    i += 2
  }
  return list
}

const fresh = (kind: BlockKind, level: BlocksLevel, def?: string): Block => {
  const v = level.vars?.[0] ?? 'n'
  switch (kind) {
    case 'move':
      return { t: 'move', n: 1 }
    case 'turn':
      return { t: 'turn', dir: 'right' }
    case 'collect':
      return { t: 'collect' }
    case 'say':
      return { t: 'say', what: level.vars?.length ? { k: 'var', name: v } : { k: 'text', v: 'hi' } }
    case 'repeat':
      return { t: 'repeat', n: 2, body: [] }
    case 'if':
      return { t: 'if', cond: { t: levelConds(level)[0] } as Cond, then: [] }
    case 'while':
      return { t: 'while', cond: { t: levelConds(level)[0] } as Cond, body: [] }
    case 'set':
      return { t: 'set', name: v, value: 0 }
    case 'change':
      return { t: 'change', name: v, by: 1 }
    case 'call':
      return { t: 'call', name: def ?? level.defs?.[0] ?? '' }
  }
}

const condFresh = (kind: CondKind, level: BlocksLevel): Cond =>
  kind === 'cmp' ? { t: 'cmp', name: level.vars?.[0] ?? 'n', op: '<', value: 3 } : ({ t: kind } as Cond)

/* ------------------------------------------------------------- small inputs */

function NumEdit({ value, vars, onChange, disabled }: { value: Num; vars: string[]; onChange: (n: Num) => void; disabled: boolean }) {
  const { tc } = useI18n()
  const isVar = typeof value !== 'number'
  return (
    <span className="bk-field">
      {vars.length > 0 && (
        <select
          className="bk-input"
          aria-label={tc(L('number or variable', 'bilangan atau variabel'))}
          value={isVar ? (value as { var: string }).var : '#'}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value === '#' ? 1 : { var: e.target.value })}
        >
          <option value="#">#</option>
          {vars.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      )}
      {!isVar && (
        <input
          className="bk-input bk-num"
          type="number"
          min={0}
          max={99}
          value={value as number}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value === '' ? 0 : Math.max(0, Math.min(99, Math.floor(Number(e.target.value)))))}
        />
      )}
    </span>
  )
}

function CondEdit({ cond, level, onChange, disabled }: { cond: Cond; level: BlocksLevel; onChange: (c: Cond) => void; disabled: boolean }) {
  const { tc } = useI18n()
  const kinds = levelConds(level)
  const vars = level.vars ?? []
  return (
    <span className="bk-field">
      <select
        className="bk-input"
        aria-label={tc(L('condition', 'syarat'))}
        value={cond.t}
        disabled={disabled}
        onChange={(e) => onChange(condFresh(e.target.value as CondKind, level))}
      >
        {kinds.map((k) => (
          <option key={k} value={k}>
            {k === 'cmp' ? tc(L('compare a variable', 'bandingkan variabel')) : tc(COND_LABEL[k])}
          </option>
        ))}
      </select>
      {cond.t === 'cmp' && (
        <>
          <select className="bk-input" aria-label="variable" value={cond.name} disabled={disabled} onChange={(e) => onChange({ ...cond, name: e.target.value })}>
            {vars.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <select
            className="bk-input"
            aria-label="comparison"
            value={cond.op}
            disabled={disabled}
            onChange={(e) => onChange({ ...cond, op: e.target.value as typeof cond.op })}
          >
            {['<', '>', '=', '<=', '>=', '!='].map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <NumEdit value={cond.value} vars={vars.filter((v) => v !== cond.name)} disabled={disabled} onChange={(n) => onChange({ ...cond, value: n })} />
        </>
      )}
    </span>
  )
}

function ValEdit({ val, level, onChange, disabled }: { val: Val; level: BlocksLevel; onChange: (v: Val) => void; disabled: boolean }) {
  const { tc } = useI18n()
  const vars = level.vars ?? []
  const mode = val.k === 'var' ? `var:${val.name}` : val.k
  return (
    <span className="bk-field">
      <select
        className="bk-input"
        aria-label={tc(L('what to say', 'yang diucapkan'))}
        value={mode}
        disabled={disabled}
        onChange={(e) => {
          const m = e.target.value
          if (m === 'text') onChange({ k: 'text', v: 'hi' })
          else if (m === 'num') onChange({ k: 'num', v: 1 })
          else if (m === 'stars') onChange({ k: 'stars' })
          else onChange({ k: 'var', name: m.slice(4) })
        }}
      >
        <option value="text">{tc(L('a word', 'sebuah kata'))}</option>
        <option value="num">{tc(L('a number', 'sebuah bilangan'))}</option>
        {level.allowed.includes('collect') && <option value="stars">{tc(L('stars I hold', 'bintang yang kupegang'))}</option>}
        {vars.map((v) => (
          <option key={v} value={`var:${v}`}>
            {tc(L('value of', 'nilai'))} {v}
          </option>
        ))}
      </select>
      {val.k === 'text' && (
        <input className="bk-input bk-text" value={val.v} maxLength={20} disabled={disabled} onChange={(e) => onChange({ k: 'text', v: e.target.value })} />
      )}
      {val.k === 'num' && (
        <input className="bk-input bk-num" type="number" value={val.v} disabled={disabled} onChange={(e) => onChange({ k: 'num', v: Number(e.target.value) || 0 })} />
      )}
    </span>
  )
}

/* ------------------------------------------------------------ the workspace */

interface EditCtx {
  level: BlocksLevel
  program: Program
  disabled: boolean
  cursor: Path
  active: string | null
  setCursor: (p: Path) => void
  commit: (next: Program) => void
}

function Stack({ ctx, path, label }: { ctx: EditCtx; path: Path; label?: string }) {
  const { tc } = useI18n()
  const list = listAt(ctx.program, path) ?? []
  const here = ctx.cursor === path && !ctx.disabled
  return (
    <div className={`bk-stack${here ? ' here' : ''}`}>
      {label && <div className="bk-stack-label">{label}</div>}
      {list.map((b, i) => (
        <Row key={`${path}.${i}`} ctx={ctx} path={path} index={i} block={b} count={list.length} />
      ))}
      {!ctx.disabled && (
        <button className={`bk-slot${here ? ' on' : ''}`} onClick={() => ctx.setCursor(path)} aria-pressed={here}>
          {here ? tc(L('▸ new blocks go here', '▸ blok baru masuk ke sini')) : tc(L('＋ add blocks here', '＋ tambah blok di sini'))}
        </button>
      )}
    </div>
  )
}

function Row({ ctx, path, index, block, count }: { ctx: EditCtx; path: Path; index: number; block: Block; count: number }) {
  const { tc } = useI18n()
  const id = `${path}.${index}`
  const vars = ctx.level.vars ?? []
  const defs = ctx.level.defs ?? []

  /** Apply `fn` to the list this row sits in, on a copy of the program. */
  const edit = (fn: (list: Block[]) => void) => {
    const next = clone(ctx.program)
    const list = listAt(next, path)
    if (list) fn(list)
    ctx.commit(next)
  }
  const patch = (b: Block) => edit((l) => void (l[index] = b))
  const d = ctx.disabled

  const head = (
    <span className="bk-head">
      <b>{tc(KIND_LABEL[block.t])}</b>
      {block.t === 'move' && (
        <>
          <NumEdit value={block.n} vars={vars} disabled={d} onChange={(n) => patch({ ...block, n })} />
          <span>{tc(L('steps', 'langkah'))}</span>
        </>
      )}
      {block.t === 'turn' && (
        <select className="bk-input" value={block.dir} disabled={d} onChange={(e) => patch({ ...block, dir: e.target.value as 'left' | 'right' })}>
          <option value="left">{tc(L('left', 'kiri'))}</option>
          <option value="right">{tc(L('right', 'kanan'))}</option>
        </select>
      )}
      {block.t === 'say' && <ValEdit val={block.what} level={ctx.level} disabled={d} onChange={(what) => patch({ ...block, what })} />}
      {block.t === 'repeat' && (
        <>
          <NumEdit value={block.n} vars={vars} disabled={d} onChange={(n) => patch({ ...block, n })} />
          <span>{tc(L('times', 'kali'))}</span>
        </>
      )}
      {(block.t === 'if' || block.t === 'while') && <CondEdit cond={block.cond} level={ctx.level} disabled={d} onChange={(cond) => patch({ ...block, cond })} />}
      {block.t === 'set' && (
        <>
          <select className="bk-input" value={block.name} disabled={d} onChange={(e) => patch({ ...block, name: e.target.value })}>
            {vars.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
          <span>{tc(L('to', 'menjadi'))}</span>
          <NumEdit value={block.value} vars={vars.filter((v) => v !== block.name)} disabled={d} onChange={(value) => patch({ ...block, value })} />
        </>
      )}
      {block.t === 'change' && (
        <>
          <select className="bk-input" value={block.name} disabled={d} onChange={(e) => patch({ ...block, name: e.target.value })}>
            {vars.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
          <span>{tc(L('by', 'sebesar'))}</span>
          <NumEdit value={block.by} vars={vars.filter((v) => v !== block.name)} disabled={d} onChange={(by) => patch({ ...block, by })} />
        </>
      )}
      {block.t === 'call' && (
        <select className="bk-input" value={block.name} disabled={d} onChange={(e) => patch({ ...block, name: e.target.value })}>
          {defs.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      )}
    </span>
  )

  return (
    <div className={`bk-block ${FAMILY[block.t]}${ctx.active === id ? ' active' : ''}`}>
      <div className="bk-line">
        {head}
        {!d && (
          <span className="bk-tools">
            <button className="bk-tool" aria-label={tc(L('move up', 'naikkan'))} disabled={index === 0} onClick={() => edit((l) => void l.splice(index - 1, 2, l[index], l[index - 1]))}>
              ↑
            </button>
            <button className="bk-tool" aria-label={tc(L('move down', 'turunkan'))} disabled={index === count - 1} onClick={() => edit((l) => void l.splice(index, 2, l[index + 1], l[index]))}>
              ↓
            </button>
            <button className="bk-tool" aria-label={tc(L('remove', 'hapus'))} onClick={() => edit((l) => void l.splice(index, 1))}>
              ✕
            </button>
          </span>
        )}
      </div>
      {(block.t === 'repeat' || block.t === 'while') && <Stack ctx={ctx} path={`${id}.body`} />}
      {block.t === 'if' && (
        <>
          <Stack ctx={ctx} path={`${id}.then`} label={tc(L('then', 'maka'))} />
          {block.otherwise ? (
            <Stack ctx={ctx} path={`${id}.otherwise`} label={tc(L('otherwise', 'jika tidak'))} />
          ) : (
            !d && (
              <button className="bk-slot" onClick={() => patch({ ...block, otherwise: [] })}>
                {tc(L('＋ add “otherwise”', '＋ tambah “jika tidak”'))}
              </button>
            )
          )}
        </>
      )}
    </div>
  )
}

/** A program, read-only — for the model solution. */
export function ProgramView({ program, level }: { program: Program; level: BlocksLevel }) {
  const ctx: EditCtx = { level, program, disabled: true, cursor: 'main', active: null, setCursor: () => {}, commit: () => {} }
  return (
    <div className="bk-work">
      <Stack ctx={ctx} path="main" />
      {Object.keys(program.defs ?? {}).map((name) => (
        <Stack key={name} ctx={ctx} path={`defs.${name}`} label={`${name}`} />
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------- the grid */

const CELL = 38

function starPath(cx: number, cy: number, r: number): string {
  const pts: string[] = []
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    const rad = i % 2 === 0 ? r : r * 0.45
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`)
  }
  return pts.join(' ')
}

function Grid({ rows, frame, label }: { rows: string[]; frame: Frame | null; label: string }) {
  const w = useMemo(() => parseWorld(rows), [rows])
  const f = frame ?? { x: w.start.x, y: w.start.y, d: w.start.d as Dir, stars: w.stars.map(([a, b]) => `${a},${b}`), said: [], at: '' }
  const W = w.width * CELL
  const H = w.height * CELL
  const cx = f.x * CELL + CELL / 2
  const cy = f.y * CELL + CELL / 2
  const bump = frame?.bump === true
  return (
    <svg className="bk-grid" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} style={{ maxWidth: Math.min(W, 420) }}>
      {w.cells.map((line, y) =>
        line.map((c, x) => (
          <rect key={`${x},${y}`} x={x * CELL} y={y * CELL} width={CELL} height={CELL} className={c === '#' ? 'bk-wall' : 'bk-floor'} />
        )),
      )}
      {w.goal && (
        <g>
          <rect x={w.goal[0] * CELL + 5} y={w.goal[1] * CELL + 5} width={CELL - 10} height={CELL - 10} className="bk-goal" />
          <path d={`M${w.goal[0] * CELL + 5} ${w.goal[1] * CELL + CELL / 2} h${CELL - 10} M${w.goal[0] * CELL + CELL / 2} ${w.goal[1] * CELL + 5} v${CELL - 10}`} className="bk-goal-line" />
        </g>
      )}
      {f.stars.map((s) => {
        const [sx, sy] = s.split(',').map(Number)
        return <polygon key={s} points={starPath(sx * CELL + CELL / 2, sy * CELL + CELL / 2, 12)} className="bk-star" />
      })}
      <g transform={`translate(${cx} ${cy}) rotate(${f.d * 90})`} className={bump ? 'bk-bot bump' : 'bk-bot'}>
        <polygon points="0,-14 11,11 0,6 -11,11" />
        <circle cx="0" cy="-2" r="3" className="bk-eye" />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------- board */

export function BlocksBoard({
  level,
  program,
  onChange,
  disabled,
  report,
}: {
  level: BlocksLevel
  program: Program
  onChange: (p: Program) => void
  disabled: boolean
  report: LevelReport | null
}) {
  const { tc } = useI18n()
  const [cursor, setCursor] = useState<Path>('main')
  const [world, setWorld] = useState(0)
  const [run, setRun] = useState<Run | null>(null)
  const [frame, setFrame] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timer = useRef<number | null>(null)

  // A cursor into a stack that no longer exists falls back to the main stack.
  const safeCursor = listAt(program, cursor) ? cursor : 'main'

  const stop = () => {
    if (timer.current !== null) window.clearInterval(timer.current)
    timer.current = null
    setPlaying(false)
  }
  useEffect(() => stop, [])
  // Editing the program makes the picture of the last run out of date.
  useEffect(() => {
    stop()
    setRun(null)
    setFrame(0)
  }, [program, world])

  function play() {
    stop()
    const r = runProgram(level.worlds[world], program)
    setRun(r)
    setFrame(0)
    setPlaying(true)
    let i = 0
    timer.current = window.setInterval(() => {
      i++
      if (i >= r.frames.length) {
        stop()
        return
      }
      setFrame(i)
    }, 320)
  }

  function reset() {
    stop()
    setRun(null)
    setFrame(0)
  }

  const commit = (next: Program) => onChange(next)

  function addBlock(kind: BlockKind, def?: string) {
    const next = clone(program)
    const list = listAt(next, safeCursor)
    if (!list) return
    const b = fresh(kind, level, def)
    list.push(b)
    commit(next)
    // A container opens ready to be filled.
    if (kind === 'repeat' || kind === 'while') setCursor(`${safeCursor}.${list.length - 1}.body`)
    else if (kind === 'if') setCursor(`${safeCursor}.${list.length - 1}.then`)
  }

  const f = run ? run.frames[Math.min(frame, run.frames.length - 1)] : null
  const ended = run !== null && !playing && frame >= run.frames.length - 1
  const ctx: EditCtx = { level, program, disabled, cursor: safeCursor, active: playing || run ? (f?.at ?? null) : null, setCursor, commit }
  const palette = level.allowed.filter((k) => (k === 'call' ? (level.defs?.length ?? 0) > 0 : true))
  const defNames = level.defs ?? []

  return (
    <div className="bk">
      <div className="split">
        <div>
          {!disabled && (
            <div className="bk-palette" role="group" aria-label={tc(L('Blocks', 'Blok'))}>
              {palette.map((k) => (
                <button key={k} className={`bk-pal ${FAMILY[k]}`} onClick={() => addBlock(k)}>
                  {tc(KIND_LABEL[k])}
                </button>
              ))}
            </div>
          )}
          <div className="io-label">{tc(L('Your program', 'Programmu'))}</div>
          <div className="bk-work">
            <Stack ctx={ctx} path="main" />
            {defNames.map((name) => (
              <div key={name} className="bk-def">
                <div className="bk-def-head">
                  <span className="pill brand">{tc(L('my block', 'blokku'))}</span> <b>{name}</b>
                  <span className="muted small"> — {tc(L('build it here, then run it from the main program', 'susun di sini, lalu jalankan dari program utama'))}</span>
                </div>
                <Stack ctx={ctx} path={`defs.${name}`} />
              </div>
            ))}
          </div>
        </div>

        <div>
          {level.worlds.length > 1 && (
            <div className="chips" role="tablist" aria-label={tc(L('Maps', 'Peta'))}>
              {level.worlds.map((_, i) => (
                <button key={i} role="tab" aria-selected={world === i} className={`chip${world === i ? ' on' : ''}`} onClick={() => setWorld(i)}>
                  {tc(L('Map', 'Peta'))} {i + 1}
                  {report && (report.worlds[i]?.ok ? ' ✓' : ' ✗')}
                </button>
              ))}
            </div>
          )}
          <Grid rows={level.worlds[world]} frame={f} label={tc(L('The robot’s map', 'Peta robot'))} />
          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn soft sm" onClick={play} disabled={playing}>
              ▶ {tc(L('Run', 'Jalankan'))}
            </button>
            <button className="btn ghost sm" onClick={reset} disabled={!run && !playing}>
              ↺ {tc(L('Reset', 'Ulang'))}
            </button>
            {run && <span className="small muted">{Math.min(frame, run.frames.length - 1)}/{run.frames.length - 1}</span>}
          </div>
          {f && f.said.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div className="io-label">{tc(L('The robot says', 'Robot berkata'))}</div>
              <div className="bk-said">{f.said.join('  ')}</div>
            </div>
          )}
          {ended && run?.fault && <p className="small" style={{ color: 'var(--bad)', marginTop: 8 }}>{issueText({ code: 'fault', fault: run.fault }, tc)}</p>}
        </div>
      </div>

      {report && (
        <div className={report.ok ? 'verdict ok' : 'verdict no'} style={{ marginTop: 12 }}>
          <b>{report.ok ? tc(L('Every map works.', 'Semua peta berhasil.')) : tc(L('Not quite yet.', 'Belum tepat.'))}</b>
          {report.program.map((p, i) => (
            <div key={`p${i}`} className="small">{issueText(p, tc)}</div>
          ))}
          {report.worlds.map((w, i) =>
            w.issues.map((iss, j) => (
              <div key={`${i}.${j}`} className="small">
                {report.worlds.length > 1 ? `${tc(L('Map', 'Peta'))} ${i + 1}: ` : ''}
                {issueText(iss, tc)}
              </div>
            )),
          )}
        </div>
      )}
    </div>
  )
}
