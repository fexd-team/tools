#!/usr/bin/env node

const fs = require('fs')
const os = require('os')
const path = require('path')

const PACKAGE_ROOT = path.join(__dirname, '..')
const SKILLS_DIR = path.join(PACKAGE_ROOT, 'skills', 'fexd-tools')
const REFS_DIR = path.join(SKILLS_DIR, 'references')
const SKILL_NAME = 'fexd-tools'
const COMMON_AGENTS = ['cursor', 'codex', 'claude-code', 'opencode']

const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
}

function c(color, text) {
  return `${COLORS[color]}${text}${COLORS.reset}`
}

function readMarkdown(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8')
  } catch {
    return null
  }
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch {
    return null
  }
}

function normalizeSlash(filePath) {
  return filePath.replace(/\\/g, '/')
}

function isDirectoryLike(filePath) {
  try {
    return fs.statSync(filePath).isDirectory()
  } catch {
    return false
  }
}

function getRealPath(filePath) {
  try {
    return fs.realpathSync(filePath)
  } catch {
    return path.resolve(filePath)
  }
}

function getHomeDir() {
  return os.homedir() || process.env.USERPROFILE || process.env.HOME || ''
}

function getAgents() {
  const home = getHomeDir()
  const codexHome = process.env.CODEX_HOME || path.join(home, '.codex')
  const claudeHome = process.env.CLAUDE_CONFIG_DIR || path.join(home, '.claude')

  return {
    cursor: {
      name: 'cursor',
      displayName: 'Cursor',
      projectSkillsDirs: ['.cursor/skills'],
      globalSkillsDir: path.join(home, '.cursor', 'skills'),
    },
    codex: {
      name: 'codex',
      displayName: 'Codex',
      projectSkillsDirs: ['.agents/skills'],
      globalSkillsDir: path.join(codexHome, 'skills'),
    },
    'claude-code': {
      name: 'claude-code',
      displayName: 'Claude Code',
      projectSkillsDirs: ['.claude/skills'],
      globalSkillsDir: path.join(claudeHome, 'skills'),
    },
    opencode: {
      name: 'opencode',
      displayName: 'OpenCode',
      projectSkillsDirs: ['.agents/skills'],
      globalSkillsDir: path.join(home, '.agents', 'skills'),
    },
  }
}

function parseOptions(args) {
  const options = {
    agents: COMMON_AGENTS.slice(),
    scope: 'project',
    cwd: process.cwd(),
    force: false,
    copy: false,
    dryRun: false,
    gitignore: true,
    config: true,
    configPath: null,
    include: null,
    exclude: null,
  }
  const positionalIncludes = []

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    const next = args[i + 1]

    if (arg === '--agents' && next) {
      options.agents = next
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
      i++
    } else if (arg.indexOf('--agents=') === 0) {
      options.agents = arg
        .slice('--agents='.length)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    } else if (arg === '--scope' && next) {
      options.scope = next
      i++
    } else if (arg.indexOf('--scope=') === 0) {
      options.scope = arg.slice('--scope='.length)
    } else if (arg === '--cwd' && next) {
      options.cwd = next
      i++
    } else if (arg.indexOf('--cwd=') === 0) {
      options.cwd = arg.slice('--cwd='.length)
    } else if (arg === '--force') {
      options.force = true
    } else if (arg === '--copy') {
      options.copy = true
    } else if (arg === '--dry-run') {
      options.dryRun = true
    } else if (arg === '--no-gitignore') {
      options.gitignore = false
    } else if (arg === '--gitignore') {
      options.gitignore = true
    } else if (arg === '--config' && next) {
      options.configPath = next
      i++
    } else if (arg.indexOf('--config=') === 0) {
      options.configPath = arg.slice('--config='.length)
    } else if (arg === '--no-config') {
      options.config = false
    } else if (arg === '--include' && next) {
      options.include = parseFilterArg(next)
      i++
    } else if (arg.indexOf('--include=') === 0) {
      options.include = parseFilterArg(arg.slice('--include='.length))
    } else if (arg === '--exclude' && next) {
      options.exclude = parseFilterArg(next)
      i++
    } else if (arg.indexOf('--exclude=') === 0) {
      options.exclude = parseFilterArg(arg.slice('--exclude='.length))
    } else if (arg.charAt(0) === '-') {
      throw new Error(`未知参数：${arg}`)
    } else {
      positionalIncludes.push.apply(positionalIncludes, parseFilterArg(arg))
    }
  }

  if (positionalIncludes.length) {
    options.include = (options.include || []).concat(positionalIncludes)
  }

  if (!options.agents.length || options.agents.indexOf('common') >= 0) {
    options.agents = COMMON_AGENTS.slice()
  }

  if (['project', 'global', 'both'].indexOf(options.scope) < 0) {
    throw new Error(
      `不支持的 scope：${options.scope}。可选值：project, global, both`
    )
  }

  return options
}

