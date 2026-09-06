/** A copy of JSCPP's own `iostream` header (node_modules/JSCPP/lib/includes/
 *  iostream.js), used only for the interactive "Run" path in ./cpp.ts.
 *
 *  Real C++ leaves `cin >> x` silently unsuccessful on end-of-input — no
 *  exception, just a failbit the program is expected to check — and JSCPP
 *  faithfully reproduces that: every one of its read paths funnels through a
 *  `_read` helper whose regexes (`[0-9]*`, `\S*`, …) all admit an empty
 *  match, so it never throws when the buffer runs dry. That is exactly
 *  wrong for what this file exists to do: tell `runCppInteractive` (in
 *  ./cpp.ts) the single moment a learner's program is asking for a value
 *  that has not been typed yet, so it can pause there instead of silently
 *  continuing with garbage.
 *
 *  The only change from the original is in `_read`: raise a distinctly
 *  recognisable exception when the buffer is already empty, before the
 *  regex gets a chance to match nothing. `runCppInteractive` re-runs the
 *  whole program from scratch with one more answer every time it sees that
 *  exception — the same "replay" idea used elsewhere, chosen for C++
 *  specifically because JSCPP (unlike Pyodide's `input()`) has no per-call
 *  hook to genuinely pause on, short of patching its interpreter internals.
 *
 *  Passed to `JSCPP.run` as `{ includes: { iostream: { load } } }`, which
 *  JSCPP's own config merge (see node_modules/JSCPP/lib/rt.js) uses in place
 *  of its built-in one — no node_modules edits, so a JSCPP upgrade can only
 *  break this by changing `iostream.js`'s own registered operators, not by
 *  touching the interpreter this deliberately leaves untouched. */

export const NEED_INPUT_MARKER = '__nunada_need_input__'

const _skipSpace = function (s: string): string {
  const r = /^\s*/.exec(s)
  if (r && r.length > 0) {
    return s.substring(r[0].length)
  } else {
    return s
  }
}

const _read = function (rt: any, reg: RegExp, buf: string, type: any): RegExpExecArray {
  if (buf === '') {
    rt.raiseException(NEED_INPUT_MARKER)
  }
  const r = reg.exec(buf)
  if (r == null || r.length === 0) {
    rt.raiseException('input format mismatch ' + rt.makeTypeString(type) + ' with buffer=' + buf)
  } else {
    return r as RegExpExecArray
  }
  // Unreachable — raiseException always throws — but keeps TS satisfied.
  throw new Error(NEED_INPUT_MARKER)
}

