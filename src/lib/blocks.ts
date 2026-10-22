/** The block language of the Code Blocks course, and the interpreter that runs it.
 *
 *  A learner builds a program out of blocks and a little robot carries it out
 *  on a grid. Nothing here knows about React: a program is plain data, a run
 *  is a list of frames, and a level is checked by running the program on every
 *  world it names. That is what lets the course's own build step run each
 *  level's model solution and prove the level can be solved.
 */

/* ---------------------------------------------------------------- program */

/** A number a block asks for: written in, or read from a variable. */
export type Num = number | { var: string }

/** What a `say` block says. */
export type Val =
  | { k: 'num'; v: number }
  | { k: 'text'; v: string }
  | { k: 'var'; name: string }
  /** How many stars the robot is holding. */
  | { k: 'stars' }

export type Cond =
  | { t: 'front-clear' }
  | { t: 'front-blocked' }
  | { t: 'left-clear' }
  | { t: 'right-clear' }
  | { t: 'on-star' }
  | { t: 'on-goal' }
  | { t: 'not-on-goal' }
  | { t: 'cmp'; name: string; op: '<' | '>' | '=' | '<=' | '>=' | '!='; value: Num }

export type Block =
  | { t: 'move'; n: Num }
  | { t: 'turn'; dir: 'left' | 'right' }
  | { t: 'collect' }
  | { t: 'say'; what: Val }
  | { t: 'repeat'; n: Num; body: Block[] }
  | { t: 'if'; cond: Cond; then: Block[]; otherwise?: Block[] }
  | { t: 'while'; cond: Cond; body: Block[] }
  | { t: 'set'; name: string; value: Num }
  | { t: 'change'; name: string; by: Num }
  | { t: 'call'; name: string }

export type BlockKind = Block['t']
export type CondKind = Cond['t']

/** The blocks that make up a program: the main stack, and any blocks the
 *  learner has defined themselves. */
export interface Program {
  main: Block[]
  defs?: Record<string, Block[]>
}

export const emptyProgram = (): Program => ({ main: [] })

/* ------------------------------------------------------------------ level */

/** A challenge. The grid is text, one string per row:
 *
 *    `#` wall   `.` floor   `*` star   `G` goal
 *    `^ > v <` the robot, standing on floor and facing that way
 */
export interface BlocksLevel {
  /** Every world the program has to work in. One for a fixed route; several
   *  when the point is a program that does not depend on the exact map. */
  worlds: string[][]
  /** Which blocks the palette offers. */
  allowed: BlockKind[]
  /** Which conditions an `if` or `while` may test. Defaults to the sensors. */
  conds?: CondKind[]
  /** Variable names the learner may use. */
  vars?: string[]
  /** Names of blocks the learner is expected to define (and then `call`). */
  defs?: string[]
  /** The program may use at most this many blocks. */
  maxBlocks?: number
  /** The program must use each of these kinds somewhere. */
  mustUse?: BlockKind[]
  /** What the robot has to achieve. */
  goal: {
    /** End standing on the goal. */
    reach?: boolean
    /** Pick up every star. */
    collectAll?: boolean
    /** Say exactly these things, in this order. */
    say?: string[]
  }
}

/* ------------------------------------------------------------------ world */

export type Dir = 0 | 1 | 2 | 3 // up, right, down, left
const DX = [0, 1, 0, -1]
const DY = [-1, 0, 1, 0]

export interface World {
  width: number
  height: number
  /** `#` for a wall, anything else is open floor. */
  cells: string[][]
  stars: [number, number][]
  goal: [number, number] | null
  start: { x: number; y: number; d: Dir }
}

const FACING: Record<string, Dir> = { '^': 0, '>': 1, v: 2, '<': 3 }

export function parseWorld(rows: string[]): World {
  const height = rows.length
  const width = Math.max(...rows.map((r) => r.length))
  const cells: string[][] = []
  const stars: [number, number][] = []
  let goal: [number, number] | null = null
  let start = { x: 0, y: 0, d: 1 as Dir }
  rows.forEach((row, y) => {
    const line: string[] = []
    for (let x = 0; x < width; x++) {
      const ch = row[x] ?? '#'
      if (ch in FACING) {
        start = { x, y, d: FACING[ch] }
        line.push('.')
      } else if (ch === '*') {
        stars.push([x, y])
        line.push('.')
      } else if (ch === 'G') {
        goal = [x, y]
        line.push('.')
      } else line.push(ch === '#' ? '#' : '.')
    }
    cells.push(line)
  })
  return { width, height, cells, stars, goal, start }
}

