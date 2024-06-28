// export default {
//   cjs: {
//     type: 'babel',
//     minify: true,
//     lazy: true,
//   },
//   esm: {
//     type: 'babel',
//   },
//   umd: {
//     name: 'FexdTools',
//     sourcemap: true,
//   },
//   runtimeHelpers: true,
// }

import { defineConfig } from 'father'

export default defineConfig({
  cjs: {
    output: 'lib',
    platform: 'browser',
    transformer: 'babel',
  },
  esm: {
    output: 'es',
    platform: 'browser',
    transformer: 'babel',
  },
})
