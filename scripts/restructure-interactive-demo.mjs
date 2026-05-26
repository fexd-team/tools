import fs from 'fs'
import path from 'path'

const ROOT = path.resolve('documents/文档')

const FILES = [
  '工具/diffArray.md',
  '数字/toFixed.md',
  '工具/difference.md',
  '工具/hexToRgb.md',
  '函数/random.md',
  '数字/clamp.md',
  '函数/pick.md',
  '国际化/I18n.md',
  '扩展/classnames.md',
  '扩展/reactivity.md',
  '函数/lock.md',
  '工具/getBrightness.md',
  '函数/pipe.md',
  '工具/get.md',
  '存取/storage.md',
  '函数/delay.md',
  '数组/groupBy.md',
  '节流/debounce.md',
  '工具/randomRGB.md',
  '扩展/segment.md',
  '节流/throttle.md',
  '深度合并/deepMerge.md',
  '工具/darkenColor.md',
  '数组/flatten.md',
  '函数/memoize.md',
  '工具/uniqByKey.md',
  '工具/copy.md',
  '序列化/qs.md',
  '工具/getFormatter.md',
  '柯里化/curry.md',
  '事件处理/EventBus.md',
  '扩展/CombJudge.md',
  '函数/Tween.md',
]

function splitSections(content) {
  const lines = content.split('\n')
  const sections = []
  let current = null

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (current) sections.push(current)
      current = { heading: line, lines: [] }
    } else if (current) {
      current.lines.push(line)
    } else {
      if (!sections.length) sections.push({ heading: null, lines: [] })
      sections[0].lines.push(line)
    }
  }
  if (current) sections.push(current)

  for (const section of sections) {
    section.body = section.lines.join('\n')
    if (section.body.endsWith('\n')) {
      // keep as-is
    }
  }
  return sections
}

function findSection(sections, name) {
  return sections.find((s) => s.heading === `## ${name}`)
}

function trimBody(body) {
  return body.replace(/^\n+/, '').replace(/\n+$/, '')
}

function processStandard(sections) {
  const example = findSection(sections, '示例')
  if (!example) return { changed: false, reason: 'no 示例 section' }

  const body = example.body
  const interactionMatch = body.match(/^### 交互演示\n\n([\s\S]*?)(?=\n### )/m)
  if (!interactionMatch) return { changed: false, reason: 'no ### 交互演示 in 示例' }

  const interactionContent = interactionMatch[1]
  let remaining = body.slice(interactionMatch[0].length)

  if (remaining.startsWith('### 代码用法\n\n')) {
    remaining = remaining.slice('### 代码用法\n\n'.length)
  }

  example.body = '\n' + trimBody(remaining) + '\n'

  const typeSig = findSection(sections, '类型签名')
  if (!typeSig) return { changed: false, reason: 'no 类型签名 section' }

  const typeSigIdx = sections.indexOf(typeSig)
  const interactionSection = {
    heading: '## 交互演示',
    lines: [],
    body: '\n' + trimBody(interactionContent) + '\n',
  }

  sections.splice(typeSigIdx + 1, 0, interactionSection)
  return { changed: true }
}

function processDeepMerge(sections) {
  return processStandard(sections)
}

function processTween(sections) {
  const example = findSection(sections, '示例')
  if (!example) return { changed: false, reason: 'no 示例 section' }

  const body = example.body
  const codeUsageIdx = body.indexOf('\n### 代码用法\n\n')
  if (codeUsageIdx === -1) return { changed: false, reason: 'no ### 代码用法 in Tween' }

  const demoPart = body.slice(0, codeUsageIdx)
  const codePart = body.slice(codeUsageIdx + '\n### 代码用法\n\n'.length)

  if (!demoPart.includes('```jsx')) {
    return { changed: false, reason: 'no jsx demos in Tween 示例' }
  }

  example.body = '\n' + trimBody(codePart) + '\n'

  const typeSig = findSection(sections, '类型签名')
  if (!typeSig) return { changed: false, reason: 'no 类型签名 section' }

  const typeSigIdx = sections.indexOf(typeSig)
  const interactionSection = {
    heading: '## 交互演示',
    lines: [],
    body: '\n' + trimBody(demoPart) + '\n',
  }

  sections.splice(typeSigIdx + 1, 0, interactionSection)
  return { changed: true }
}

function processI18n(sections) {
  const interaction = findSection(sections, '交互演示')
  if (!interaction) return { changed: false, reason: 'no ## 交互演示 in I18n' }

  const typeSig = findSection(sections, '类型签名')
  if (!typeSig) return { changed: false, reason: 'no 类型签名 section' }

  const typeSigIdx = sections.indexOf(typeSig)
  const interactionIdx = sections.indexOf(interaction)

  if (interactionIdx === typeSigIdx + 1) {
    return { changed: false, reason: 'already after 类型签名' }
  }

  sections.splice(interactionIdx, 1)
  sections.splice(typeSigIdx + 1, 0, interaction)
  return { changed: true }
}

function sectionsToContent(sections) {
  return sections
    .map((s) => {
      if (!s.heading) return trimBody(s.body)
      const body = s.body.startsWith('\n') ? s.body : '\n' + s.body
      return s.heading + body
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
}

function processFile(relPath) {
  const filePath = path.join(ROOT, relPath)
  const content = fs.readFileSync(filePath, 'utf8')
  const sections = splitSections(content)

  let result
  if (relPath === '函数/Tween.md') {
    result = processTween(sections)
  } else if (relPath === '国际化/I18n.md') {
    result = processI18n(sections)
  } else {
    result = processStandard(sections)
  }

  if (!result.changed) {
    return { file: relPath, status: 'skipped', reason: result.reason }
  }

  const newContent = sectionsToContent(sections)
  fs.writeFileSync(filePath, newContent.endsWith('\n') ? newContent : newContent + '\n')
  return { file: relPath, status: 'processed' }
}

const results = FILES.map(processFile)
const processed = results.filter((r) => r.status === 'processed')
const skipped = results.filter((r) => r.status === 'skipped')

console.log(JSON.stringify({ processed: processed.length, skipped, processedFiles: processed.map((r) => r.file) }, null, 2))
