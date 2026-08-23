/** Everything the React course needs to run inside the sandboxed frame.
 *
 *  Why not just point `<script src>` at the files: the frame runs with
 *  `sandbox="allow-scripts"` and no `allow-same-origin`, so it sits on an opaque
 *  origin — and a document on an opaque origin cannot load our subresources.
 *  Measured, not assumed: the same frame loads them fine the moment
 *  `allow-same-origin` is added, which is exactly the permission that would let
 *  a learner's script reach the app's DOM and its Supabase session. Keeping the
 *  sandbox strict is worth more than the convenience.
 *
 *  So React and ReactDOM are inlined into the document as text, and JSX is
 *  transpiled out here in the app rather than by a Babel loaded in every frame.
 *  Babel is 2.3 MB; loading it once, lazily, beats loading it 40 times. */

let runtimeCache: string | null = null

/** React + ReactDOM as `<script>` blocks, ready to inline. Loaded once.
 *
 *  The paths reach into node_modules directly because React 18.3's `exports`
 *  map does not expose `./umd/*`, so the bare specifier will not resolve — the
 *  files are there, the package just will not admit to them. A relative path
 *  sidesteps the exports map and keeps the runtime in lockstep with the React
 *  version in package.json, which a committed copy would not. */
export async function reactRuntime(): Promise<string> {
  if (runtimeCache === null) {
    const [react, reactDom] = await Promise.all([
      import('../../node_modules/react/umd/react.production.min.js?raw'),
      import('../../node_modules/react-dom/umd/react-dom.production.min.js?raw'),
    ])
    runtimeCache = `<script>${react.default}</script>\n<script>${reactDom.default}</script>`
  }
  return runtimeCache
}

export interface Transpiled {
  code?: string
  /** A syntax error, already trimmed to the line the learner can act on. */
  error?: string
}

/** JSX in, plain JavaScript out. Only the JSX transform runs, so the learner's
 *  const, let and arrow functions reach the frame exactly as written — which is
 *  what lets a check name their top-level bindings. */
export async function transpileJsx(source: string): Promise<Transpiled> {
  const Babel = await import('@babel/standalone')
  try {
    const out = Babel.transform(source, { presets: ['react'], sourceType: 'script' })
    return { code: out.code ?? '' }
  } catch (err) {
    const message = String((err as Error).message ?? err)
    // Babel prefixes the pseudo-filename; the learner never saw that name.
    return { error: message.replace(/^unknown( file)?:\s*/i, '') }
  }
}
