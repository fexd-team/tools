export default {
  cjs: {
    type: 'babel',
    minify: true,
    lazy: true,
  },
  esm: {
    type: 'babel',
  },
  umd: {
    name: 'FexdTools',
    sourcemap: true,
  },
  runtimeHelpers: true,
}