/* -------------------------------------------------------------------- run */

export interface Frame {
  x: number
  y: number
  d: Dir
  /** Stars still lying on the grid, as `x,y`. */
  stars: string[]
  /** What has been said so far. */
  said: string[]
  /** The block being carried out, as a path into the program. */
  at: string
  bump?: boolean
}

export type Fault =
  | { code: 'wall' }
  | { code: 'budget' }
  | { code: 'depth' }
  | { code: 'no-block'; name: string }
  | { code: 'no-var'; name: string }
  | { code: 'bad-count'; n: number }

export interface Run {
  frames: Frame[]
  fault: Fault | null
  final: Frame
  held: number
  totalStars: number
  onGoal: boolean
}

const MAX_FRAMES = 4000
const MAX_STEPS = 20000
const MAX_DEPTH = 40
const MAX_COUNT = 200

class Stop extends Error {
  constructor(public fault: Fault) {
    super(fault.code)
  }
}

const key = (x: number, y: number) => `${x},${y}`

export function runProgram(rows: string[], program: Program): Run {
  const w = parseWorld(rows)
  let { x, y, d } = w.start
  const stars = new Set(w.stars.map(([a, b]) => key(a, b)))
  const total = stars.size
  let held = 0
  const said: string[] = []
  const vars: Record<string, number> = {}
  const frames: Frame[] = []
  let steps = 0
  let at = ''

  const snap = (bump = false): Frame => ({ x, y, d, stars: [...stars], said: [...said], at, bump })
  frames.push(snap())

  const tick = () => {
    if (++steps > MAX_STEPS) throw new Stop({ code: 'budget' })
  }
  const emit = (bump = false) => {
    if (frames.length >= MAX_FRAMES) throw new Stop({ code: 'budget' })
    frames.push(snap(bump))
  }
  const open = (cx: number, cy: number) => cx >= 0 && cy >= 0 && cx < w.width && cy < w.height && w.cells[cy][cx] !== '#'

  const num = (n: Num): number => {
    if (typeof n === 'number') return n
    if (!(n.var in vars)) throw new Stop({ code: 'no-var', name: n.var })
    return vars[n.var]
  }

  const test = (c: Cond): boolean => {
    switch (c.t) {
      case 'front-clear':
        return open(x + DX[d], y + DY[d])
      case 'front-blocked':
        return !open(x + DX[d], y + DY[d])
      case 'left-clear': {
        const l = ((d + 3) % 4) as Dir
        return open(x + DX[l], y + DY[l])
      }
      case 'right-clear': {
        const r = ((d + 1) % 4) as Dir
        return open(x + DX[r], y + DY[r])
      }
      case 'on-star':
        return stars.has(key(x, y))
      case 'on-goal':
        return w.goal !== null && w.goal[0] === x && w.goal[1] === y
      case 'not-on-goal':
        return !(w.goal !== null && w.goal[0] === x && w.goal[1] === y)
      case 'cmp': {
        if (!(c.name in vars)) throw new Stop({ code: 'no-var', name: c.name })
        const a = vars[c.name]
        const b = num(c.value)
        switch (c.op) {
          case '<':
            return a < b
          case '>':
            return a > b
          case '=':
            return a === b
          case '<=':
            return a <= b
          case '>=':
            return a >= b
          default:
            return a !== b
        }
      }
    }
  }

  const count = (n: Num): number => {
    const v = num(n)
    if (!Number.isInteger(v) || v < 0 || v > MAX_COUNT) throw new Stop({ code: 'bad-count', n: v })
    return v
  }

  const exec = (list: Block[], path: string, depth: number) => {
    list.forEach((b, i) => {
      const here = `${path}.${i}`
      at = here
      tick()
      switch (b.t) {
        case 'move': {
          const n = count(b.n)
          for (let s = 0; s < n; s++) {
            at = here
            const nx = x + DX[d]
            const ny = y + DY[d]
            if (!open(nx, ny)) {
              emit(true)
              throw new Stop({ code: 'wall' })
            }
            x = nx
            y = ny
            tick()
            emit()
          }
          break
        }
        case 'turn':
          d = ((d + (b.dir === 'right' ? 1 : 3)) % 4) as Dir
          emit()
          break
        case 'collect':
          if (stars.delete(key(x, y))) held++
          emit()
          break
        case 'say': {
          const v = b.what
          said.push(v.k === 'num' ? String(v.v) : v.k === 'text' ? v.v : v.k === 'stars' ? String(held) : String(num({ var: v.name })))
          emit()
          break
        }
        case 'repeat': {
          const n = count(b.n)
          for (let r = 0; r < n; r++) exec(b.body, `${here}.body`, depth)
          break
        }
        case 'if':
          if (test(b.cond)) exec(b.then, `${here}.then`, depth)
          else if (b.otherwise) exec(b.otherwise, `${here}.otherwise`, depth)
          break
        case 'while':
          while (test(b.cond)) {
            tick()
            exec(b.body, `${here}.body`, depth)
          }
          break
        case 'set':
          vars[b.name] = num(b.value)
          break
        case 'change':
          if (!(b.name in vars)) throw new Stop({ code: 'no-var', name: b.name })
          vars[b.name] += num(b.by)
          break
        case 'call': {
          const def = program.defs?.[b.name]
          if (!def) throw new Stop({ code: 'no-block', name: b.name })
          if (depth >= MAX_DEPTH) throw new Stop({ code: 'depth' })
          exec(def, `defs.${b.name}`, depth + 1)
          break
        }
      }
    })
  }

  let fault: Fault | null = null
  try {
    exec(program.main, 'main', 0)
  } catch (e) {
    if (e instanceof Stop) fault = e.fault
    else throw e
  }
  const final = frames[frames.length - 1]
  return {
    frames,
    fault,
    final,
    held,
    totalStars: total,
    onGoal: w.goal !== null && w.goal[0] === x && w.goal[1] === y,
  }
}

