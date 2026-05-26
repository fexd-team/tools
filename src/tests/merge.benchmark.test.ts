import merge from '../merge'
import I18n from '../I18n'

/**
 * 模拟真实 i18n 场景的 merge supplement 性能基准测试
 *
 * 场景：三层语言包叠加
 * - 基础组件层:     ~70 keys/语言, 2 层嵌套, 5 种语言
 * - 框架层:         ~64 keys/语言, 扁平, 5 种语言
 * - 组件层 (bc):    ~715 keys/语言, 扁平, 5 种语言
 * - business app:   ~6575 keys/语言, 扁平, 5 种语言
 */

const LOCALES = ['zh-CN', 'en-US', 'id-ID', 'ms-MY', 'vi-VN'] as const
const LOCALE_ALIASES = ['zh_CN', 'en_US', 'id_ID', 'ms_MY', 'vi_VN'] as const

function generateFlatLocale(
  keyCount: number,
  prefix: string
): Record<string, string> {
  const obj: Record<string, string> = {}
  for (let i = 0; i < keyCount; i++) {
    obj[
      `${prefix}_key_${i}_这是一个中文key`
    ] = `Translation value ${i} for ${prefix}`
  }
  return obj
}

function generateNestedLocale(
  groups: number,
  keysPerGroup: number,
  prefix: string
): Record<string, Record<string, string>> {
  const obj: Record<string, Record<string, string>> = {}
  for (let g = 0; g < groups; g++) {
    const group: Record<string, string> = {}
    for (let i = 0; i < keysPerGroup; i++) {
      group[`${prefix}_g${g}_k${i}`] = `Value ${g}-${i}`
    }
    obj[`${prefix}_group_${g}`] = group
  }
  return obj
}

function buildResourceMap(
  generator: () => Record<string, any>
): Record<string, any> {
  const map: Record<string, any> = {}
  for (const locale of LOCALES) map[locale] = generator()
  for (const alias of LOCALE_ALIASES)
    map[alias] = map[LOCALES[LOCALE_ALIASES.indexOf(alias)]]
  return map
}

function buildI18nConfig(resources: Record<string, any>) {
  return {
    types: {
      default: { resources },
      jsx: { resources },
    },
  }
}