function parseFilterArg(value) {
  return String(value || '')
    .split(',')
    .map((item) => parseFilterToken(item.trim()))
    .filter(Boolean)
}

function parseFilterToken(token) {
  if (!token) return null

  const separatorIndex = token.indexOf(':')
  if (separatorIndex < 0) return token

  const packagePattern = token.slice(0, separatorIndex).trim()
  const skillName = token.slice(separatorIndex + 1).trim()
  if (!packagePattern || !skillName) return token

  return {
    package: packagePattern,
    skills: [skillName],
  }
}

function findWorkspaceRoot(cwd) {
  let current = path.resolve(cwd)
  let nearestPackageRoot = null

  while (true) {
    const packageJsonPath = path.join(current, 'package.json')
    if (fs.existsSync(packageJsonPath)) {
      nearestPackageRoot = nearestPackageRoot || current
      try {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
        if (pkg.workspaces) return current
      } catch {
        // ignore
      }
    }

    if (
      fs.existsSync(path.join(current, 'pnpm-workspace.yaml')) ||
      fs.existsSync(path.join(current, 'lerna.json'))
    ) {
      return current
    }

    const parent = path.dirname(current)
    if (parent === current) break
    current = parent
  }

  return nearestPackageRoot || path.resolve(cwd)
}

function parseSkillFrontmatter(content) {
  const match = content.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---/)
  if (!match) return null

  const yaml = match[1]
  const nameMatch = yaml.match(/^\s*name\s*:\s*(.+?)\s*$/m)
  const name = nameMatch ? parseYamlScalar(nameMatch[1]) : undefined
  const descriptionMatch = yaml.match(/^\s*description\s*:\s*(.+?)\s*$/m)
  const description = descriptionMatch
    ? parseYamlScalar(descriptionMatch[1])
    : undefined

  return {
    name,
    description,
    hasDescription: Boolean(description),
  }
}

function parseYamlScalar(value) {
  const trimmed = String(value || '').trim()
  if (!trimmed) return trimmed

  const quote = trimmed.charAt(0)
  if (
    (quote === '"' || quote === "'") &&
    trimmed.charAt(trimmed.length - 1) === quote
  ) {
    return trimmed.slice(1, -1)
  }

  return trimmed
}

function readSkillSource(skillDir, meta) {
  const skillMdPath = path.join(skillDir, 'SKILL.md')
  if (!fs.existsSync(skillMdPath)) {
    return {
      valid: false,
      skillDir,
      reason: `未找到 SKILL.md：${skillMdPath}`,
      meta: meta || {},
    }
  }

  const content = fs.readFileSync(skillMdPath, 'utf8')
  const frontmatter = parseSkillFrontmatter(content)
  if (!frontmatter) {
    return {
      valid: false,
      skillDir,
      reason: 'SKILL.md 必须以 YAML frontmatter 开头',
      meta: meta || {},
    }
  }

  if (!frontmatter.name) {
    return {
      valid: false,
      skillDir,
      reason: 'SKILL.md frontmatter 缺少 name',
      meta: meta || {},
    }
  }

  if (!frontmatter.hasDescription) {
    return {
      valid: false,
      skillDir,
      reason: 'SKILL.md frontmatter 缺少 description',
      meta: meta || {},
    }
  }

  return Object.assign(
    {
      valid: true,
      name: frontmatter.name,
      targetName: frontmatter.name,
      dirName: path.basename(skillDir),
      skillDir,
      skillMdPath,
      realSkillDir: getRealPath(skillDir),
    },
    meta || {}
  )
}

function validateSkillSource(source) {
  if (!source || !source.valid) {
    throw new Error(source ? source.reason : '无效的 skill source')
  }
}

function getPackageMeta(packageRoot, fallbackName) {
  const pkg = readJson(path.join(packageRoot, 'package.json')) || {}
  return {
    packageName: pkg.name || fallbackName || path.basename(packageRoot),
    packageVersion: pkg.version,
    packageRoot,
  }
}

function scanPackageForSkillSources(packageRoot, fallbackName) {
  const packageMeta = getPackageMeta(packageRoot, fallbackName)
  const skillsRoot = path.join(packageRoot, 'skills')
  if (!isDirectoryLike(skillsRoot)) return []

  return fs
    .readdirSync(skillsRoot)
    .map((name) => path.join(skillsRoot, name))
    .filter((skillDir) => isDirectoryLike(skillDir))
    .map((skillDir) =>
      readSkillSource(
        skillDir,
        Object.assign({}, packageMeta, {
          sourceType: 'package',
        })
      )
    )
    .filter((source) => source.valid)
}

