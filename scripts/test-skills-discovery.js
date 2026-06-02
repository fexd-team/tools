const assert = require('assert')
const childProcess = require('child_process')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const projectRoot = path.resolve(__dirname, '..')
const nodeModulesDir = path.join(projectRoot, 'node_modules')
const fixturesRoot = path.join(__dirname, 'fixtures', 'skills-discovery')
const manifest = require('./fixtures/skills-discovery/manifest.json')
const cli = require('../cli/index.js')
const runId = crypto.randomBytes(5).toString('hex')

function resolvePackageName(fixture) {
  return fixture.packageNameTemplate.replace(/__RUN_ID__/g, runId)
}

function packagePath(packageName) {
  if (packageName.charAt(0) !== '@') {
    return path.join(nodeModulesDir, packageName)
  }

  const parts = packageName.split('/')
  return path.join(nodeModulesDir, parts[0], parts[1])
}

function removeSync(target) {
  if (!fs.existsSync(target)) return

  const stat = fs.lstatSync(target)
  if (stat.isDirectory() && !stat.isSymbolicLink()) {
    fs.readdirSync(target).forEach((name) =>
      removeSync(path.join(target, name))
    )
    fs.rmdirSync(target)
  } else {
    fs.unlinkSync(target)
  }
}

function copyDirSync(source, target, replacements) {
  fs.mkdirSync(target, { recursive: true })
  fs.readdirSync(source).forEach((name) => {
    const sourcePath = path.join(source, name)
    const targetPath = path.join(target, name)
    const stat = fs.lstatSync(sourcePath)

    if (stat.isDirectory()) {
      copyDirSync(sourcePath, targetPath, replacements)
      return
    }

    let content = fs.readFileSync(sourcePath, 'utf8')
    Object.keys(replacements).forEach((key) => {
      content = content.split(key).join(replacements[key])
    })
    fs.writeFileSync(targetPath, content)
  })
}

function assertInsideNodeModules(target) {
  const relative = path.relative(nodeModulesDir, path.resolve(target))
  assert(
    relative && relative.indexOf('..') !== 0 && !path.isAbsolute(relative),
    `refuse to remove path outside node_modules: ${target}`
  )
}

function cleanupPackageName(packageName) {
  const root = packagePath(packageName)
  assertInsideNodeModules(root)
  removeSync(root)

  if (packageName.charAt(0) === '@') {
    const scopeDir = path.dirname(root)
    assertInsideNodeModules(scopeDir)
    if (fs.existsSync(scopeDir) && fs.readdirSync(scopeDir).length === 0) {
      fs.rmdirSync(scopeDir)
    }
  }
}

function cleanupStaleFixturePackages() {
  if (!fs.existsSync(nodeModulesDir)) return

  fs.readdirSync(nodeModulesDir).forEach((name) => {
    if (
      name.indexOf('fexd-skill-fixture-') !== 0 &&
      name.indexOf('@fexd-skill-fixture-') !== 0
    ) {
      return
    }

    const target = path.join(nodeModulesDir, name)
    assertInsideNodeModules(target)
    removeSync(target)
  })
}

function writeFixture(fixture) {
  const packageName = resolvePackageName(fixture)
  const source = path.join(fixturesRoot, fixture.source)
  const target = packagePath(packageName)

  assert(fs.existsSync(source), `missing fixture source: ${source}`)
  assertInsideNodeModules(target)
  removeSync(target)
  copyDirSync(source, target, {
    __PACKAGE_NAME__: packageName,
    __RUN_ID__: runId,
  })

  return packageName
}

function flattenValidSkills() {
  const result = []
  manifest.fixtures.forEach((fixture) => {
    ;(fixture.validSkills || []).forEach((skill) => {
      result.push({
        fixture,
        name: skill.name,
        dirName: skill.dirName,
      })
    })
  })
  return result
}

function flattenInvalidNames() {
  const result = []
  manifest.fixtures.forEach((fixture) => {
    ;(fixture.invalidSkillNames || []).forEach((name) => {
      result.push(name)
    })
  })
  return result
}

function flattenInvalidDirs() {
  const result = []
  manifest.fixtures.forEach((fixture) => {
    ;(fixture.invalidSkillDirs || []).forEach((name) => {
      result.push(name)
    })
  })
  return result
}

function unique(list) {
  return list.filter((item, index) => list.indexOf(item) === index)
}

const packageNames = manifest.fixtures.map(resolvePackageName)
const validSkills = flattenValidSkills()
const validNames = validSkills.map((skill) => skill.name)
const expectedUniqueValidNames = unique(validNames)
const invalidNames = flattenInvalidNames()
const invalidDirs = flattenInvalidDirs()

