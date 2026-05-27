import { version } from './package.json'

export default {
  mode: 'site',
  title: `Fexd Tools`,
  logo: process.env.NODE_ENV === 'production' ? '/tools/logo.png' : '/logo.png',
  outputPath: 'docs',
  publicPath: process.env.NODE_ENV === 'production' ? '/tools/' : '/',
  base: process.env.NODE_ENV === 'production' ? '/tools/' : '/',
  history: { type: 'browser' },
  exportStatic: {},
  resolve: {
    includes: ['documents', 'src'],
    excludes: ['src/tests'],
  },
  navs: [{ title: '文档', path: '/文档' }, { title: `v${version}` }],
}