function scanNodeModulesForSkillSources(nodeModulesDir) {
  if (!isDirectoryLike(nodeModulesDir)) return []

  const sources = []
  fs.readdirSync(nodeModulesDir).forEach((name) => {
    if (!name || name.charAt(0) === '.') return

    const entryPath = path.join(nodeModulesDir, name)
    if (!isDirectoryLike(entryPath)) return

    if (name.charAt(0) === '@') {
      fs.readdirSync(entryPath).forEach((packageName) => {
        const packageRoot = path.join(entryPath, packageName)
        if (!isDirectoryLike(packageRoot)) return
        sources.push.apply(
          sources,
          scanPackageForSkillSources(packageRoot, `${name}/${packageName}`)
        )
      })
      return
    }

    sources.push.apply(sources, scanPackageForSkillSources(entryPath, name))
  })

  return sources
}

function getWorkspacePatterns(workspaceRoot) {
  const pkg = readJson(path.join(workspaceRoot, 'package.json')) || {}
  const workspaces = pkg.workspaces
  if (Array.isArray(workspaces)) return workspaces
  if (workspaces && Array.isArray(workspaces.packages)) {
    return workspaces.packages
  }
  return []
}

function expandSimpleWorkspacePattern(workspaceRoot, pattern) {
  if (!pattern || pattern.indexOf('!') === 0) return []

  const normalized = normalizeSlash(pattern)
  const starIndex = normalized.indexOf('*')
  if (starIndex < 0) {
    const absolutePath = path.join(workspaceRoot, normalized)
    return isDirectoryLike(absolutePath) ? [absolutePath] : []
  }

  const beforeStar = normalized.slice(0, starIndex).replace(/\/$/, '')
  const afterStar = normalized.slice(starIndex + 1).replace(/^\//, '')
  const parentDir = path.join(workspaceRoot, beforeStar)
  if (!isDirectoryLike(parentDir)) return []

  return fs
    .readdirSync(parentDir)
    .map((name) => path.join(parentDir, name, afterStar))
    .filter((dir) => isDirectoryLike(dir))
}

function scanWorkspaceForSkillSources(workspaceRoot) {
  const patterns = getWorkspacePatterns(workspaceRoot)
  const packageRoots = []

  patterns.forEach((pattern) => {
    expandSimpleWorkspacePattern(workspaceRoot, pattern).forEach((dir) => {
      if (fs.existsSync(path.join(dir, 'package.json'))) {
        packageRoots.push(dir)
      }
    })
  })

  return packageRoots.reduce(
    (list, packageRoot) => list.concat(scanPackageForSkillSources(packageRoot)),
    []
  )
}

function resolveSkillsConfigPath(workspaceRoot, configPath) {
  if (configPath) {
    return path.isAbsolute(configPath)
      ? configPath
      : path.join(workspaceRoot, configPath)
  }

  const candidates = [
    'skills.config.cjs',
    'skills.config.js',
    'skills.config.json',
  ].map((name) => path.join(workspaceRoot, name))

  return candidates.find((filePath) => fs.existsSync(filePath)) || null
}

function readConfigFile(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return {}

  if (filePath.endsWith('.json')) {
    return readJson(filePath) || {}
  }

  const resolved = require.resolve(filePath)
  delete require.cache[resolved]
  const config = require(resolved)
  return config && config.default ? config.default : config
}

function loadSkillsConfig(workspaceRoot, options) {
  if (options.config === false) return {}

  const configPath = resolveSkillsConfigPath(workspaceRoot, options.configPath)
  if (options.configPath && !fs.existsSync(configPath)) {
    throw new Error(`未找到配置文件：${configPath}`)
  }
  const fileConfig = readConfigFile(configPath)
  const packageJson = readJson(path.join(workspaceRoot, 'package.json')) || {}
  const packageConfig =
    packageJson['skills-install'] &&
    typeof packageJson['skills-install'] === 'object'
      ? packageJson['skills-install']
      : {}

  return normalizeSkillsConfig(
    Object.assign({}, packageConfig, fileConfig || {})
  )
}

function normalizeSkillsConfig(config) {
  const skillsConfig =
    config && config.skills && typeof config.skills === 'object'
      ? config.skills
      : config || {}

  return {
    include: normalizeFilterList(skillsConfig.include),
    exclude: normalizeFilterList(skillsConfig.exclude),
  }
}

function normalizeFilterList(value) {
  if (!value) return []
  if (typeof value === 'string') return parseFilterArg(value)
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (!item) return null
      if (typeof item === 'string') return item
      if (typeof item !== 'object') return null

      const result = {}
      if (item.package) result.package = item.package
      if (item.skill) result.skills = [item.skill]
      if (item.skills) {
        result.skills = Array.isArray(item.skills)
          ? item.skills.slice()
          : String(item.skills)
              .split(',')
              .map((name) => name.trim())
              .filter(Boolean)
      }
      return result.package || (result.skills && result.skills.length)
        ? result
        : null
    })
    .filter(Boolean)
}

function resolveSkillFilters(options, workspaceRoot) {
  const config = loadSkillsConfig(workspaceRoot, options)

  return {
    include:
      options.include !== null && typeof options.include !== 'undefined'
        ? options.include
        : config.include || [],
    exclude:
      options.exclude !== null && typeof options.exclude !== 'undefined'
        ? options.exclude
        : config.exclude || [],
  }
}