describe('merge supplement 性能基准 (i18n 场景)', () => {
  const baseResources = buildResourceMap(() =>
    generateNestedLocale(6, 12, 'base')
  )
  const fwResources = buildResourceMap(() => generateFlatLocale(64, 'fw'))
  const bcResources = buildResourceMap(() => generateFlatLocale(715, 'bc'))

  test('🎯 真实场景: 三层 supplement (模拟 applyConfig 调用)', () => {
    const iterations = 100
    const targets: any[] = []

    for (let i = 0; i < iterations; i++) {
      targets.push(
        buildI18nConfig(buildResourceMap(() => generateFlatLocale(6575, 'biz')))
      )
    }

    const baseConfig = buildI18nConfig(baseResources)
    const fwConfig = buildI18nConfig(fwResources)
    const bcConfig = buildI18nConfig(bcResources)

    const start = performance.now()
    for (let i = 0; i < iterations; i++) {
      merge(targets[i], bcConfig, { mode: 'supplement' })
      merge(targets[i], fwConfig, { mode: 'supplement' })
      merge(targets[i], baseConfig, { mode: 'supplement' })
    }
    const elapsed = performance.now() - start
    const avg = elapsed / iterations

    console.log(`\n  ✅ 真实 i18n 场景 (三层 supplement, 就地合并):`)
    console.log(`     app(6575) ← bc(715) ← framework(64) ← base(70)`)
    console.log(`     每语言 5 locales × 2 types = 10 entries`)
    console.log(`     ⏱  平均耗时: ${avg.toFixed(3)}ms / 次\n`)

    // 真实场景应在 20ms 内完成
    expect(avg).toBeLessThan(20)
  })

  test('🔬 纯 merge 耗时 (排除对象创建开销)', () => {
    const target = buildResourceMap(() => generateFlatLocale(6575, 'biz'))
    const source = buildResourceMap(() => generateFlatLocale(715, 'bc'))

    for (let i = 0; i < 10; i++) {
      const t = { ...target }
      merge(t, source, { mode: 'supplement' })
    }

    const iterations = 200
    const start = performance.now()
    for (let i = 0; i < iterations; i++) {
      // 浅拷贝 target (模拟对象已存在)
      const t: Record<string, any> = {}
      for (const k of Object.keys(target)) t[k] = target[k]
      merge(t, source, { mode: 'supplement' })
    }
    const elapsed = performance.now() - start
    const avg = elapsed / iterations

    console.log(
      `  🔬 纯 supplement 合并 (resources 层, 6575 target ← 715 source):`
    )
    console.log(`     ⏱  ${avg.toFixed(4)}ms / 次`)
    console.log(`     📊 相当于 ${(1000 / avg).toFixed(0)} 次/秒\n`)

    expect(avg).toBeLessThan(10)
  })

  test('📊 supplement vs override vs Object.assign 对比 (排除 JSON 开销)', () => {
    const locale6575 = generateFlatLocale(6575, 'biz')
    const locale715 = generateFlatLocale(715, 'bc')
    const iterations = 200

    // supplement mode — 只合并单个 locale 对象
    let start = performance.now()
    for (let i = 0; i < iterations; i++) {
      const t = { ...locale6575 }
      merge(t, locale715, { mode: 'supplement' })
    }
    const supplementTime = (performance.now() - start) / iterations

    // override mode
    start = performance.now()
    for (let i = 0; i < iterations; i++) {
      const t = { ...locale6575 }
      merge(t, locale715)
    }
    const overrideTime = (performance.now() - start) / iterations

    // 纯 Object.assign
    start = performance.now()
    for (let i = 0; i < iterations; i++) {
      const t = { ...locale6575 }
      Object.assign(t, locale715)
    }
    const assignTime = (performance.now() - start) / iterations

    // 手写 supplement (最简实现)
    start = performance.now()
    for (let i = 0; i < iterations; i++) {
      const t = { ...locale6575 }
      for (const k in locale715) {
        if (t[k] === undefined) t[k] = locale715[k]
      }
    }
    const manualTime = (performance.now() - start) / iterations

    console.log(
      `  📊 单 locale 对象合并对比 (6575 keys target ← 715 keys source):`
    )
    console.log(`     merge(supplement): ${supplementTime.toFixed(4)}ms`)
    console.log(`     merge(override):   ${overrideTime.toFixed(4)}ms`)
    console.log(`     Object.assign:         ${assignTime.toFixed(4)}ms`)
    console.log(`     手写 for-in:           ${manualTime.toFixed(4)}ms`)
    console.log(
      `     supplement 比手写慢:    ${(
        (supplementTime / manualTime - 1) *
        100
      ).toFixed(1)}%\n`
    )

    expect(supplementTime).toBeLessThan(10)
  })

  test('📈 规模敏感性 (不同 key 数量)', () => {
    const sizes = [100, 500, 1000, 3000, 6575, 10000, 20000]
    const iterations = 100

    console.log(`  📈 key 数量 vs 耗时 (supplement, 单 locale 对象):`)

    for (const size of sizes) {
      const target = generateFlatLocale(size, 'target')
      const source = generateFlatLocale(Math.min(715, size), 'source')

      const start = performance.now()
      for (let i = 0; i < iterations; i++) {
        const t = { ...target }
        merge(t, source, { mode: 'supplement' })
      }
      const avg = (performance.now() - start) / iterations
      console.log(`     ${String(size).padStart(6)} keys: ${avg.toFixed(4)}ms`)
    }
    console.log('')

    const huge = generateFlatLocale(20000, 'huge')
    const src = generateFlatLocale(715, 'src')
    const start = performance.now()
    for (let i = 0; i < 50; i++) {
      const t = { ...huge }
      merge(t, src, { mode: 'supplement' })
    }
    expect((performance.now() - start) / 50).toBeLessThan(20)
  })

  test('🏗️ clone: true 额外开销', () => {
    const target = buildI18nConfig(
      buildResourceMap(() => generateFlatLocale(6575, 'biz'))
    )
    const source = buildI18nConfig(bcResources)
    const iterations = 200

    // without clone (in-place)
    let start = performance.now()
    for (let i = 0; i < iterations; i++) {
      merge({ ...target, types: { ...target.types } }, source, {
        mode: 'supplement',
      })
    }
    const noClone = (performance.now() - start) / iterations

    // with clone
    start = performance.now()
    for (let i = 0; i < iterations; i++) {
      merge(target, source, { mode: 'supplement', clone: true })
    }
    const withClone = (performance.now() - start) / iterations

    console.log(`  🏗️ clone 开销对比 (完整 i18n config):`)
    console.log(`     clone: false  ${noClone.toFixed(3)}ms`)
    console.log(`     clone: true   ${withClone.toFixed(3)}ms`)
    console.log(`     差值: +${(withClone - noClone).toFixed(3)}ms\n`)

    expect(withClone).toBeLessThan(30)
  })

  test('⚡ shallowAfterDepth 优化对比', () => {
    const iterations = 50

    const bcConfig = buildI18nConfig(bcResources)
    const fwConfig = buildI18nConfig(fwResources)
    const baseConfig = buildI18nConfig(baseResources)

    // 普通 supplement — 逐个创建避免内存爆炸
    let normalTotal = 0
    for (let i = 0; i < iterations; i++) {
      const target = buildI18nConfig(
        buildResourceMap(() => generateFlatLocale(6575, 'biz'))
      )
      const start = performance.now()
      merge(target, bcConfig, { mode: 'supplement' })
      merge(target, fwConfig, { mode: 'supplement' })
      merge(target, baseConfig, { mode: 'supplement' })
      normalTotal += performance.now() - start
    }
    const normalTime = normalTotal / iterations

    // shallowAfterDepth 优化
    // config 结构: types(0) → default/jsx(1) → resources(2) → locale(3) → flat keys(4)
    // 设 shallowAfterDepth=4，在 locale 对象这层启用浅合并
    let shallowTotal = 0
    for (let i = 0; i < iterations; i++) {
      const target = buildI18nConfig(
        buildResourceMap(() => generateFlatLocale(6575, 'biz'))
      )
      const start = performance.now()
      merge(target, bcConfig, { mode: 'supplement', shallowAfterDepth: 4 })
      merge(target, fwConfig, { mode: 'supplement', shallowAfterDepth: 4 })
      merge(target, baseConfig, { mode: 'supplement', shallowAfterDepth: 4 })
      shallowTotal += performance.now() - start
    }
    const shallowTime = shallowTotal / iterations

    console.log(`  ⚡ shallowAfterDepth 优化 (三层 supplement):`)
    console.log(`     普通 supplement:           ${normalTime.toFixed(3)}ms`)
    console.log(`     shallowAfterDepth=4:       ${shallowTime.toFixed(3)}ms`)
    console.log(
      `     提速: ${((1 - shallowTime / normalTime) * 100).toFixed(1)}%\n`
    )

    // 验证结果正确性
    const resultNormal = buildI18nConfig(
      buildResourceMap(() => generateFlatLocale(6575, 'biz'))
    )
    merge(resultNormal, bcConfig, { mode: 'supplement' })

    const resultShallow = buildI18nConfig(
      buildResourceMap(() => generateFlatLocale(6575, 'biz'))
    )
    merge(resultShallow, bcConfig, { mode: 'supplement', shallowAfterDepth: 4 })

    // 语义一致：对于扁平 locale，两种方式结果相同
    const normalLocale = resultNormal.types.default.resources['zh-CN']
    const shallowLocale = resultShallow.types.default.resources['zh-CN']
    expect(Object.keys(normalLocale).length).toBe(
      Object.keys(shallowLocale).length
    )
    expect(normalLocale).toEqual(shallowLocale)

    expect(shallowTime).toBeLessThan(normalTime)
  })

  test('🔄 多次 applyConfig 模拟 (target 逐步膨胀)', () => {
    const config: any = {
      types: {
        default: { resources: {} },
        jsx: { resources: {} },
      },
    }
    const iterations = 50
    const layers = [
      { name: 'base(70)', config: buildI18nConfig(baseResources) },
      { name: 'fw(64)', config: buildI18nConfig(fwResources) },
      { name: 'bc(715)', config: buildI18nConfig(bcResources) },
      {
        name: 'biz(6575)',
        config: buildI18nConfig(
          buildResourceMap(() => generateFlatLocale(6575, 'biz'))
        ),
      },
    ]

    console.log(`  🔄 逐层 applyConfig (supplement), 单次耗时:`)

    for (const layer of layers) {
      let total = 0
      for (let i = 0; i < iterations; i++) {
        const snapshot = JSON.parse(JSON.stringify(config))
        const start = performance.now()
        merge(snapshot, layer.config, { mode: 'supplement' })
        total += performance.now() - start
      }
      const avg = total / iterations
      console.log(`     + ${layer.name.padEnd(15)} → ${avg.toFixed(4)}ms`)

      merge(config, layer.config, { mode: 'supplement' })
    }

    const totalKeys = Object.keys(
      config.types.default.resources?.['zh-CN'] ?? {}
    ).length
    console.log(`     最终 config 每 locale 含 ${totalKeys} keys\n`)

    expect(totalKeys).toBeGreaterThan(6000)
  })

  test('🏷️ I18n priority 模式性能对比', async () => {
    I18n.instances = []
    I18n.language = undefined

    const baseLocale = generateFlatLocale(70, 'base')
    const fwLocale = generateFlatLocale(64, 'fw')
    const bcLocale = generateFlatLocale(715, 'bc')
    const bizLocale = generateFlatLocale(6575, 'biz')

    const makeResources = (locale: Record<string, string>) => {
      const resources: Record<string, any> = {}
      for (const l of LOCALES) resources[l] = { ...locale }
      for (const a of LOCALE_ALIASES)
        resources[a] = resources[LOCALES[LOCALE_ALIASES.indexOf(a)]]
      return resources
    }

    const baseConfig = {
      types: { default: { resources: makeResources(baseLocale) } },
    }
    const fwConfig = {
      types: { default: { resources: makeResources(fwLocale) } },
    }
    const bcConfig = {
      types: { default: { resources: makeResources(bcLocale) } },
    }
    const bizConfig = {
      types: { default: { resources: makeResources(bizLocale) } },
    }

    const iterations = 30

    // 传统 supplement (无 priority)
    let normalTotal = 0
    for (let i = 0; i < iterations; i++) {
      const i18n = new I18n({ types: { default: { resources: {} } } })
      i18n.documentEventSilent = true
      await I18n.applyLanguage('en-US')

      const start = performance.now()
      await i18n.applyConfig(bizConfig, { mode: 'supplement' })
      await i18n.applyConfig(bcConfig, { mode: 'supplement' })
      await i18n.applyConfig(fwConfig, { mode: 'supplement' })
      await i18n.applyConfig(baseConfig, { mode: 'supplement' })
      normalTotal += performance.now() - start
    }
    const normalTime = normalTotal / iterations

    I18n.instances = []
    I18n.language = undefined

    // priority 模式
    let priorityTotal = 0
    for (let i = 0; i < iterations; i++) {
      const i18n = new I18n({ types: { default: { resources: {} } } })
      i18n.documentEventSilent = true
      await I18n.applyLanguage('en-US')

      const start = performance.now()
      await i18n.applyConfig(bizConfig, { mode: 'supplement', priority: 4 })
      await i18n.applyConfig(bcConfig, { mode: 'supplement', priority: 3 })
      await i18n.applyConfig(fwConfig, { mode: 'supplement', priority: 2 })
      await i18n.applyConfig(baseConfig, { mode: 'supplement', priority: 1 })
      priorityTotal += performance.now() - start
    }
    const priorityTime = priorityTotal / iterations

    I18n.instances = []
    I18n.language = undefined

    console.log(`  🏷️ I18n priority 性能 (四层 supplement):`)
    console.log(`     传统 supplement:   ${normalTime.toFixed(3)}ms`)
    console.log(`     priority 模式:     ${priorityTime.toFixed(3)}ms`)
    console.log(
      `     开销差异: ${priorityTime > normalTime ? '+' : ''}${(
        priorityTime - normalTime
      ).toFixed(3)}ms\n`
    )

    // priority 模式开销应在合理范围
    expect(priorityTime).toBeLessThan(100)
  })
})
