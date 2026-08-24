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
 *  transpiled out here in the app rather than by a transpiler loaded into every
 *  frame — once, lazily, instead of forty times.
 *
 *  That transpiler is sucrase rather than Babel. Babel was the obvious first
 *  choice and it worked, but @babel/standalone is the whole toolchain — 684 KB
 *  over the wire — to perform one transform. sucrase does the same JSX
 *  transform in 46 KB, produces the same `React.createElement` calls, leaves
 *  every top-level binding exactly where it was (which is what lets a check
 *  name them), and decodes JSX entities identically. Checked case by case
 *  against Babel's output before the swap: spreads, entities, boolean
 *  attributes, fragments and nesting all come out equivalent.
 *
 *  Two things Babel gave for free are bought back below: a code frame on a
 *  syntax error, built from the line and column sucrase reports; and validation
 *  of the whole file, since sucrase parses only as far as the JSX transform
 *  needs and would let a plain JavaScript mistake through. */

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
  /** A syntax error, with the offending line under it. */
  error?: string
}

/** sucrase reports `(line:column)` at the end of its message. Turn that into
 *  the line itself with a caret under the spot — the thing a learner actually
 *  reads. Falls back to the bare message when there is no position. */
function withFrame(message: string, source: string): string {
  const at = /\((\d+):(\d+)\)\s*$/.exec(message)
  if (!at) return message

  const line = Number(at[1])
  const column = Number(at[2])
  const text = source.split('\n')[line - 1]
  if (text === undefined) return message

  const gutter = `${line} | `
  return [message, gutter + text, ' '.repeat(gutter.length + column) + '^'].join('\n')
}

/** JSX in, plain JavaScript out. Only the JSX transform runs, so the learner's
 *  const, let and arrow functions reach the frame exactly as written — which is
 *  what lets a check name their top-level bindings. */
export async function transpileJsx(source: string): Promise<Transpiled> {
  const { transform } = await import('sucrase')
  try {
    // `production` drops the development-only source annotations; only the JSX
    // transform runs, so const, let and arrow functions reach the frame exactly
    // as written, on the lines they were written on.
    const out = transform(source, { transforms: ['jsx'], production: true })

    // sucrase parses only as far as the JSX transform needs, so a plain
    // JavaScript syntax error further down would sail through and surface as a
    // check that mysteriously found nothing. Babel validated the whole file;
    // this buys that back for nothing. `new Function` compiles without running.
    new Function(out.code)

    return { code: out.code }
  } catch (err) {
    const message = String((err as Error).message ?? err)
    return { error: withFrame(message, source) }
  }
}