function wildcardToRegExp(pattern) {
  const source = String(pattern || '')
    .replace(/[|\\{}()[\]^$+.:]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.')

  return new RegExp(`^${source}$`)
}

function matchesPattern(value, pattern) {
  if (!pattern) return false
  if (pattern === value) return true
  return wildcardToRegExp(pattern).test(value)
}

function matchesPackagePattern(source, pattern) {
  return matchesPattern(source.packageName, pattern)
}

function matchesSkillPattern(source, pattern) {
  return (
    matchesPattern(source.name, pattern) ||
    matchesPattern(source.dirName, pattern)
  )
}

function matchesFilterItem(source, item) {
  if (typeof item === 'string') {
    return (
      matchesPackagePattern(source, item) || matchesSkillPattern(source, item)
    )
  }

  if (!item || typeof item !== 'object') return false

  const packageMatched = item.package
    ? matchesPackagePattern(source, item.package)
    : true
  const skills = item.skills || []
  const skillMatched = skills.length
    ? skills.some((skillName) => matchesSkillPattern(source, skillName))
    : true

  return packageMatched && skillMatched
}

function filterSkillSources(sources, filters) {
  const include = filters.include || []
  const exclude = filters.exclude || []

  return sources.filter((source) => {
    const included = include.length
      ? include.some((item) => matchesFilterItem(source, item))
      : true
    const excluded = exclude.some((item) => matchesFilterItem(source, item))
    return included && !excluded
  })
}

function uniqueSkillSources(sources) {
  const seenPaths = {}
  const seenNames = {}
  const result = []

  sources.forEach((source) => {
    const pathKey = source.realSkillDir.toLowerCase()
    if (seenPaths[pathKey]) return

    if (seenNames[source.name]) {
      if (source.sourceType === 'builtin') return
      seenNames[source.name].duplicates.push(source)
      return
    }

    const item = Object.assign({}, source, { duplicates: [] })
    seenPaths[pathKey] = item
    seenNames[source.name] = item
    result.push(item)
  })

  return result
}

function discoverSkillSources(options) {
  options = options || {}
  const workspaceRoot =
    options.workspaceRoot || findWorkspaceRoot(options.cwd || process.cwd())
  const builtinSource = readSkillSource(SKILLS_DIR, {
    packageName: '@fexd/tools',
    packageVersion: (readJson(path.join(PACKAGE_ROOT, 'package.json')) || {})
      .version,
    packageRoot: PACKAGE_ROOT,
    sourceType: 'builtin',
  })
  validateSkillSource(builtinSource)
  const sources = scanNodeModulesForSkillSources(
    path.join(workspaceRoot, 'node_modules')
  )
    .concat(scanWorkspaceForSkillSources(workspaceRoot))
    .concat([builtinSource])
    .filter((source) => source.valid)
  const filters = resolveSkillFilters(options, workspaceRoot)

  return uniqueSkillSources(filterSkillSources(sources, filters))
}

function lstatSafe(target) {
  try {
    return fs.lstatSync(target)
  } catch (error) {
    if (error && error.code === 'ENOENT') return null
    throw error
  }
}

function unlinkFileOrLinkSync(target) {
  try {
    fs.unlinkSync(target)
  } catch (error) {
    if (error && (error.code === 'EISDIR' || error.code === 'EPERM')) {
      fs.rmdirSync(target)
      return
    }
    throw error
  }
}

function removeSync(target) {
  const stat = lstatSafe(target)
  if (!stat) return

  if (stat.isDirectory() && !stat.isSymbolicLink()) {
    fs.readdirSync(target).forEach((name) =>
      removeSync(path.join(target, name))
    )
    fs.rmdirSync(target)
  } else {
    unlinkFileOrLinkSync(target)
  }
}

function copyDirSync(source, target) {
  fs.mkdirSync(target, { recursive: true })
  fs.readdirSync(source).forEach((name) => {
    const sourcePath = path.join(source, name)
    const targetPath = path.join(target, name)
    const stat = fs.lstatSync(sourcePath)

    if (stat.isDirectory()) {
      copyDirSync(sourcePath, targetPath)
    } else {
      fs.copyFileSync(sourcePath, targetPath)
    }
  })
}

function isSameLinkTarget(source, target) {
  try {
    const parent = path.dirname(target)
    const currentTarget = fs.readlinkSync(target)
    return (
      path.resolve(parent, currentTarget) === path.resolve(source) ||
      path.resolve(currentTarget) === path.resolve(source)
    )
  } catch {
    return false
  }
}

function ensureLinkOrCopy(source, target, options) {
  const relativeTarget = normalizeSlash(
    path.relative(options.workspaceRoot, target)
  )
  const action = options.copy ? 'copy' : 'link'

  if (options.dryRun) {
    console.log(
      `  ${c('dim', '[dry-run]')} ${action} ${c('cyan', relativeTarget)}`
    )
    return
  }

  fs.mkdirSync(path.dirname(target), { recursive: true })

  const targetStat = lstatSafe(target)
  if (targetStat) {
    const stat = targetStat
    if (stat.isSymbolicLink()) {
      if (isSameLinkTarget(source, target)) {
        console.log(`  ${c('green', 'OK')} ${relativeTarget}`)
        return
      }
      removeSync(target)
    } else if (stat.isFile() && stat.size === 0) {
      removeSync(target)
    } else if (options.force) {
      removeSync(target)
    } else {
      throw new Error(
        `目标已存在且不是链接：${target}。如需覆盖，请添加 --force`
      )
    }
  }

  if (options.copy) {
    copyDirSync(source, target)
    console.log(`  ${c('green', 'Copied')} ${relativeTarget}`)
    return
  }

  try {
    fs.symlinkSync(
      source,
      target,
      process.platform === 'win32' ? 'junction' : 'dir'
    )
    console.log(`  ${c('green', 'Linked')} ${relativeTarget}`)
  } catch (error) {
    removeSync(target)
    try {
      copyDirSync(source, target)
    } catch (copyError) {
      removeSync(target)
      throw copyError
    }
    console.log(
      `  ${c('yellow', 'Copied')} ${relativeTarget} ${c(
        'dim',
        `(symlink failed: ${error.message})`
      )}`
    )
  }
}

function resolveAgents(agentNames) {
  const agents = getAgents()
  const names = []

  agentNames.forEach((agentName) => {
    if (agentName === 'common') {
      COMMON_AGENTS.forEach((name) => names.push(name))
    } else {
      names.push(agentName)
    }
  })

  return names
    .filter((name, index) => names.indexOf(name) === index)
    .map((name) => {
      if (!agents[name]) {
        throw new Error(
          `不支持的 agent：${name}。可选值：${COMMON_AGENTS.join(', ')}, common`
        )
      }
      return agents[name]
    })
}

function getTargetsForAgent(agent, workspaceRoot, scope, skillName) {
  skillName = skillName || SKILL_NAME
  const scopes = scope === 'both' ? ['project', 'global'] : [scope]
  const targets = []

  scopes.forEach((item) => {
    if (item === 'project') {
      agent.projectSkillsDirs.forEach((dir) => {
        targets.push({
          agent,
          scope: item,
          path: path.join(workspaceRoot, dir, skillName),
        })
      })
    }

    if (item === 'global') {
      targets.push({
        agent,
        scope: item,
        path: path.join(agent.globalSkillsDir, skillName),
      })
    }
  })

  return targets
}

function uniqueTargets(targets) {
  const seen = {}
  const result = []

  targets.forEach((target) => {
    const key = path.resolve(target.path).toLowerCase()
    if (seen[key]) {
      seen[key].agents.push(target.agent)
      return
    }

    const mergedTarget = Object.assign({}, target, { agents: [target.agent] })
    seen[key] = mergedTarget
    result.push(mergedTarget)
  })

  return result
}

function getTargetDisplayName(target) {
  return (target.agents || [target.agent])
    .map((agent) => agent.displayName)
    .filter((name, index, list) => list.indexOf(name) === index)
    .join(' / ')
}

function toGitignorePattern(workspaceRoot, target) {
  return normalizeSlash(path.relative(workspaceRoot, target))
}

function updateGitignore(workspaceRoot, targets, options) {
  if (!options.gitignore || options.scope === 'global') return

  const patterns = targets
    .filter((target) => target.scope === 'project')
    .map((target) => toGitignorePattern(workspaceRoot, target.path))
    .filter((pattern) => pattern && pattern.indexOf('..') !== 0)
    .filter((pattern, index, list) => list.indexOf(pattern) === index)

  if (!patterns.length) return

  const gitignorePath = path.join(workspaceRoot, '.gitignore')
  const content = fs.existsSync(gitignorePath)
    ? fs.readFileSync(gitignorePath, 'utf8')
    : ''
  const lines = content.split(/\r?\n/)
  const missing = patterns.filter((pattern) => lines.indexOf(pattern) < 0)

  if (!missing.length) return

  const block = ['', '# Agent skills installed from npm packages']
    .concat(missing)
    .join('\n')

  if (options.dryRun) {
    console.log(`\n  ${c('dim', '[dry-run]')} update .gitignore:`)
    missing.forEach((pattern) => console.log(`    ${pattern}`))
    return
  }

  fs.writeFileSync(gitignorePath, content.replace(/\s*$/, '') + block + '\n')
  console.log(`\n  ${c('green', 'Updated')} .gitignore`)
}

function installSkills(args, hooks) {
  const options = parseOptions(args)
  const workspaceRoot = findWorkspaceRoot(options.cwd)
  const agents = resolveAgents(options.agents)
  const sources = discoverSkillSources(
    Object.assign({}, options, { workspaceRoot })
  )
  const allTargets = []
  const failures = []
  const installTarget =
    hooks && hooks.ensureLinkOrCopy ? hooks.ensureLinkOrCopy : ensureLinkOrCopy

  console.log(`\n${c('bold', c('cyan', '  @fexd/tools skills'))}\n`)
  console.log(`  ${c('dim', 'workspace:')} ${workspaceRoot}`)
  console.log(`  ${c('dim', 'sources:')} ${sources.length}`)
  console.log()

  sources.forEach((source) => {
    validateSkillSource(source)

    if (source.dirName !== source.name) {
      console.log(
        `  ${c('yellow', 'Warning')} ${source.packageName}: ${c(
          'cyan',
          source.dirName
        )} -> ${c('cyan', source.name)}`
      )
    }

    if (source.duplicates && source.duplicates.length) {
      console.log(
        `  ${c('yellow', 'Warning')} duplicate skill name ${c(
          'cyan',
          source.name
        )}; using ${source.skillDir}`
      )
    }

    const targets = uniqueTargets(
      agents.reduce(
        (list, agent) =>
          list.concat(
            getTargetsForAgent(
              agent,
              workspaceRoot,
              options.scope,
              source.targetName
            )
          ),
        []
      )
    )

    console.log(
      `  ${c('bold', source.name)} ${c('dim', `from ${source.packageName}`)}`
    )

    targets.forEach((target) => {
      const scope =
        target.scope === 'global'
          ? c('magenta', 'global')
          : c('cyan', 'project')
      console.log(`    ${c('bold', getTargetDisplayName(target))} ${scope}`)
      try {
        installTarget(
          source.skillDir,
          target.path,
          Object.assign({}, options, { workspaceRoot })
        )
        allTargets.push(target)
      } catch (error) {
        const relativeTarget = normalizeSlash(
          path.relative(workspaceRoot, target.path)
        )
        failures.push({
          source,
          target,
          error,
          relativeTarget,
        })
        console.log(
          `      ${c('red', 'Failed')} ${c('cyan', relativeTarget)} ${c(
            'dim',
            error && error.message ? error.message : String(error)
          )}`
        )
      }
    })

    console.log()
  })

  updateGitignore(workspaceRoot, allTargets, options)

  if (failures.length) {
    console.log(`\n  ${c('red', 'Failed')} ${failures.length} target(s):`)
    failures.forEach((failure) => {
      const message =
        failure.error && failure.error.message
          ? failure.error.message
          : String(failure.error)
      console.log(
        `    ${c('cyan', failure.source.name)} -> ${c(
          'cyan',
          failure.relativeTarget
        )}: ${message}`
      )
    })
    process.exitCode = 1
  }

  console.log()
}

function showSkillsHelp() {
  console.log(`
  ${c('bold', c('cyan', '@fexd/tools skills'))}

  ${c('bold', '用法：')}
    ${c(
      'green',
      'fexd-tools skills install [include]'
    )}               安装本库及依赖包里的 skills
    ${c(
      'green',
      'fexd-tools skills install --agents cursor,codex'
    )}    指定 agent
    ${c(
      'green',
      'fexd-tools skills install --scope global'
    )}           安装到用户全局目录

  ${c('bold', 'Options：')}
    ${c(
      'cyan',
      '--agents <list>'
    )}      common, cursor, codex, claude-code, opencode；默认 common
    ${c('cyan', '--scope <scope>')}      project, global, both；默认 project
    ${c('cyan', '--cwd <path>')}         指定消费项目目录；默认当前目录
    ${c('cyan', '--force')}              目标已存在普通文件/目录时强制覆盖
    ${c('cyan', '--copy')}               复制 skill 目录，不创建链接
    ${c('cyan', '--dry-run')}            只打印计划，不写文件
    ${c('cyan', '--no-gitignore')}       不自动更新项目 .gitignore
    ${c(
      'cyan',
      '--include <list>'
    )}      白名单，包名/skill 名或 package:skill，支持 *；也可省略 --include 写成裸参数
    ${c('cyan', '--exclude <list>')}      黑名单，格式同 --include
    ${c(
      'cyan',
      '--config <path>'
    )}       指定配置文件；默认查找 skills.config.js/cjs/json
    ${c('cyan', '--no-config')}           不读取项目配置文件

  ${c('bold', '示例：')}
    ${c('dim', '$')} fexd-tools skills install
    ${c(
      'dim',
      '$'
    )} fexd-tools skills install --agents cursor,claude-code,opencode
    ${c('dim', '$')} fexd-tools skills install --agents codex --scope global
    ${c('dim', '$')} fexd-tools skills install --copy
    ${c('dim', '$')} fexd-tools skills install @risk-bc/*,@fexd/pro-components
    ${c('dim', '$')} fexd-tools skills install --include @risk-bc/*
    ${c(
      'dim',
      '$'
    )} fexd-tools skills install --exclude @fexd/pro-components:fexd-pro-components

  ${c('bold', '默认项目目录：')}
    ${c('dim', 'Cursor')}      .cursor/skills
    ${c('dim', 'Codex')}       .agents/skills
    ${c('dim', 'Claude Code')} .claude/skills
    ${c('dim', 'OpenCode')}    .agents/skills

  ${c('bold', '发现规则：')}
    扫描当前项目 node_modules 与 workspace 包中的 skills/*/SKILL.md
    安装目录名使用 SKILL.md frontmatter 里的 name
`)
}

const UTILS_CATALOG = {
  合并对象: ['deepMerge', 'merge', 'shallowMerge'],
  读写对象属性: [
    'get',
    'set',
    'pick',
    'pickBy',
    'compactObject',
    'value',
    'run',
    'deepMapItem',
    'depsChanged',
  ],
  操作数组: [
    'groupBy',
    'uniqByKey',
    'difference',
    'intersection',
    'diffArray',
    'flatten',
    'first',
    'last',
    'sample',
  ],
  判断值的类型: [
    'isObject',
    'isPlainObject',
    'isArray',
    'isFunction',
    'isString',
    'isNumber',
    'isInteger',
    'isFinite',
    'isBoolean',
    'isSymbol',
    'isDate',
    'isUndefined',
    'isNull',
    'isNil',
    'isNaN',
    'isExist',
    'isEmpty',
    'isPromiseLike',
    'isBigNumber',
    'isNumberString',
    'isError',
    'isRegExp',
    'isIterable',
    'isReactElementLike',
  ],
  判断运行平台: ['isMobile', 'isAndroid', 'isIOS', 'isDesktop', 'isWKWebview'],
  控制函数执行: [
    'debounce',
    'throttle',
    'memoize',
    'lock',
    'singleflight',
    'createCachedRequest',
    'pipe',
    'curry',
    '__',
  ],
  处理异步: [
    'catchPromise',
    'enhancePromise',
    'delay',
    'nextTick',
    'promiseGuess',
  ],
  URL与序列化: ['url', 'qs', 'safeStringify', 'formdata2obj', 'obj2formdata'],
  国际化: ['I18n'],
  浏览器环境与存储: [
    'storage',
    'globalThis',
    'copy',
    'preloadImage',
    'file2base64',
  ],
  动画与缓动: ['easing', 'Tween', 'FrameProcess', 'ScrollListener'],
  颜色工具: ['darkenColor', 'getBrightness', 'hexToRgb', 'randomRGB'],
  字符串与数字: [
    'capitalize',
    'clamp',
    'toFixed',
    'expandScientificNumberString',
    'createSeparatorFormatter',
    'segment',
    'random',
    'uniqueId',
  ],
  响应式: ['reactive', 'computed', 'watch'],
  事件与通信: ['EventBus'],
  组合匹配: ['CombinationMatcher'],
  其他工具: ['classnames', 'identity', 'createProxyGetter'],
  动态加载: ['source'],
  弃用: ['getFormatter', 'CombJudge', 'SAS'],
}

function listUtils() {
  console.log(
    `\n${c('bold', c('cyan', '  @fexd/tools'))} ${c('dim', '— 工具函数列表')}\n`
  )

  for (const [category, items] of Object.entries(UTILS_CATALOG)) {
    console.log(`  ${c('yellow', '■')} ${c('bold', category)}`)
    for (const item of items) {
      const refPath = path.join(REFS_DIR, `${item}.md`)
      const exists = fs.existsSync(refPath)
      const icon = exists ? c('green', '●') : c('dim', '○')
      console.log(
        `    ${icon} ${item}${exists ? '' : c('dim', ' (无详细文档)')}`
      )
    }
    console.log()
  }

  console.log(
    `  ${c('dim', '使用')} ${c('cyan', 'fexd-tools docs <name>')} ${c(
      'dim',
      '查看详细文档'
    )}`
  )
  console.log()
}

function showDocs(name) {
  const refPath = path.join(REFS_DIR, `${name}.md`)
  let content = readMarkdown(refPath)

  if (!content) {
    const skillFiles = ['catalog']
    if (skillFiles.includes(name.toLowerCase())) {
      content = readMarkdown(path.join(SKILLS_DIR, `${name.toLowerCase()}.md`))
    }
  }

  if (!content) {
    const match = name.charAt(0).toUpperCase() + name.slice(1)
    if (match !== name) {
      content = readMarkdown(path.join(REFS_DIR, `${match}.md`))
    }
  }

  if (!content) {
    const files = fs.existsSync(REFS_DIR) ? fs.readdirSync(REFS_DIR) : []
    const matchFile = files.find(
      (f) => f.toLowerCase() === `${name.toLowerCase()}.md`
    )
    if (matchFile) {
      content = readMarkdown(path.join(REFS_DIR, matchFile))
    }
  }

  if (!content) {
    console.log(`\n  ${c('red', '✗')} 未找到 "${name}" 的文档\n`)
    console.log(`  ${c('dim', '可用的文档：')}`)
    if (fs.existsSync(REFS_DIR)) {
      const files = fs.readdirSync(REFS_DIR).map((f) => f.replace('.md', ''))
      console.log(`  ${c('cyan', files.join(', '))}`)
    }
    console.log(`  ${c('dim', '以及：')} ${c('cyan', 'catalog')}`)
    console.log()
    return
  }

  console.log()
  console.log(content)
}

function searchDocs(query) {
  const lowerQuery = query.toLowerCase()
  const results = []

  const searchDir = (dir, prefix = '') => {
    if (!fs.existsSync(dir)) return
    const files = fs.readdirSync(dir)
    for (const file of files) {
      if (!file.endsWith('.md')) continue
      const filePath = path.join(dir, file)
      const content = readMarkdown(filePath)
      if (!content) continue

      const lines = content.split('\n')
      const matches = []
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].toLowerCase().includes(lowerQuery)) {
          matches.push({ line: i + 1, text: lines[i].trim() })
        }
      }

      if (matches.length > 0) {
        results.push({ file: `${prefix}${file}`, matches })
      }
    }
  }

  searchDir(SKILLS_DIR)
  searchDir(REFS_DIR, 'references/')

  if (results.length === 0) {
    console.log(`\n  ${c('red', '✗')} 未找到包含 "${query}" 的内容\n`)
    return
  }

  console.log(
    `\n  ${c('bold', c('green', '✓'))} 找到 ${results.length} 个文件包含 "${c(
      'cyan',
      query
    )}"\n`
  )

  for (const result of results) {
    console.log(`  ${c('yellow', '■')} ${c('bold', result.file)}`)
    const shown = result.matches.slice(0, 3)
    for (const match of shown) {
      const highlighted = match.text.replace(new RegExp(query, 'gi'), (m) =>
        c('cyan', c('bold', m))
      )
      console.log(`    ${c('dim', `L${match.line}:`)} ${highlighted}`)
    }
    if (result.matches.length > 3) {
      console.log(
        `    ${c('dim', `... 还有 ${result.matches.length - 3} 处匹配`)}`
      )
    }
    console.log()
  }
}

