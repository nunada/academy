/** The TypeScript standard library, as text.
 *
 *  The compiler needs these to know what `Array`, `Promise` or `Object.entries`
 *  are; without them every ordinary program is a wall of "Cannot find name".
 *
 *  Only the ES chain is here. `lib.dom.d.ts` is 1.9 MB on its own and this course
 *  never touches the DOM, so a four-line declaration of `console` stands in for it.
 *
 *  The list is the transitive closure of the references in lib.es2020.d.ts, and
 *  this module is reached only from the lazy path in ts.ts — never from the main
 *  bundle. Generated: to change the target, recompute the closure rather than
 *  guessing which files it pulls in.
 */

import lib_decorators from 'typescript/lib/lib.decorators.d.ts?raw'
import lib_decorators_legacy from 'typescript/lib/lib.decorators.legacy.d.ts?raw'
import lib_es2015 from 'typescript/lib/lib.es2015.d.ts?raw'
import lib_es2015_collection from 'typescript/lib/lib.es2015.collection.d.ts?raw'
import lib_es2015_core from 'typescript/lib/lib.es2015.core.d.ts?raw'
import lib_es2015_generator from 'typescript/lib/lib.es2015.generator.d.ts?raw'
import lib_es2015_iterable from 'typescript/lib/lib.es2015.iterable.d.ts?raw'
import lib_es2015_promise from 'typescript/lib/lib.es2015.promise.d.ts?raw'
import lib_es2015_proxy from 'typescript/lib/lib.es2015.proxy.d.ts?raw'
import lib_es2015_reflect from 'typescript/lib/lib.es2015.reflect.d.ts?raw'
import lib_es2015_symbol from 'typescript/lib/lib.es2015.symbol.d.ts?raw'
import lib_es2015_symbol_wellknown from 'typescript/lib/lib.es2015.symbol.wellknown.d.ts?raw'
import lib_es2016 from 'typescript/lib/lib.es2016.d.ts?raw'
import lib_es2016_array_include from 'typescript/lib/lib.es2016.array.include.d.ts?raw'
import lib_es2016_intl from 'typescript/lib/lib.es2016.intl.d.ts?raw'
import lib_es2017 from 'typescript/lib/lib.es2017.d.ts?raw'
import lib_es2017_arraybuffer from 'typescript/lib/lib.es2017.arraybuffer.d.ts?raw'
import lib_es2017_date from 'typescript/lib/lib.es2017.date.d.ts?raw'
import lib_es2017_intl from 'typescript/lib/lib.es2017.intl.d.ts?raw'
import lib_es2017_object from 'typescript/lib/lib.es2017.object.d.ts?raw'
import lib_es2017_sharedmemory from 'typescript/lib/lib.es2017.sharedmemory.d.ts?raw'
import lib_es2017_string from 'typescript/lib/lib.es2017.string.d.ts?raw'
import lib_es2017_typedarrays from 'typescript/lib/lib.es2017.typedarrays.d.ts?raw'
import lib_es2018 from 'typescript/lib/lib.es2018.d.ts?raw'
import lib_es2018_asyncgenerator from 'typescript/lib/lib.es2018.asyncgenerator.d.ts?raw'
import lib_es2018_asynciterable from 'typescript/lib/lib.es2018.asynciterable.d.ts?raw'
import lib_es2018_intl from 'typescript/lib/lib.es2018.intl.d.ts?raw'
import lib_es2018_promise from 'typescript/lib/lib.es2018.promise.d.ts?raw'
import lib_es2018_regexp from 'typescript/lib/lib.es2018.regexp.d.ts?raw'
import lib_es2019 from 'typescript/lib/lib.es2019.d.ts?raw'
import lib_es2019_array from 'typescript/lib/lib.es2019.array.d.ts?raw'
import lib_es2019_intl from 'typescript/lib/lib.es2019.intl.d.ts?raw'
import lib_es2019_object from 'typescript/lib/lib.es2019.object.d.ts?raw'
import lib_es2019_string from 'typescript/lib/lib.es2019.string.d.ts?raw'
import lib_es2019_symbol from 'typescript/lib/lib.es2019.symbol.d.ts?raw'
import lib_es2020 from 'typescript/lib/lib.es2020.d.ts?raw'
import lib_es2020_bigint from 'typescript/lib/lib.es2020.bigint.d.ts?raw'
import lib_es2020_date from 'typescript/lib/lib.es2020.date.d.ts?raw'
import lib_es2020_intl from 'typescript/lib/lib.es2020.intl.d.ts?raw'
import lib_es2020_number from 'typescript/lib/lib.es2020.number.d.ts?raw'
import lib_es2020_promise from 'typescript/lib/lib.es2020.promise.d.ts?raw'
import lib_es2020_sharedmemory from 'typescript/lib/lib.es2020.sharedmemory.d.ts?raw'
import lib_es2020_string from 'typescript/lib/lib.es2020.string.d.ts?raw'
import lib_es2020_symbol_wellknown from 'typescript/lib/lib.es2020.symbol.wellknown.d.ts?raw'
import lib_es5 from 'typescript/lib/lib.es5.d.ts?raw'

