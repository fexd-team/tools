import I18n from '../I18n'
import _globalThis from '../globalThis'

const g = _globalThis as any

describe('I18n debug mount (__FEXD_DEBUG__)', () => {
  test('模块加载后 __FEXD_DEBUG__.i18n 存在且结构正确', () => {
    expect(g.__FEXD_DEBUG__).toBeDefined()
    expect(g.__FEXD_DEBUG__.i18n).toBeDefined()
    expect(g.__FEXD_DEBUG__.i18n.classes).toContain(I18n)
    expect(Array.isArray(g.__FEXD_DEBUG__.i18n.instances)).toBe(true)
  })

  test('创建实例后自动注册到 debug instances', () => {
    const before = g.__FEXD_DEBUG__.i18n.instances.length
    const inst = new I18n({ types: { default: { resources: {} } } })
    expect(g.__FEXD_DEBUG__.i18n.instances.length).toBe(before + 1)
    expect(g.__FEXD_DEBUG__.i18n.instances).toContain(inst)
  })

  test('可通过 key 找到特定实例', () => {
    const inst = new I18n({ types: { default: { resources: {} } } })
    const found = g.__FEXD_DEBUG__.i18n.instances.find(
      (i: any) => i.key === inst.key
    )
    expect(found).toBe(inst)
  })

  test('不会覆盖已有的 debug 注册（微前端多次加载安全）', () => {
    const classes = g.__FEXD_DEBUG__.i18n.classes
    const instances = g.__FEXD_DEBUG__.i18n.instances
    classes.push('FakeSubAppClass')
    instances.push({ key: 'fake-sub-app' })

    jest.resetModules()
    const I18n2 = require('../I18n').default

    expect(g.__FEXD_DEBUG__.i18n.classes).toBe(classes)
    expect(g.__FEXD_DEBUG__.i18n.instances).toBe(instances)
    expect(g.__FEXD_DEBUG__.i18n.classes).toContain('FakeSubAppClass')
    expect(g.__FEXD_DEBUG__.i18n.classes).toContain(I18n2)
  })
})