function showHelp() {
  console.log(`
  ${c('bold', c('cyan', '@fexd/tools CLI'))}

  ${c('bold', '用法：')}
    ${c('green', 'fexd-tools list')}                 列出所有工具函数
    ${c('green', 'fexd-tools docs <name>')}          查看工具函数文档
    ${c('green', 'fexd-tools search <query>')}       搜索文档内容
    ${c('green', 'fexd-tools skills install')}       安装本库及依赖包 skills
    ${c('green', 'fexd-tools help')}                 显示帮助信息

  ${c('bold', '示例：')}
    ${c('dim', '$')} fexd-tools docs deepMerge
    ${c('dim', '$')} fexd-tools docs I18n
    ${c('dim', '$')} fexd-tools docs catalog
    ${c('dim', '$')} fexd-tools search "合并"
    ${c('dim', '$')} fexd-tools search "I18n template"
    ${c('dim', '$')} fexd-tools skills install
    ${c(
      'dim',
      '$'
    )} fexd-tools skills install --agents cursor,claude-code,opencode
`)
}

function main(argv) {
  const [, , command, ...args] = argv

  const commandMap = {
    list: listUtils,
    ls: listUtils,
    docs: () => (args[0] ? showDocs(args[0]) : showHelp()),
    doc: () => (args[0] ? showDocs(args[0]) : showHelp()),
    search: () => (args.length > 0 ? searchDocs(args.join(' ')) : showHelp()),
    find: () => (args.length > 0 ? searchDocs(args.join(' ')) : showHelp()),
    skills: () => {
      if (args[0] === 'install') {
        if (args.indexOf('--help') >= 0 || args.indexOf('-h') >= 0) {
          showSkillsHelp()
          return
        }
        installSkills(args.slice(1))
        return
      }
      showSkillsHelp()
    },
    help: showHelp,
    '-h': showHelp,
    '--help': showHelp,
  }

  const handler = commandMap[command]
  if (handler) {
    handler()
  } else if (command) {
    showDocs(command)
  } else {
    showHelp()
  }
}

if (require.main === module) {
  try {
    main(process.argv)
  } catch (error) {
    console.error(`\n  ${c('red', '✗')} ${error.message}\n`)
    process.exit(1)
  }
}

module.exports = {
  discoverSkillSources,
  ensureLinkOrCopy,
  filterSkillSources,
  findWorkspaceRoot,
  getTargetsForAgent,
  installSkills,
  loadSkillsConfig,
  parseOptions,
  parseSkillFrontmatter,
  readSkillSource,
  resolveSkillFilters,
  scanNodeModulesForSkillSources,
  scanPackageForSkillSources,
  scanWorkspaceForSkillSources,
  uniqueSkillSources,
}