/* ----------------------------------------------------------------- checks */

export type Issue =
  | { code: 'fault'; fault: Fault }
  | { code: 'not-at-goal' }
  | { code: 'stars-left'; n: number }
  | { code: 'said-wrong'; said: string[]; want: string[] }

export interface WorldReport {
  ok: boolean
  issues: Issue[]
  run: Run
}

export type ProgramIssue = { code: 'too-many'; used: number; max: number } | { code: 'must-use'; kind: BlockKind }

export interface LevelReport {
  ok: boolean
  worlds: WorldReport[]
  program: ProgramIssue[]
}

const bodies = (b: Block): Block[][] => {
  switch (b.t) {
    case 'repeat':
    case 'while':
      return [b.body]
    case 'if':
      return b.otherwise ? [b.then, b.otherwise] : [b.then]
    default:
      return []
  }
}

/** Every block of the program, the main stack and the defined blocks alike. */
export function allBlocks(program: Program): Block[] {
  const out: Block[] = []
  const walk = (list: Block[]) => {
    for (const b of list) {
      out.push(b)
      for (const inner of bodies(b)) walk(inner)
    }
  }
  walk(program.main)
  for (const body of Object.values(program.defs ?? {})) walk(body)
  return out
}

export const countBlocks = (program: Program): number => allBlocks(program).length

export function checkLevel(level: BlocksLevel, program: Program): LevelReport {
  const worlds = level.worlds.map((rows): WorldReport => {
    const run = runProgram(rows, program)
    const issues: Issue[] = []
    if (run.fault) issues.push({ code: 'fault', fault: run.fault })
    else {
      if (level.goal.reach && !run.onGoal) issues.push({ code: 'not-at-goal' })
      if (level.goal.collectAll && run.final.stars.length > 0) issues.push({ code: 'stars-left', n: run.final.stars.length })
      if (level.goal.say) {
        const want = level.goal.say
        const said = run.final.said
        if (said.length !== want.length || said.some((s, i) => s !== want[i])) issues.push({ code: 'said-wrong', said, want })
      }
    }
    return { ok: issues.length === 0, issues, run }
  })
  const issues: ProgramIssue[] = []
  const used = countBlocks(program)
  if (level.maxBlocks !== undefined && used > level.maxBlocks) issues.push({ code: 'too-many', used, max: level.maxBlocks })
  const kinds = new Set(allBlocks(program).map((b) => b.t))
  for (const k of level.mustUse ?? []) if (!kinds.has(k)) issues.push({ code: 'must-use', kind: k })
  return { ok: worlds.every((w) => w.ok) && issues.length === 0, worlds, program: issues }
}

/** The conditions an `if` or `while` can test in a level. */
export const levelConds = (level: BlocksLevel): CondKind[] =>
  level.conds ?? ['front-clear', 'front-blocked', 'left-clear', 'right-clear', 'on-star', 'on-goal', 'not-on-goal']
