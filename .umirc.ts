import { version } from './package.json'

export default {
  mode: 'site',
  title: `Fexd Tools`,
  logo: process.env.NODE_ENV === 'production' ? '/tools/logo.png' : '/logo.png',
  outputPath: 'docs',
  publicPath: process.env.NODE_ENV === 'production' ? '/tools/' : '/',
  history: { type: 'hash' },
  resolve: {
    includes: ['documents', 'src'],
  },
  navs: [null, { title: `v${version}` }],
}
