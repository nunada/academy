import { useEffect, useMemo, useRef, useState } from 'react'
import { useI18n } from '../../i18n'
import type { Loc } from '../../content/types'
import { Rich } from '../ui'
import { BlocksBoard, ProgramView } from '../BlocksBoard'
import { checkLevel, countBlocks, emptyProgram, type LevelReport, type Program } from '../../lib/blocks'
import { LEVELS, TIERS, levelById, type MazeLevel } from '../../content/codemaze'
import { TIER_NEED, openTiers, parseProgress, parOf, record, starsFor, totalStars, type Progress } from '../../lib/codemaze'

const L = (en: string, id: string): Loc => ({ en, id })

const KEY = 'nunada.codemaze.v1'
const IDS = LEVELS.map((l) => l.id)

function load(): Progress {
  try {
    return parseProgress(localStorage.getItem(KEY), IDS)
  } catch {
    return {}
  }
}
function save(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    /* a private window: the game works the same without a saved record */
  }
}

const starText = (n: number) => '★'.repeat(n) + '☆'.repeat(3 - n)
const fresh = (): Program => emptyProgram()

export default function CodeMazeGame() {
  const { tc } = useI18n()
  const [progress, setProgress] = useState<Progress>(load)
  const open = useMemo(() => openTiers(TIERS, progress), [progress])
  // start on the first level that is not solved yet
  const [levelId, setLevelId] = useState<string>(() => {
    const p = load()
    const o = openTiers(TIERS, p)
    return LEVELS.find((l) => o[l.tier - 1] && !p[l.id])?.id ?? LEVELS[0].id
  })
  const level = levelById(levelId) as MazeLevel
  const [program, setProgram] = useState<Program>(fresh)
  const [report, setReport] = useState<LevelReport | null>(null)
  const [hints, setHints] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const [peeked, setPeeked] = useState(false)
  const [result, setResult] = useState<{ stars: number; used: number } | null>(null)
  const drafts = useRef<Record<string, Program>>({})

  const tierIndex = level.tier - 1
  const par = parOf(level.solution)
  const used = countBlocks(program)
  const index = LEVELS.findIndex((l) => l.id === levelId)
  const next = LEVELS[index + 1]
  const nextOpen = next ? open[next.tier - 1] : false

  // a record made elsewhere (another tab) is picked up when this tab is looked at again
  useEffect(() => {
    const onFocus = () => setProgress(load())
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  function go(id: string) {
    drafts.current[levelId] = program
    setLevelId(id)
    setProgram(drafts.current[id] ?? fresh())
    setReport(null)
    setHints(0)
    setShowSolution(false)
    setPeeked(false)
    setResult(null)
  }

  function check() {
    const r = checkLevel(level.level, program)
    setReport(r)
    if (!r.ok) {
      setResult(null)
      return
    }
    const earned = peeked ? 1 : starsFor(used, par)
    setResult({ stars: earned, used })
    const merged = record(progress, level.id, { stars: earned, blocks: used })
    if (merged !== progress) {
      setProgress(merged)
      save(merged)
    }
  }

  function again() {
    setProgram(fresh())
    setReport(null)
    setResult(null)
  }

  const tierDone = (n: number) => TIERS[n].levels.filter((id) => progress[id]).length
  const justOpened = result && next && next.tier !== level.tier && nextOpen && tierDone(tierIndex) === TIER_NEED

  return (
    <section className="codemaze" aria-label={tc(L('Code Maze', 'Labirin Kode'))}>
      <div className="cmbar">
        <span className="pill brand">
          ★ {totalStars(progress)}/{LEVELS.length * 3}
        </span>
        <span className="small muted">
          {Object.keys(progress).length}/{LEVELS.length} {tc(L('levels solved', 'level selesai'))}
        </span>
      </div>

      <div className="cmtiers" role="tablist" aria-label={tc(L('Tiers', 'Tingkat'))}>
        {TIERS.map((t, i) => (
          <button
            key={t.n}
            role="tab"
            aria-selected={tierIndex === i}
            className={`cmtier${tierIndex === i ? ' on' : ''}${open[i] ? '' : ' locked'}`}
            disabled={!open[i]}
            onClick={() => go(TIERS[i].levels[0])}
          >
            <span className="cmtier-n">{open[i] ? t.n : '🔒'}</span>
            <span className="cmtier-t">{tc(t.title)}</span>
            <span className="cmtier-c">
              {tierDone(i)}/{t.levels.length}
            </span>
          </button>
        ))}
      </div>
      <p className="small muted cmabout">
        <Rich text={tc(TIERS[tierIndex].about)} />
        {TIERS.some((_, i) => !open[i]) && (
          <>
            {' '}
            {tc(L(`Solve ${TIER_NEED} levels of a tier to open the next.`, `Selesaikan ${TIER_NEED} level di satu tingkat untuk membuka tingkat berikutnya.`))}
          </>
        )}
      </p>

      <div className="cmlevels" role="group" aria-label={tc(L('Levels', 'Level'))}>
        {TIERS[tierIndex].levels.map((id, i) => {
          const l = levelById(id) as MazeLevel
          const d = progress[id]
          return (
            <button key={id} className={`cmlevel${id === levelId ? ' on' : ''}${d ? ' done' : ''}`} aria-current={id === levelId ? 'true' : undefined} onClick={() => go(id)}>
              <b>
                {level.tier}.{i + 1}
              </b>
              <span>{tc(l.title)}</span>
              <span className="cmstars" aria-label={d ? tc(L(`${d.stars} of 3 stars`, `${d.stars} dari 3 bintang`)) : tc(L('not solved yet', 'belum selesai'))}>
                {starText(d?.stars ?? 0)}
              </span>
            </button>
          )
        })}
      </div>

      <div className="card cmcard">
        <h3>
          {level.tier}.{TIERS[tierIndex].levels.indexOf(levelId) + 1} · {tc(level.title)}
        </h3>
        <p>
          <Rich text={tc(level.brief)} />
        </p>
        <p className="small muted">
          {tc(L('Blocks used', 'Blok terpakai'))}: <b>{used}</b>
          {level.level.maxBlocks !== undefined && (
            <>
              {' '}
              / {tc(L('at most', 'paling banyak'))} {level.level.maxBlocks}
            </>
          )}
          {' · '}
          {tc(L('three stars at', 'tiga bintang pada'))} {par} {tc(L('or fewer', 'atau kurang'))}
        </p>

        <BlocksBoard
          key={levelId}
          level={level.level}
          program={program}
          disabled={false}
          report={report}
          speeds
          onChange={(p) => {
            setProgram(p)
            setReport(null)
            setResult(null)
          }}
        />

        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn sm" onClick={check}>
            {tc(L('Check', 'Periksa'))}
          </button>
          <button className="btn ghost sm" onClick={again} disabled={used === 0}>
            {tc(L('Clear', 'Kosongkan'))}
          </button>
          {hints < level.hints.length && (
            <button className="btn ghost sm" onClick={() => setHints((n) => n + 1)}>
              💡 {tc(L('Hint', 'Petunjuk'))} ({hints}/{level.hints.length})
            </button>
          )}
          {hints >= level.hints.length && !showSolution && (
            <button
              className="btn ghost sm"
              onClick={() => {
                setShowSolution(true)
                setPeeked(true)
              }}
            >
              {tc(L('Show a solution', 'Tampilkan solusi'))}
            </button>
          )}
        </div>

        {level.hints.slice(0, hints).map((h, i) => (
          <div className="banner" key={i} style={{ marginTop: 10, marginBottom: 0 }}>
            <span>💡</span>
            <span>
              <Rich text={tc(h)} />
            </span>
          </div>
        ))}

        {showSolution && (
          <div style={{ marginTop: 12 }}>
            <div className="io-label">{tc(L('A solution', 'Sebuah solusi'))}</div>
            <ProgramView program={level.solution} level={level.level} />
            <p className="small muted">{tc(L('A level solved after looking at the solution earns one star.', 'Level yang diselesaikan setelah melihat solusi mendapat satu bintang.'))}</p>
            <button
              className="btn ghost sm"
              onClick={() => {
                setProgram(JSON.parse(JSON.stringify(level.solution)) as Program)
                setReport(null)
                setResult(null)
              }}
            >
              ↧ {tc(L('Copy into the workspace', 'Salin ke ruang kerja'))}
            </button>
          </div>
        )}

        <div role="status" aria-live="polite">
          {result && (
            <div className="verdict ok cmresult" style={{ marginTop: 12 }}>
              <b>
                {starText(result.stars)} {tc(L('Solved!', 'Selesai!'))}
              </b>
              <div className="small">
                {tc(L(`${result.used} blocks used; the model solution uses ${par}.`, `${result.used} blok dipakai; solusi contoh memakai ${par}.`))}{' '}
                {result.stars < 3 && !peeked && tc(L('Fewer blocks earn more stars: can you do it in fewer?', 'Blok yang lebih sedikit memberi lebih banyak bintang: bisakah kurang dari ini?'))}
                {peeked && tc(L('You looked at a solution, so this level counts for one star.', 'Kamu melihat solusi, jadi level ini dihitung satu bintang.'))}
              </div>
              {justOpened && (
                <div className="small">
                  <b>{tc(L(`Tier ${next!.tier} is open.`, `Tingkat ${next!.tier} terbuka.`))}</b>
                </div>
              )}
              {next && nextOpen && (
                <button className="btn sm" style={{ marginTop: 8 }} onClick={() => go(next.id)}>
                  {tc(L('Next level', 'Level berikutnya'))} →
                </button>
              )}
              {next && !nextOpen && (
                <div className="small">{tc(L(`Solve ${TIER_NEED} levels of this tier to open the next.`, `Selesaikan ${TIER_NEED} level di tingkat ini untuk membuka tingkat berikutnya.`))}</div>
              )}
              {!next && <div className="small">{tc(L('That was the last level. Well done!', 'Itu level terakhir. Hebat!'))}</div>}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