try {
  console.log(
    `[step 1] copy ${manifest.fixtures.length} visible fixture packages (${
      validSkills.length + invalidDirs.length
    } skill dirs) into node_modules with random names`
  )
  fs.mkdirSync(nodeModulesDir, { recursive: true })
  cleanupStaleFixturePackages()
  manifest.fixtures.forEach(writeFixture)

  console.log('[step 2] discover skills through fexd-tools CLI internals')
  const sources = cli.discoverSkillSources({
    cwd: projectRoot,
    workspaceRoot: projectRoot,
  })

  assert(
    sources.some((source) => source.name === 'fexd-tools'),
    'builtin fexd-tools skill should be discovered'
  )

  expectedUniqueValidNames.forEach((skillName) => {
    const source = sources.find((item) => item.name === skillName)
    assert(source, `missing discovered valid skill: ${skillName}`)
    assert.strictEqual(source.targetName, skillName)
  })

  expectedUniqueValidNames.forEach((skillName) => {
    const expectedCount = validNames.filter((name) => name === skillName).length
    const matching = sources.filter((source) => source.name === skillName)
    assert.strictEqual(
      matching.length,
      1,
      `skill should be installed once: ${skillName}`
    )
    assert.strictEqual(
      matching[0].duplicates.length,
      expectedCount - 1,
      `duplicate metadata mismatch: ${skillName}`
    )
  })

  invalidNames.forEach((skillName) => {
    assert(
      !sources.some((source) => source.name === skillName),
      `invalid skill should not be discovered: ${skillName}`
    )
  })

  const output = childProcess.execFileSync(
    process.execPath,
    [
      'cli/index.js',
      'skills',
      'install',
      '--agents',
      'codex',
      '--dry-run',
      '--no-gitignore',
    ],
    {
      cwd: projectRoot,
      encoding: 'utf8',
    }
  )

  expectedUniqueValidNames.forEach((skillName) => {
    assert(
      output.indexOf(`.agents/skills/${skillName}`) >= 0,
      `dry-run output should use frontmatter name: ${skillName}`
    )
  })

  validSkills.forEach((skill) => {
    if (skill.dirName === skill.name) return
    assert(
      output.indexOf(`.agents/skills/${skill.dirName}`) < 0,
      `dry-run output should not use skill directory name: ${skill.dirName}`
    )
  })

  invalidNames.concat(invalidDirs).forEach((skillName) => {
    assert(
      output.indexOf(`.agents/skills/${skillName}`) < 0,
      `dry-run output should not include invalid skill: ${skillName}`
    )
  })

  const filteredSources = cli.discoverSkillSources({
    cwd: projectRoot,
    workspaceRoot: projectRoot,
    configPath: 'scripts/fixtures/skills-discovery/skills.config.cjs',
  })
  const filteredNames = filteredSources.map((source) => source.name).sort()
  assert.deepStrictEqual(
    filteredNames,
    [
      'fixture-duplicate-name',
      'fixture-frontmatter-name',
      'fixture-multi-two',
      'fixture-scoped-frontmatter',
    ].sort(),
    'config include/exclude should filter package and skill sources'
  )

  const cliFilteredOutput = childProcess.execFileSync(
    process.execPath,
    [
      'cli/index.js',
      'skills',
      'install',
      '--agents',
      'codex',
      '--dry-run',
      '--no-gitignore',
      '--include',
      'fixture-quoted-name',
    ],
    {
      cwd: projectRoot,
      encoding: 'utf8',
    }
  )
  assert(
    cliFilteredOutput.indexOf('.agents/skills/fixture-quoted-name') >= 0,
    'CLI --include should support skill name filters'
  )
  assert(
    cliFilteredOutput.indexOf('.agents/skills/fixture-frontmatter-name') < 0,
    'CLI --include should filter out other skills'
  )

  const scopedFixture = manifest.fixtures.find(
    (fixture) => fixture.id === 'valid-scoped-package'
  )
  assert(scopedFixture, 'missing valid-scoped-package fixture')
  const positionalFilteredOutput = childProcess.execFileSync(
    process.execPath,
    [
      'cli/index.js',
      'skills',
      'install',
      `${
        resolvePackageName(scopedFixture).split('/')[0]
      }/*,fixture-quoted-name`,
      '--agents',
      'codex',
      '--dry-run',
      '--no-gitignore',
    ],
    {
      cwd: projectRoot,
      encoding: 'utf8',
    }
  )
  assert(
    positionalFilteredOutput.indexOf(
      '.agents/skills/fixture-scoped-frontmatter'
    ) >= 0,
    'positional include should support scoped package wildcard filters'
  )
  assert(
    positionalFilteredOutput.indexOf('.agents/skills/fixture-quoted-name') >= 0,
    'positional include should support comma-separated skill name filters'
  )
  assert(
    positionalFilteredOutput.indexOf(
      '.agents/skills/fixture-frontmatter-name'
    ) < 0,
    'positional include should filter out other skills'
  )

  const packageJsonConfig = cli.loadSkillsConfig(
    path.join(fixturesRoot, 'package-json-config'),
    {}
  )
  assert.deepStrictEqual(
    packageJsonConfig.include,
    ['fixture-frontmatter-name'],
    'package.json top-level skills-install.include should be supported'
  )
  assert.deepStrictEqual(
    packageJsonConfig.exclude,
    [{ package: '@fexd/pro-components' }],
    'package.json top-level skills-install.exclude should be supported'
  )

  console.log(
    '[ok] visible fixtures cover valid, invalid, duplicate, scoped, and mismatched skills'
  )
} finally {
  packageNames.forEach(cleanupPackageName)
}