/** Stands in for lib.dom.d.ts, which is otherwise the only reason to load it. */
const CONSOLE = `declare const console: {
  log(...data: unknown[]): void
  error(...data: unknown[]): void
  warn(...data: unknown[]): void
  info(...data: unknown[]): void
}
`

export const LIBS: Record<string, string> = {
  'lib.decorators.d.ts': lib_decorators,
  'lib.decorators.legacy.d.ts': lib_decorators_legacy,
  'lib.es2015.d.ts': lib_es2015,
  'lib.es2015.collection.d.ts': lib_es2015_collection,
  'lib.es2015.core.d.ts': lib_es2015_core,
  'lib.es2015.generator.d.ts': lib_es2015_generator,
  'lib.es2015.iterable.d.ts': lib_es2015_iterable,
  'lib.es2015.promise.d.ts': lib_es2015_promise,
  'lib.es2015.proxy.d.ts': lib_es2015_proxy,
  'lib.es2015.reflect.d.ts': lib_es2015_reflect,
  'lib.es2015.symbol.d.ts': lib_es2015_symbol,
  'lib.es2015.symbol.wellknown.d.ts': lib_es2015_symbol_wellknown,
  'lib.es2016.d.ts': lib_es2016,
  'lib.es2016.array.include.d.ts': lib_es2016_array_include,
  'lib.es2016.intl.d.ts': lib_es2016_intl,
  'lib.es2017.d.ts': lib_es2017,
  'lib.es2017.arraybuffer.d.ts': lib_es2017_arraybuffer,
  'lib.es2017.date.d.ts': lib_es2017_date,
  'lib.es2017.intl.d.ts': lib_es2017_intl,
  'lib.es2017.object.d.ts': lib_es2017_object,
  'lib.es2017.sharedmemory.d.ts': lib_es2017_sharedmemory,
  'lib.es2017.string.d.ts': lib_es2017_string,
  'lib.es2017.typedarrays.d.ts': lib_es2017_typedarrays,
  'lib.es2018.d.ts': lib_es2018,
  'lib.es2018.asyncgenerator.d.ts': lib_es2018_asyncgenerator,
  'lib.es2018.asynciterable.d.ts': lib_es2018_asynciterable,
  'lib.es2018.intl.d.ts': lib_es2018_intl,
  'lib.es2018.promise.d.ts': lib_es2018_promise,
  'lib.es2018.regexp.d.ts': lib_es2018_regexp,
  'lib.es2019.d.ts': lib_es2019,
  'lib.es2019.array.d.ts': lib_es2019_array,
  'lib.es2019.intl.d.ts': lib_es2019_intl,
  'lib.es2019.object.d.ts': lib_es2019_object,
  'lib.es2019.string.d.ts': lib_es2019_string,
  'lib.es2019.symbol.d.ts': lib_es2019_symbol,
  'lib.es2020.d.ts': lib_es2020,
  'lib.es2020.bigint.d.ts': lib_es2020_bigint,
  'lib.es2020.date.d.ts': lib_es2020_date,
  'lib.es2020.intl.d.ts': lib_es2020_intl,
  'lib.es2020.number.d.ts': lib_es2020_number,
  'lib.es2020.promise.d.ts': lib_es2020_promise,
  'lib.es2020.sharedmemory.d.ts': lib_es2020_sharedmemory,
  'lib.es2020.string.d.ts': lib_es2020_string,
  'lib.es2020.symbol.wellknown.d.ts': lib_es2020_symbol_wellknown,
  'lib.es5.d.ts': lib_es5,
  'lib.console.d.ts': CONSOLE,
}