export function load(rt: any): void {
  const { stdio } = rt.config
  const cinType = rt.newClass('istream', [])
  const cin = {
    t: cinType,
    v: {
      buf: stdio.drain(),
      istream: stdio,
      members: {},
    },
    left: false,
  }
  rt.scope[0].variables['cin'] = cin
  const pchar = rt.normalPointerType(rt.charTypeLiteral)
  rt.types[rt.getTypeSignature(cinType)] = {
    father: 'object',
    handlers: {
      'o(>>)': {
        default(rt: any, _cin: any, t: any) {
          if (!t.left) {
            rt.raiseException('only left value can be used as storage')
          }
          if (!rt.isPrimitiveType(t.t)) {
            rt.raiseException('>> operator in istream cannot accept ' + rt.makeTypeString(t.t))
          }
          let b = _cin.v.buf
          _cin.v.eofbit = b.length === 0
          let r
          let v
          switch (t.t.name) {
            case 'char':
            case 'signed char':
            case 'unsigned char':
              b = _skipSpace(b)
              r = _read(rt, /^./, b, t.t)
              v = r[0].charCodeAt(0)
              break
            case 'short':
            case 'short int':
            case 'signed short':
            case 'signed short int':
            case 'unsigned short':
            case 'unsigned short int':
            case 'int':
            case 'signed int':
            case 'unsigned':
            case 'unsigned int':
            case 'long':
            case 'long int':
            case 'signed long':
            case 'signed long int':
            case 'unsigned long':
            case 'unsigned long int':
            case 'long long':
            case 'long long int':
            case 'signed long long':
            case 'signed long long int':
            case 'unsigned long long':
            case 'unsigned long long int':
              b = _skipSpace(b)
              r = _read(rt, /^[-+]?(?:([0-9]*)([eE]\+?[0-9]+)?)|0/, b, t.t)
              v = parseInt(r[0], 10)
              break
            case 'float':
            case 'double':
              b = _skipSpace(b)
              r = _read(rt, /^[-+]?(?:[0-9]*\.[0-9]+([eE][-+]?[0-9]+)?)|(?:([1-9][0-9]*)([eE]\+?[0-9]+)?)/, b, t.t)
              v = parseFloat(r[0])
              break
            case 'bool':
              b = _skipSpace(b)
              r = _read(rt, /^(true|false)/, b, t.t)
              v = r[0] === 'true'
              break
            default:
              rt.raiseException('>> operator in istream cannot accept ' + rt.makeTypeString(t.t))
          }
          const len = r![0].length
          _cin.v.failbit = len === 0
          if (!_cin.v.failbit) {
            t.v = rt.val(t.t, v).v
            _cin.v.buf = b.substring(len)
          }
          return _cin
        },
      },
    },
  }
  const _cinString = function (rt: any, _cin: any, t: any) {
    if (!rt.isStringType(t.t)) {
      rt.raiseException('only a pointer to string can be used as storage')
    }
    let b = _cin.v.buf
    _cin.v.eofbit = b.length === 0
    b = _skipSpace(b)
    const r = _read(rt, /^\S*/, b, t.t)[0]
    _cin.v.failbit = r.length === 0
    _cin.v.buf = b.substring(r.length)
    const initialPos = t.v.position
    const tar = t.v.target
    if (tar.length - initialPos <= r.length) {
      rt.raiseException(`target string buffer is ${r.length - (tar.length - initialPos)} too short`)
    }
    for (let i = 0, end = r.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
      tar[i + initialPos] = rt.val(rt.charTypeLiteral, r.charCodeAt(i))
    }
    tar[r.length + initialPos] = rt.val(rt.charTypeLiteral, 0)
    return _cin
  }
  rt.regOperator(_cinString, cin.t, '>>', [pchar], cin.t)
  const _getline = function (rt: any, _cin: any, t: any, limitV: any, delimV: any) {
    let removeDelim
    if (!rt.isStringType(t.t)) {
      rt.raiseException('only a pointer to string can be used as storage')
    }
    const limit = limitV.v
    const delim = delimV != null ? String.fromCharCode(delimV.v) : '\n'
    const b = _cin.v.buf
    _cin.v.eofbit = b.length === 0
    let r = _read(rt, new RegExp(`^[^${delim}]*`), b, t.t)[0]
    if (r.length + 1 > limit) {
      r = r.substring(0, limit - 1)
    }
    if (b.charAt(r.length) === delim.charAt(0)) {
      removeDelim = true
      _cin.v.failbit = false
    } else {
      _cin.v.failbit = r.length === 0
    }
    _cin.v.buf = b.substring(r.length + (removeDelim ? 1 : 0))
    const initialPos = t.v.position
    const tar = t.v.target
    if (tar.length - initialPos <= r.length) {
      rt.raiseException(`target string buffer is ${r.length - (tar.length - initialPos)} too short`)
    }
    for (let i = 0, end = r.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
      tar[i + initialPos] = rt.val(rt.charTypeLiteral, r.charCodeAt(i))
    }
    tar[r.length + initialPos] = rt.val(rt.charTypeLiteral, 0)
    return _cin
  }
  rt.regFunc(_getline, cin.t, 'getline', [pchar, rt.intTypeLiteral, rt.charTypeLiteral], cin.t)
  rt.regFunc(_getline, cin.t, 'getline', [pchar, rt.intTypeLiteral], cin.t)
  // cin.get() is left exactly as JSCPP defines it: EOF is a normal, expected
  // condition for that call specifically (its whole job is to signal EOF via
  // -1), unlike `>>`, so it is not part of what this file changes.
  const _get = function (rt: any, _cin: any) {
    const b = _cin.v.buf
    _cin.v.eofbit = b.length === 0
    if (_cin.v.eofbit) {
      return rt.val(rt.intTypeLiteral, -1)
    } else {
      const r = _read(rt, /^.|[\r\n]/, b, rt.charTypeLiteral)
      _cin.v.buf = b.substring(r.length)
      const v = r[0].charCodeAt(0)
      return rt.val(rt.intTypeLiteral, v)
    }
  }
  rt.regFunc(_get, cin.t, 'get', [], rt.intTypeLiteral)
  const _bool = (rt: any, _cin: any) => rt.val(rt.boolTypeLiteral, !_cin.v.failbit)
  rt.regOperator(_bool, cin.t, 'bool', [], rt.boolTypeLiteral)
  const coutType = rt.newClass('ostream', [])
  const cout = {
    t: coutType,
    v: {
      ostream: stdio,
      members: {},
    },
    left: false,
  }
  rt.scope[0].variables['cout'] = cout
  rt.types[rt.getTypeSignature(cout.t)] = {
    father: 'object',
    handlers: {
      'o(<<)': {
        default(rt: any, _cout: any, t: any) {
          let r
          if (_cout.manipulators != null) {
            t = _cout.manipulators.use(t)
          }
          if (rt.isPrimitiveType(t.t)) {
            if (t.t.name.indexOf('char') >= 0) {
              r = String.fromCharCode(t.v)
            } else if (t.t.name === 'bool') {
              r = t.v ? '1' : '0'
            } else {
              r = t.v.toString()
            }
          } else if (rt.isStringType(t)) {
            r = rt.getStringFromCharArray(t)
          } else {
            rt.raiseException('<< operator in ostream cannot accept ' + rt.makeTypeString(t.t))
          }
          _cout.v.ostream.write(r)
          return _cout
        },
      },
    },
  }
  const endl = rt.val(rt.charTypeLiteral, '\n'.charCodeAt(0))
  rt.scope[0].variables['endl'] = endl
}
