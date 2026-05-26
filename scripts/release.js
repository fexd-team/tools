const { execSync } = require('child_process')
const {
  getRegistry,
  getRemoteVersion,
  compareVersions,
} = require('./versionHelpers')

const registry = getRegistry()
const isForce = process.argv.includes('--force')
const tag =
  process.argv.find((a) => a.startsWith('--tag='))?.split('=')[1] || 'latest'
const tagFlag = ` --tag=${tag}`
const pkg = require('../package.json')

function run(cmd, label) {
  console.log(`\n> ${label || cmd}`)
  execSync(cmd, { stdio: 'inherit', cwd: process.cwd() })
}

console.log(`\n📦 ${pkg.name}@${pkg.version}`)
console.log(`   registry: ${registry}`)
console.log(`   tag: ${tag}`)

if (!isForce) {
  const remote = getRemoteVersion(pkg.name, registry)
  if (remote) {
    console.log(`   remote:  ${remote}`)
    if (compareVersions(pkg.version, remote) <= 0) {
      console.error(
        `\n❌ 本地版本 ${pkg.version} <= 线上版本 ${remote}，请先升版本`
      )
      process.exit(1)
    }
  } else {
    console.log('   remote:  (首次发布)')
  }
}

run('npm run build', 'build')
run(
  `npm publish --access=public${tagFlag} --registry=${registry}`,
  `publish → ${registry}`
)

console.log(`\n✅ ${pkg.name}@${pkg.version} 发布完成\n`)
