/** Who may call which RPC, checked against the live project.
 *
 *  Supabase grants EXECUTE on new functions to `anon` by default, so the schema
 *  revokes it and grants to `authenticated` instead — except for
 *  `username_available`, which sign-up has to call before an account exists.
 *
 *  Two things can quietly undo that: adding a function and forgetting the
 *  revoke, or re-running an existing one. Postgres says CREATE OR REPLACE
 *  FUNCTION leaves permissions alone, and that held when it was tested, but a
 *  claim protecting every learner's standing is worth re-checking rather than
 *  trusting.
 *
 *  Both directions are checked on purpose. A test that only ever expects
 *  "refused" would pass just as happily against a project where every function
 *  had been dropped, so the one function that is *meant* to be open has to
 *  answer too — and that doubles as a check that sign-up still works.
 *
 *  Read-only: nothing is written and no account is created. Needs a configured
 *  .env; skips cleanly without one.
 *
 *  Run: npm run check:grants
 */

import fs from 'node:fs'
import process from 'node:process'

const env = Object.fromEntries(
  fs
    .readFileSync('.env', 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => {
      const at = l.indexOf('=')
      return [l.slice(0, at).trim(), l.slice(at + 1).trim()]
    }),
)

const URL_ = env.VITE_SUPABASE_URL
const KEY = env.VITE_SUPABASE_ANON_KEY
if (!URL_ || !KEY) {
  // Local mode is a legitimate way to run this app; there is nothing to check.
  console.log('no Supabase keys in .env — nothing to check')
  process.exit(0)
}
console.log('project:', URL_.replace(/https:\/\/([^.]{6}).*/, 'https://$1…'))

/** `anon` must be refused everything here. */
const TERTUTUP = {
  leaderboard_weekly: { p_limit: 3 },
  leaderboard_alltime: { p_limit: 3 },
  leaderboard_trophies: { p_limit: 3 },
  resolve_hearts: {},
  spend_heart: {},
  // These three read every learner's rows. They check the caller's role too,
  // but the grant is the outer wall and it is the one that can be lost by
  // re-running a function without its revoke.
  is_teacher: {},
  teacher_roster: {},
  teacher_course_progress: {},
}

/** ...and allowed this one, or nobody can sign up. */
const TERBUKA = {
  username_available: { p_username: 'zzz_probe_zzz' },
}

async function panggil(rpc, args) {
  const res = await fetch(`${URL_}/rest/v1/rpc/${rpc}`, {
    method: 'POST',
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  })
  const teks = await res.text()
  let pesan = teks.slice(0, 90)
  try {
    pesan = JSON.parse(teks).message ?? pesan
  } catch {
    /* keep the raw text */
  }
  return { ok: res.ok, status: res.status, pesan, teks }
}

const masalah = []

for (const [rpc, args] of Object.entries(TERTUTUP)) {
  const r = await panggil(rpc, args)
  if (r.ok) {
    masalah.push(`${rpc} is callable without a login`)
    console.log(`  ${rpc}: OPEN TO ANON (${r.status})`)
  } else if (r.status === 404) {
    // A function that does not exist is refused just as firmly as one that is
    // locked, and the difference matters: it means schema.sql has grown since
    // this project last ran it. Reading that as "safe" is how a new RPC ships
    // with nobody having checked its grants.
    masalah.push(`${rpc} is not on the project — re-run supabase/schema.sql`)
    console.log(`  ${rpc}: MISSING (404) — ${r.pesan}`)
  } else {
    console.log(`  ${rpc}: refused (${r.status}) — ${r.pesan}`)
  }
}

for (const [rpc, args] of Object.entries(TERBUKA)) {
  const r = await panggil(rpc, args)
  if (r.ok) {
    console.log(`  ${rpc}: open to anon, as it must be — returned ${r.teks.slice(0, 20)}`)
  } else {
    masalah.push(`${rpc} is refused to anon — sign-up cannot check a name`)
    console.log(`  ${rpc}: REFUSED (${r.status}) — ${r.pesan}`)
  }
}

if (masalah.length) {
  console.error('\ngrant check failed:\n' + masalah.map((m) => '  · ' + m).join('\n'))
  console.error(
    masalah.some((m) => m.includes('not on the project'))
      ? '\nrun the whole of supabase/schema.sql in the SQL editor — it is safe to re-run'
      : '\nre-run the grant block at the end of supabase/schema.sql'
  )
  process.exit(1)
}

console.log('\ngrant check ok — the boards need a login, and sign-up can still check a name')
