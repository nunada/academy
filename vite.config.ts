import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { defineConfig, type Plugin, type ResolvedConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** Where the app is served from.
 *
 *  `/` locally and on any host that serves it at a domain root. A GitHub Pages
 *  *project* site lives at `https://user.github.io/repo/`, so the build there
 *  sets VITE_BASE to `/repo/` — the deploy workflow fills it in from the
 *  repository name, so there is nothing to keep in step by hand.
 *
 *  The router reads the same value back through `import.meta.env.BASE_URL`
 *  (see src/main.tsx), which is how a link to /learn becomes /repo/learn. */
const base = process.env.VITE_BASE || '/'

/** GitHub Pages has no rewrite rules, so a reload on /course/sql/lesson/x would
 *  be a plain 404 — the file does not exist; the route only means something
 *  once the app is running.
 *
 *  What Pages does have is 404.html: it serves that for any path it cannot
 *  find. Making it a copy of index.html means the app boots, the router reads
 *  the address, and the learner lands where they meant to. The response still
 *  carries a 404 status, which browsers ignore and crawlers do not — fine for
 *  an app you sign in to, worth knowing if that ever changes. */
function githubPagesFallback(): Plugin {
  let resolved: ResolvedConfig

  return {
    name: 'nunada:404-fallback',
    apply: 'build',
    configResolved(config) {
      resolved = config
    },
    closeBundle() {
      const out = path.resolve(resolved.root, resolved.build.outDir)
      const index = path.join(out, 'index.html')
      if (fs.existsSync(index)) fs.copyFileSync(index, path.join(out, '404.html'))
    },
  }
}

export default defineConfig({
  base,
  plugins: [react(), githubPagesFallback()],
  server: { port: 5180 },
})
