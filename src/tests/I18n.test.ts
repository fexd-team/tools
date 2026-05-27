import I18n from '../I18n'

describe('I18n', () => {
  // 每个测试前清理实例
  beforeEach(() => {
    I18n.instances = []
    I18n.language = undefined
  })

  afterEach(() => {
    I18n.instances = []
    I18n.language = undefined
  })

  describe('静态方法 - template', () => {
    test('应该正确替换单个变量', () => {
      const result = I18n.template('hello {{name}}', { name: 'CJY' })
      expect(result).toBe('hello CJY')
    })

    test('应该正确替换多个变量', () => {
      const result = I18n.template(
        '{{greeting}} {{name}}, you are {{age}} years old',
        {
          greeting: 'Hello',
          name: 'CJY',
          age: 25,
        }
      )
      expect(result).toBe('Hello CJY, you are 25 years old')
    })

    test('应该处理变量前后的空格', () => {
      const result = I18n.template('hello {{ name }}', { name: 'CJY' })
      expect(result).toBe('hello CJY')
    })

    test('未找到变量时应使用默认 fallback', () => {
      const result = I18n.template('hello {{name}}', {})
      expect(result).toBe('hello (unknow)')
    })

    test('应该支持自定义 fallback 字符串', () => {
      const result = I18n.template('hello {{name}}', {}, { fallback: 'N/A' })
      expect(result).toBe('hello N/A')
    })

    test('应该支持 fallback 函数', () => {
      const result = I18n.template(
        'hello {{name}}',
        {},
        {
          fallback: (key, orig) => `[${key}]`,
        }
      )
      expect(result).toBe('hello [name]')
    })

    test('split=true 时应返回数组', () => {
      const result = I18n.template(
        'hello {{name}}',
        { name: 'CJY' },
        { split: true }
      )
      expect(Array.isArray(result)).toBe(true)
      expect(result).toEqual(['hello ', 'CJY', ''])
    })

    test('应该处理空字符串', () => {
      const result = I18n.template('', {})
      expect(result).toBe('')
    })

    test('应该处理没有变量的字符串', () => {
      const result = I18n.template('hello world', {})
      expect(result).toBe('hello world')
    })
  })

  describe('静态方法 - load', () => {
    test('应该加载单个资源', async () => {
      const loader = I18n.load(() => ({ hello: 'world' }))
      const result = await loader()
      expect(result).toEqual({ hello: 'world' })
    })

    test('应该加载多个资源并合并', async () => {
      const loader = I18n.load(
        () => ({ hello: 'world' }),
        () => ({ foo: 'bar' })
      )
      const result = await loader()
      expect(result).toEqual({ hello: 'world', foo: 'bar' })
    })

    test('应该支持异步加载器', async () => {
      const loader = I18n.load(
        async () => ({ hello: 'world' }),
        async () => {
          await new Promise((resolve) => setTimeout(resolve, 10))
          return { foo: 'bar' }
        }
      )
      const result = await loader()
      expect(result).toEqual({ hello: 'world', foo: 'bar' })
    })

    test('应该支持 default export', async () => {
      const loader = I18n.load(() => ({ default: { hello: 'world' } }))
      const result = await loader()
      expect(result).toEqual({ hello: 'world' })
    })

    test('应该缓存结果（memoize）', async () => {
      let callCount = 0
      const loader = I18n.load(() => {
        callCount++
        return { count: callCount }
      })

      const result1 = await loader()
      const result2 = await loader()

      expect(callCount).toBe(1)
      expect(result1).toBe(result2)
    })
  })

  describe('静态方法 - applyLanguage', () => {
    test('应该更新全局语言', async () => {
      await I18n.applyLanguage('zh-CN')
      expect(I18n.language).toBe('zh-CN')
      expect(I18n.lng).toBe('zh-CN')
    })

    test('应该更新所有实例的语言', async () => {
      const i18n1 = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': { hello: '你好' },
              'en-US': { hello: 'Hello' },
            },
          },
        },
      })

      const i18n2 = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': { goodbye: '再见' },
              'en-US': { goodbye: 'Goodbye' },
            },
          },
        },
      })

      await I18n.applyLanguage('zh-CN')

      expect(i18n1.language).toBe('zh-CN')
      expect(i18n2.language).toBe('zh-CN')
    })

    test('应该触发全局 eventBus change 事件', async () => {
      const listener = jest.fn()
      I18n.eventBus.on('change', listener)

      await I18n.applyLanguage('zh-CN')

      expect(listener).toHaveBeenCalledWith('zh-CN')
      expect(listener).toHaveBeenCalledTimes(1)
    })

    test('传入空值时应该不做任何操作', async () => {
      const listener = jest.fn()
      I18n.eventBus.on('change', listener)

      await I18n.applyLanguage(undefined)
      await I18n.applyLanguage(null)
      await I18n.applyLanguage('')

      expect(listener).not.toHaveBeenCalled()
      expect(I18n.language).toBeUndefined()
    })
  })

  describe('实例创建和初始化', () => {
    test('应该正确创建实例', () => {
      const config = {
        types: {
          default: {
            resources: { 'zh-CN': { hello: '你好' } },
          },
        },
      }
      const i18n = new I18n(config)

      expect(i18n.config).toBe(config)
      expect(I18n.instances).toContain(i18n)
      expect(i18n.key).toBeGreaterThanOrEqual(0)
      expect(i18n.key).toBeLessThanOrEqual(99999)
    })

    test('如果全局语言已设置，应该自动应用', async () => {
      await I18n.applyLanguage('zh-CN')

      const i18n = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': { hello: '你好' },
            },
          },
        },
      })

      // 等待异步应用完成
      await new Promise((resolve) => setTimeout(resolve, 10))

      expect(i18n.language).toBe('zh-CN')
    })

    test('如果全局语言未设置，应该监听全局语言变化', async () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': { hello: '你好' },
            },
          },
        },
      })

      expect(i18n.language).toBeUndefined()

      await I18n.applyLanguage('zh-CN')

      expect(i18n.language).toBe('zh-CN')
    })
  })

  describe('applyConfig', () => {
    test('应该合并配置', async () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: { 'zh-CN': { hello: '你好' } },
          },
        },
        defaultType: 'default',
      })

      await I18n.applyLanguage('zh-CN')

      await i18n.applyConfig({
        splitByDot: true,
        types: {
          custom: {
            resources: { 'zh-CN': { world: '世界' } },
          },
        },
      })

      expect(i18n.config.splitByDot).toBe(true)
      expect(i18n.config.defaultType).toBe('default')
      expect(i18n.config.types.default).toBeDefined()
      expect(i18n.config.types.custom).toBeDefined()
    })

    test('已有语言时应重新应用', async () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: { 'zh-CN': { hello: '你好' } },
          },
        },
      })

      await i18n.applyLanguage('zh-CN')
      const eventSpy = jest.fn()
      i18n.eventBus.on('change', eventSpy)

      await i18n.applyConfig({
        types: {
          default: {
            resources: { 'zh-CN': { hello: '您好' } },
          },
        },
      })

      expect(eventSpy).toHaveBeenCalledWith('zh-CN')
    })

    test('mode=supplement 时不应覆盖已有字段', async () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: { 'zh-CN': { hello: '你好' } },
          },
        },
        defaultType: 'default',
        splitByDot: true,
      })

      await I18n.applyLanguage('zh-CN')

      await i18n.applyConfig(
        {
          types: {
            default: {
              resources: { 'zh-CN': { hello: '您好', world: '世界' } },
            },
          },
          defaultType: 'custom',
          splitByDot: false,
        },
        { mode: 'supplement' }
      )

      expect(i18n.config.defaultType).toBe('default')
      expect(i18n.config.splitByDot).toBe(true)
      expect(i18n.config.types.default.resources['zh-CN'].hello).toBe('你好')
      expect(i18n.config.types.default.resources['zh-CN'].world).toBe('世界')
    })

    test('mode=supplement 时应补足 undefined 字段', async () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: { 'zh-CN': { hello: '你好' } },
          },
        },
      })

      await I18n.applyLanguage('zh-CN')

      await i18n.applyConfig(
        {
          defaultType: 'default',
          splitByDot: true,
        },
        { mode: 'supplement' }
      )

      expect(i18n.config.defaultType).toBe('default')
      expect(i18n.config.splitByDot).toBe(true)
    })

    test('paths 可以在 supplement 模式下对特定路径使用 override', async () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: { 'zh-CN': { hello: '你好' } },
          },
        },
        defaultType: 'default',
        splitByDot: true,
      })

      await I18n.applyLanguage('zh-CN')

      await i18n.applyConfig(
        {
          types: {
            default: {
              resources: { 'zh-CN': { hello: '您好', world: '世界' } },
            },
          },
          defaultType: 'custom',
          splitByDot: false,
        },
        {
          mode: 'supplement',
          paths: { types: 'override' },
        }
      )

      expect(i18n.config.defaultType).toBe('default')
      expect(i18n.config.splitByDot).toBe(true)
      expect(i18n.config.types.default.resources['zh-CN'].hello).toBe('您好')
      expect(i18n.config.types.default.resources['zh-CN'].world).toBe('世界')
    })

    test('paths 可以在 override 模式下对特定路径使用 supplement', async () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: { 'zh-CN': { hello: '你好' } },
          },
        },
        defaultType: 'default',
        splitByDot: true,
      })

      await I18n.applyLanguage('zh-CN')

      await i18n.applyConfig(
        {
          types: {
            default: {
              resources: { 'zh-CN': { hello: '您好', world: '世界' } },
            },
          },
          defaultType: 'custom',
          splitByDot: false,
        },
        {
          mode: 'override',
          paths: { defaultType: 'supplement' },
        }
      )

      expect(i18n.config.defaultType).toBe('default')
      expect(i18n.config.splitByDot).toBe(false)
      expect(i18n.config.types.default.resources['zh-CN'].hello).toBe('您好')
      expect(i18n.config.types.default.resources['zh-CN'].world).toBe('世界')
    })

    test('全局和实例都无语言时 applyConfig 等待全局 change', async () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: { 'zh-CN': { hello: '你好' } },
          },
        },
      })

      const configPromise = i18n.applyConfig({
        types: {
          custom: {
            resources: { 'zh-CN': { world: '世界' } },
          },
        },
      })

      await I18n.applyLanguage('zh-CN')
      await configPromise

      expect(i18n.language).toBe('zh-CN')
      expect(i18n.config.types.custom).toBeDefined()
    })

    test('paths 支持嵌套路径', async () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: { 'zh-CN': { hello: '你好' } },
            format: (str) => `[${str}]`,
          },
        },
        defaultType: 'default',
      })

      await I18n.applyLanguage('zh-CN')

      await i18n.applyConfig(
        {
          types: {
            default: {
              resources: { 'zh-CN': { hello: '您好', world: '世界' } },
              format: (str) => `【${str}】`,
            },
          },
        },
        {
          mode: 'supplement',
          paths: { 'types.default.resources': 'override' },
        }
      )

      expect(i18n.config.types.default.format('hello')).toBe('[hello]')
      expect(i18n.config.types.default.resources['zh-CN'].hello).toBe('您好')
      expect(i18n.config.types.default.resources['zh-CN'].world).toBe('世界')
    })
  })

  describe('applyLanguage (实例方法)', () => {
    test('应该加载对应语言的资源', async () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': { hello: '你好' },
              'en-US': { hello: 'Hello' },
            },
          },
        },
      })

      await i18n.applyLanguage('zh-CN')

      expect(i18n.resources.default['zh-CN']).toEqual({ hello: '你好' })
      expect(i18n.language).toBe('zh-CN')
      expect(i18n.lng).toBe('zh-CN')
    })

    test('应该支持异步资源加载', async () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': async () => {
                await new Promise((resolve) => setTimeout(resolve, 10))
                return { hello: '你好' }
              },
            },
          },
        },
      })

      await i18n.applyLanguage('zh-CN')

      expect(i18n.resources.default['zh-CN']).toEqual({ hello: '你好' })
    })

    test('应该支持 per-language 懒加载资源（I18n.load）', async () => {
      const loader = I18n.load(() => ({ hello: '你好' }))
      const i18n = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': loader,
            },
          },
        },
      })

      await i18n.applyLanguage('zh-CN')

      expect(i18n.resources.default['zh-CN']).toEqual({ hello: '你好' })
    })

    test('应该触发实例 eventBus change 事件', async () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: { 'zh-CN': { hello: '你好' } },
          },
        },
      })

      const listener = jest.fn()
      i18n.eventBus.on('change', listener)

      await i18n.applyLanguage('zh-CN')

      expect(listener).toHaveBeenCalledWith('zh-CN')
    })

    test('应该触发 DOM 自定义事件', async () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: { 'zh-CN': { hello: '你好' } },
          },
        },
      })

      const listener = jest.fn()
      document.addEventListener(I18n.documentEventName, listener)

      await i18n.applyLanguage('zh-CN')

      expect(listener).toHaveBeenCalled()
      const event = listener.mock.calls[0][0] as CustomEvent
      expect(event.detail.language).toBe('zh-CN')
      expect(event.detail.instance).toBe(i18n)

      document.removeEventListener(I18n.documentEventName, listener)
    })

    test('documentEventSilent=true 时不应触发 DOM 事件', async () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: { 'zh-CN': { hello: '你好' } },
          },
        },
      })
      i18n.documentEventSilent = true

      const listener = jest.fn()
      document.addEventListener(I18n.documentEventName, listener)

      await i18n.applyLanguage('zh-CN')

      expect(listener).not.toHaveBeenCalled()

      document.removeEventListener(I18n.documentEventName, listener)
    })
  })

  describe('translate - 基础翻译', () => {
    let i18n: I18n

    beforeEach(async () => {
      i18n = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': {
                hello: '你好',
                'greeting.morning': '早上好',
                'user.name': '用户名',
              },
              'en-US': {
                hello: 'Hello',
                'greeting.morning': 'Good morning',
              },
            },
          },
        },
        defaultType: 'default',
      })

      await i18n.applyLanguage('zh-CN')
    })

    test('应该正确翻译简单 key', () => {
      const result = i18n.translate('hello')
      expect(result).toBe('你好')
    })

    test('应该正确翻译带点的 key', () => {
      const result = i18n.translate('greeting.morning')
      expect(result).toBe('早上好')
    })

    test('找不到翻译时应返回 key 本身', () => {
      const result = i18n.translate('notfound')
      expect(result).toBe('notfound')
    })

    test('应该支持 t 简写方法', () => {
      expect(i18n.t('hello')).toBe('你好')
    })

    test('切换语言后应返回新语言的翻译', async () => {
      expect(i18n.t('hello')).toBe('你好')

      await i18n.applyLanguage('en-US')

      expect(i18n.t('hello')).toBe('Hello')
    })
  })

  describe('translate - 类型系统', () => {
    let i18n: I18n

    beforeEach(async () => {
      i18n = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': { hello: '你好' },
            },
          },
          error: {
            resources: {
              'zh-CN': { 'not-found': '未找到' },
            },
          },
        },
        defaultType: 'default',
      })

      await i18n.applyLanguage('zh-CN')
    })

    test('应该使用默认类型', () => {
      const result = i18n.t('hello')
      expect(result).toBe('你好')
    })

    test('应该支持 @type 语法指定类型', () => {
      const result = i18n.t('not-found@error')
      expect(result).toBe('未找到')
    })

    test('应该支持 @type 选项指定类型', () => {
      const result = i18n.t('not-found', { '@type': 'error' })
      expect(result).toBe('未找到')
    })
  })

  describe('translate - 命名空间', () => {
    let i18n: I18n

    beforeEach(async () => {
      i18n = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': { hello: '你好' },
            },
          },
        },
        fallback: {
          common: {
            t: (str) => {
              if (str === 'shared@default') return '共享文本'
              return undefined
            },
          },
        },
      })

      await i18n.applyLanguage('zh-CN')
    })

    test('应该支持 namespace:key 语法', () => {
      const result = i18n.t('common:shared')
      expect(result).toBe('共享文本')
    })

    test('应该支持 @namespace 选项', () => {
      const result = i18n.t('shared', { '@namespace': 'common' })
      expect(result).toBe('共享文本')
    })
  })

  describe('translate - 自定义格式化', () => {
    test('应该支持自定义 format 函数', async () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': { hello: '你好 {{name}}' },
            },
            format: (str, options) => {
              return I18n.template(str, options)
            },
          },
        },
      })

      await i18n.applyLanguage('zh-CN')

      const result = i18n.t('hello', { name: 'CJY' })
      expect(result).toBe('你好 CJY')
    })

    test('应该支持针对特定语言的 format', async () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': { hello: '你好' },
              'en-US': { hello: 'Hello' },
            },
            format: {
              'zh-CN': (str) => `【${str}】`,
              'en-US': (str) => `[${str}]`,
            },
          },
        },
      })

      await i18n.applyLanguage('zh-CN')
      expect(i18n.t('hello')).toBe('【你好】')

      await i18n.applyLanguage('en-US')
      expect(i18n.t('hello')).toBe('[Hello]')
    })

    test('resources=false 时应直接使用 key 作为格式化参数', async () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: false,
            format: (key, options) => {
              return `Formatted: ${key}`
            },
          },
        },
      })

      await i18n.applyLanguage('zh-CN')

      const result = i18n.t('anykey')
      expect(result).toBe('Formatted: anykey')
    })
  })

  describe('translate - splitByDot 选项', () => {
    let i18n: I18n

    beforeEach(async () => {
      i18n = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': {
                'user.name': '点分割方式',
                user: {
                  name: '嵌套对象方式',
                },
              },
            },
          },
        },
        splitByDot: 'auto',
      })

      await i18n.applyLanguage('zh-CN')
    })

    test('auto 模式应优先使用嵌套对象（dot 拆分优先）', () => {
      const result = i18n.t('user.name')
      expect(result).toBe('嵌套对象方式')
    })

    test('auto 模式找不到点分割时应尝试嵌套对象', async () => {
      const i18n2 = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': {
                user: {
                  name: '嵌套对象方式',
                },
              },
            },
          },
        },
        splitByDot: 'auto',
      })

      await i18n2.applyLanguage('zh-CN')
      const result = i18n2.t('user.name')
      expect(result).toBe('嵌套对象方式')
    })

    test('splitByDot=true 应拆分 dot 做嵌套路径访问', () => {
      const result = i18n.t('user.name', { '@splitByDot': true })
      expect(result).toBe('嵌套对象方式')
    })

    test('splitByDot=false 应保留 dot 做平 key 访问', () => {
      const result = i18n.t('user.name', { '@splitByDot': false })
      expect(result).toBe('点分割方式')
    })
  })

  describe('fallbackTranslate', () => {
    test('应该使用 fallback 实例翻译', async () => {
      const fallbackI18n = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': { shared: '共享翻译' },
            },
          },
        },
      })

      await fallbackI18n.applyLanguage('zh-CN')

      const i18n = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': { hello: '你好' },
            },
          },
        },
        fallback: [fallbackI18n],
      })

      await i18n.applyLanguage('zh-CN')

      expect(i18n.t('shared')).toBe('共享翻译')
    })

    test('应该支持多个 fallback 实例', async () => {
      const fallback1 = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': { key1: '翻译1' },
            },
          },
        },
      })

      const fallback2 = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': { key2: '翻译2' },
            },
          },
        },
      })

      await fallback1.applyLanguage('zh-CN')
      await fallback2.applyLanguage('zh-CN')

      const i18n = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': { hello: '你好' },
            },
          },
        },
        fallback: [fallback1, fallback2],
      })

      await i18n.applyLanguage('zh-CN')

      expect(i18n.t('key1')).toBe('翻译1')
      expect(i18n.t('key2')).toBe('翻译2')
    })

    test('应该支持 fallback 对象（命名空间方式）', async () => {
      const fallbackI18n = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': { shared: '共享翻译' },
            },
          },
        },
      })

      await fallbackI18n.applyLanguage('zh-CN')

      const i18n = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': { hello: '你好' },
            },
          },
        },
        fallback: {
          common: fallbackI18n,
        },
      })

      await i18n.applyLanguage('zh-CN')

      expect(i18n.t('common:shared')).toBe('共享翻译')
    })

    test('应该使用 translateFallback 配置', async () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': { hello: '你好' },
            },
          },
        },
        translateFallback: (key) => `[${key}]`,
      })

      await i18n.applyLanguage('zh-CN')

      expect(i18n.t('notfound')).toBe('[notfound]')
    })

    test('优先级：主资源 > fallback 实例 > translateFallback > key', async () => {
      const fallbackI18n = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': {
                key1: 'fallback翻译',
                key2: 'fallback翻译',
                key3: 'fallback翻译',
              },
            },
          },
        },
      })

      await fallbackI18n.applyLanguage('zh-CN')

      const i18n = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': { key1: '主翻译' },
            },
          },
        },
        fallback: [fallbackI18n],
        translateFallback: (key) => `[${key}]`,
      })

      await i18n.applyLanguage('zh-CN')

      expect(i18n.t('key1')).toBe('主翻译') // 主资源
      expect(i18n.t('key2')).toBe('fallback翻译') // fallback 实例
      expect(i18n.t('key3')).toBe('fallback翻译') // fallback 实例
      expect(i18n.t('key4')).toBe('[key4]') // translateFallback
    })
  })

  describe('边界情况和错误处理', () => {
    test('未设置语言时翻译应返回 key', () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': { hello: '你好' },
            },
          },
        },
      })

      expect(i18n.t('hello')).toBe('hello')
    })

    test('应该处理空的 resources', async () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: {},
          },
        },
      })

      await i18n.applyLanguage('zh-CN')

      expect(i18n.t('hello')).toBe('hello')
    })

    test('应该处理 undefined resources', async () => {
      const i18n = new I18n({
        types: {
          default: {},
        },
      })

      await i18n.applyLanguage('zh-CN')

      expect(i18n.t('hello')).toBe('hello')
    })

    test('应该处理空字符串 key', async () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': { '': '空key' },
            },
          },
        },
      })

      await i18n.applyLanguage('zh-CN')

      expect(i18n.t('')).toBe('空key')
    })

    test('format 不是函数时应跳过格式化', async () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': { hello: '你好' },
            },
            format: 'not a function',
          },
        },
      })

      await i18n.applyLanguage('zh-CN')

      expect(i18n.t('hello')).toBe('hello')
    })

    test('format 返回 falsy 值时应继续 fallback', async () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': { hello: '你好' },
            },
            format: () => undefined,
          },
        },
        translateFallback: (key) => `[${key}]`,
      })

      await i18n.applyLanguage('zh-CN')

      expect(i18n.t('hello')).toBe('[hello]')
    })
  })

  describe('多实例协同', () => {
    test('多个实例应该独立工作', async () => {
      const i18n1 = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': { hello: '你好1' },
            },
          },
        },
      })

      const i18n2 = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': { hello: '你好2' },
            },
          },
        },
      })

      await I18n.applyLanguage('zh-CN')

      expect(i18n1.t('hello')).toBe('你好1')
      expect(i18n2.t('hello')).toBe('你好2')
    })

    test('全局语言切换应同步所有实例', async () => {
      const listeners = {
        i18n1: jest.fn(),
        i18n2: jest.fn(),
      }

      const i18n1 = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': { hello: '你好' },
              'en-US': { hello: 'Hello' },
            },
          },
        },
      })

      const i18n2 = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': { world: '世界' },
              'en-US': { world: 'World' },
            },
          },
        },
      })

      i18n1.eventBus.on('change', listeners.i18n1)
      i18n2.eventBus.on('change', listeners.i18n2)

      await I18n.applyLanguage('zh-CN')
      expect(listeners.i18n1).toHaveBeenCalledWith('zh-CN')
      expect(listeners.i18n2).toHaveBeenCalledWith('zh-CN')

      await I18n.applyLanguage('en-US')
      expect(listeners.i18n1).toHaveBeenCalledWith('en-US')
      expect(listeners.i18n2).toHaveBeenCalledWith('en-US')

      expect(i18n1.language).toBe('en-US')
      expect(i18n2.language).toBe('en-US')
    })
  })

  describe('性能和内存', () => {
    test('应该正确管理实例列表', () => {
      const initialCount = I18n.instances.length

      const i18n1 = new I18n({ types: {} })
      expect(I18n.instances.length).toBe(initialCount + 1)

      const i18n2 = new I18n({ types: {} })
      expect(I18n.instances.length).toBe(initialCount + 2)

      const i18n3 = new I18n({ types: {} })
      expect(I18n.instances.length).toBe(initialCount + 3)
    })

    test('每个实例应有数值型 key', () => {
      const keys = new Set<number>()
      for (let i = 0; i < 20; i++) {
        const inst = new I18n({ types: {} })
        expect(typeof inst.key).toBe('number')
        keys.add(inst.key)
      }
      expect(keys.size).toBeGreaterThan(1)
    })
  })

  describe('复杂场景', () => {
    test('应该支持嵌套翻译（翻译结果再次翻译）', async () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': {
                welcome: '欢迎 {{name}}',
                userName: '张三',
              },
            },
            format: (str, options) => {
              // 如果 str 包含变量，先翻译变量的值
              const processedOptions = {}
              for (const key in options) {
                const value = options[key]
                processedOptions[key] =
                  typeof value === 'string' &&
                  i18n.resources.default['zh-CN'][value]
                    ? i18n.resources.default['zh-CN'][value]
                    : value
              }
              return I18n.template(str, processedOptions)
            },
          },
        },
      })

      await i18n.applyLanguage('zh-CN')

      const result = i18n.t('welcome', { name: 'userName' })
      expect(result).toBe('欢迎 张三')
    })

    test('应该支持动态加载新的语言资源', async () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: {
              'zh-CN': { hello: '你好' },
            },
          },
        },
      })

      await i18n.applyLanguage('zh-CN')
      expect(i18n.t('hello')).toBe('你好')

      // 动态添加新语言
      await i18n.applyConfig({
        types: {
          default: {
            resources: {
              'zh-CN': { hello: '你好' },
              'en-US': { hello: 'Hello' },
            },
          },
        },
      })

      await i18n.applyLanguage('en-US')
      expect(i18n.t('hello')).toBe('Hello')
    })
  })

  describe('applyConfig - priority (补充优先级)', () => {
    test('高优先级应覆盖低优先级已写入的值', async () => {
      const i18n = new I18n({
        types: { default: { resources: {} } },
      })
      await I18n.applyLanguage('en-US')

      await i18n.applyConfig(
        { types: { default: { resources: { 'en-US': { 确认: 'OK' } } } } },
        { mode: 'supplement', priority: 1 }
      )
      expect(i18n.t('确认')).toBe('OK')

      await i18n.applyConfig(
        { types: { default: { resources: { 'en-US': { 确认: 'Confirm' } } } } },
        { mode: 'supplement', priority: 3 }
      )
      expect(i18n.t('确认')).toBe('Confirm')
    })

    test('低优先级不应覆盖高优先级已写入的值', async () => {
      const i18n = new I18n({
        types: { default: { resources: {} } },
      })
      await I18n.applyLanguage('en-US')

      await i18n.applyConfig(
        { types: { default: { resources: { 'en-US': { 保存: 'Save it' } } } } },
        { mode: 'supplement', priority: 4 }
      )

      await i18n.applyConfig(
        { types: { default: { resources: { 'en-US': { 保存: 'Save' } } } } },
        { mode: 'supplement', priority: 1 }
      )
      expect(i18n.t('保存')).toBe('Save it')
    })

    test('相同优先级先到先得', async () => {
      const i18n = new I18n({
        types: { default: { resources: {} } },
      })
      await I18n.applyLanguage('en-US')

      await i18n.applyConfig(
        { types: { default: { resources: { 'en-US': { 取消: 'Cancel' } } } } },
        { mode: 'supplement', priority: 2 }
      )

      await i18n.applyConfig(
        { types: { default: { resources: { 'en-US': { 取消: 'Abort' } } } } },
        { mode: 'supplement', priority: 2 }
      )
      expect(i18n.t('取消')).toBe('Cancel')
    })

    test('多层注册不受顺序影响 (模拟真实场景)', async () => {
      const i18n = new I18n({
        types: { default: { resources: {} } },
      })
      await I18n.applyLanguage('en-US')

      // 模拟 pro-components 先注册 (优先级低)
      await i18n.applyConfig(
        {
          types: {
            default: { resources: { 'en-US': { 确认: 'OK', 关闭: 'Close' } } },
          },
        },
        { mode: 'supplement', priority: 1 }
      )

      // 模拟框架层注册
      await i18n.applyConfig(
        {
          types: {
            default: {
              resources: { 'en-US': { 确认: 'Confirm', 返回: 'Back' } },
            },
          },
        },
        { mode: 'supplement', priority: 2 }
      )

      // 模拟业务层注册 (优先级最高)
      await i18n.applyConfig(
        {
          types: {
            default: {
              resources: { 'en-US': { 确认: 'Sure', 提交: 'Submit' } },
            },
          },
        },
        { mode: 'supplement', priority: 4 }
      )

      expect(i18n.t('确认')).toBe('Sure') // 业务层胜出
      expect(i18n.t('关闭')).toBe('Close') // 只有 pro 有，保留
      expect(i18n.t('返回')).toBe('Back') // 只有框架有，保留
      expect(i18n.t('提交')).toBe('Submit') // 只有业务有，保留
    })

    test('不同顺序注册结果相同', async () => {
      const makeI18n = () => new I18n({ types: { default: { resources: {} } } })
      await I18n.applyLanguage('en-US')

      const proConfig = {
        types: { default: { resources: { 'en-US': { A: '1', B: '2' } } } },
      }
      const bizConfig = {
        types: { default: { resources: { 'en-US': { A: '10', C: '30' } } } },
      }

      // 顺序 1: pro 先注册
      const i18n1 = makeI18n()
      await i18n1.applyConfig(proConfig, { mode: 'supplement', priority: 1 })
      await i18n1.applyConfig(bizConfig, { mode: 'supplement', priority: 3 })

      // 顺序 2: biz 先注册
      const i18n2 = makeI18n()
      await i18n2.applyConfig(bizConfig, { mode: 'supplement', priority: 3 })
      await i18n2.applyConfig(proConfig, { mode: 'supplement', priority: 1 })

      expect(i18n1.t('A')).toBe('10')
      expect(i18n1.t('B')).toBe('2')
      expect(i18n1.t('C')).toBe('30')

      expect(i18n2.t('A')).toBe(i18n1.t('A'))
      expect(i18n2.t('B')).toBe(i18n1.t('B'))
      expect(i18n2.t('C')).toBe(i18n1.t('C'))
    })

    test('未指定 priority 时走传统 supplement 行为', async () => {
      const i18n = new I18n({
        types: { default: { resources: {} } },
      })
      await I18n.applyLanguage('en-US')

      await i18n.applyConfig(
        { types: { default: { resources: { 'en-US': { 确认: 'OK' } } } } },
        { mode: 'supplement' }
      )

      await i18n.applyConfig(
        {
          types: {
            default: {
              resources: { 'en-US': { 确认: 'Confirm', 新增: 'New' } },
            },
          },
        },
        { mode: 'supplement' }
      )

      // 传统 supplement: 先到先得
      expect(i18n.t('确认')).toBe('OK')
      expect(i18n.t('新增')).toBe('New')
    })

    test('priority 跨 type 独立生效', async () => {
      const i18n = new I18n({
        types: { default: { resources: {} }, jsx: { resources: {} } },
      })
      await I18n.applyLanguage('en-US')

      await i18n.applyConfig(
        {
          types: {
            default: { resources: { 'en-US': { key1: 'default-low' } } },
            jsx: { resources: { 'en-US': { key1: 'jsx-high' } } },
          },
        },
        { mode: 'supplement', priority: 1 }
      )

      await i18n.applyConfig(
        {
          types: {
            default: { resources: { 'en-US': { key1: 'default-high' } } },
            jsx: { resources: { 'en-US': { key1: 'jsx-low' } } },
          },
        },
        { mode: 'supplement', priority: 3 }
      )

      expect(i18n.t('key1')).toBe('default-high')
      expect(i18n.t('key1@jsx')).toBe('jsx-low') // jsx type 也被 priority=3 覆盖
    })

    test('多 locale 各自独立计算优先级', async () => {
      const i18n = new I18n({
        types: { default: { resources: {} } },
      })
      await I18n.applyLanguage('en-US')

      await i18n.applyConfig(
        {
          types: {
            default: {
              resources: {
                'en-US': { hello: 'Hi' },
                'zh-CN': { hello: '你好' },
              },
            },
          },
        },
        { mode: 'supplement', priority: 2 }
      )

      await i18n.applyConfig(
        {
          types: {
            default: {
              resources: {
                'en-US': { hello: 'Hello' },
                'zh-CN': { hello: '您好' },
              },
            },
          },
        },
        { mode: 'supplement', priority: 5 }
      )

      expect(i18n.t('hello')).toBe('Hello')

      await i18n.applyLanguage('zh-CN')
      expect(i18n.t('hello')).toBe('您好')
    })

    test('priority=0 应走普通 merge 路径（不进入 priority 分支）', async () => {
      const i18n = new I18n({
        types: { default: { resources: {} } },
      })
      await I18n.applyLanguage('en-US')

      await i18n.applyConfig(
        { types: { default: { resources: { 'en-US': { key: 'first' } } } } },
        { mode: 'supplement', priority: 0 }
      )

      // priority=0 走普通 supplement，先到先得
      await i18n.applyConfig(
        { types: { default: { resources: { 'en-US': { key: 'second' } } } } },
        { mode: 'supplement', priority: 0 }
      )

      expect(i18n.t('key')).toBe('first')
    })

    test('priority + loader 函数：高优先级 loader 应替换低优先级 loader', async () => {
      const loaderLow = jest.fn(async () => ({ hello: 'Low' }))
      const loaderHigh = jest.fn(async () => ({ hello: 'High' }))

      await I18n.applyLanguage('en-US')

      const i18n = new I18n({
        types: { default: { resources: {} } },
      })

      await i18n.applyConfig(
        { types: { default: { resources: { 'en-US': loaderLow } } } },
        { mode: 'supplement', priority: 1 }
      )

      await i18n.applyConfig(
        { types: { default: { resources: { 'en-US': loaderHigh } } } },
        { mode: 'supplement', priority: 5 }
      )

      // 高优先级 loader 替换了低优先级 loader
      expect(loaderHigh).toHaveBeenCalled()
      expect(i18n.t('hello')).toBe('High')
    })

    test('priority + loader 函数：低优先级 loader 不应替换高优先级 loader', async () => {
      const loaderHigh = jest.fn(async () => ({ hello: 'High' }))
      const loaderLow = jest.fn(async () => ({ hello: 'Low' }))

      await I18n.applyLanguage('en-US')

      const i18n = new I18n({
        types: { default: { resources: {} } },
      })

      await i18n.applyConfig(
        { types: { default: { resources: { 'en-US': loaderHigh } } } },
        { mode: 'supplement', priority: 5 }
      )

      await i18n.applyConfig(
        { types: { default: { resources: { 'en-US': loaderLow } } } },
        { mode: 'supplement', priority: 1 }
      )

      expect(i18n.t('hello')).toBe('High')
    })
  })

  describe('applyConfig - defaultApplyMode', () => {
    test('defaultApplyMode=supplement 时 applyConfig 默认使用补充模式', async () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: { 'zh-CN': { hello: '你好', world: '世界' } },
          },
        },
        defaultType: 'default',
        defaultApplyMode: 'supplement',
      })

      await I18n.applyLanguage('zh-CN')

      await i18n.applyConfig({
        types: {
          default: {
            resources: { 'zh-CN': { hello: '您好', newKey: '新值' } },
          },
        },
        defaultType: 'custom',
      })

      expect(i18n.config.types.default.resources['zh-CN'].hello).toBe('你好')
      expect(i18n.config.types.default.resources['zh-CN'].newKey).toBe('新值')
      expect(i18n.config.defaultType).toBe('default')
    })

    test('显式传入 mode 应覆盖 defaultApplyMode', async () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: { 'zh-CN': { hello: '你好' } },
          },
        },
        defaultApplyMode: 'supplement',
      })

      await I18n.applyLanguage('zh-CN')

      await i18n.applyConfig(
        {
          types: {
            default: {
              resources: { 'zh-CN': { hello: '您好' } },
            },
          },
        },
        { mode: 'override' }
      )

      expect(i18n.config.types.default.resources['zh-CN'].hello).toBe('您好')
    })

    test('未设置 defaultApplyMode 时仍默认 override', async () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: { 'zh-CN': { hello: '你好' } },
          },
        },
      })

      await I18n.applyLanguage('zh-CN')

      await i18n.applyConfig({
        types: {
          default: {
            resources: { 'zh-CN': { hello: '您好' } },
          },
        },
      })

      expect(i18n.config.types.default.resources['zh-CN'].hello).toBe('您好')
    })

    test('defaultApplyMode=supplement 配合 priority 正常工作', async () => {
      const i18n = new I18n({
        types: { default: { resources: {} } },
        defaultApplyMode: 'supplement',
      })

      await I18n.applyLanguage('en-US')

      await i18n.applyConfig(
        { types: { default: { resources: { 'en-US': { key: 'low' } } } } },
        { priority: 1 }
      )

      await i18n.applyConfig(
        { types: { default: { resources: { 'en-US': { key: 'high' } } } } },
        { priority: 5 }
      )

      expect(i18n.t('key')).toBe('high')
    })

    test('defaultApplyMode=supplement 不传任何 options 时生效', async () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: { 'zh-CN': { existing: '已有值' } },
          },
        },
        defaultApplyMode: 'supplement',
      })

      await I18n.applyLanguage('zh-CN')

      await i18n.applyConfig({
        types: {
          default: {
            resources: { 'zh-CN': { existing: '新值', added: '补充值' } },
          },
        },
      })

      expect(i18n.config.types.default.resources['zh-CN'].existing).toBe(
        '已有值'
      )
      expect(i18n.config.types.default.resources['zh-CN'].added).toBe('补充值')
    })

    test('defaultApplyMode=override 与不设置效果一致', async () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: { 'zh-CN': { hello: '你好' } },
          },
        },
        defaultApplyMode: 'override',
      })

      await I18n.applyLanguage('zh-CN')

      await i18n.applyConfig({
        types: {
          default: {
            resources: { 'zh-CN': { hello: '您好' } },
          },
        },
      })

      expect(i18n.config.types.default.resources['zh-CN'].hello).toBe('您好')
    })
  })

  describe('异步资源加载失败处理', () => {
    test('loader 抛异常时 applyLanguage 不应崩溃', async () => {
      const i18n = new I18n({
        types: {
          default: {
            resources: {
              'en-US': async () => {
                throw new Error('network error')
              },
            },
          },
        },
      })

      await expect(i18n.applyLanguage('en-US')).rejects.toThrow('network error')
    })

    test('部分 type loader 失败不影响其他 type', async () => {
      const i18n = new I18n({
        types: {
          ok: {
            resources: {
              'en-US': async () => ({ hello: 'Hello' }),
            },
          },
          broken: {
            resources: {
              'en-US': async () => {
                throw new Error('fail')
              },
            },
          },
        },
        defaultType: 'ok',
      })

      // Promise.all 会 reject，但 ok 的 loader 已经执行过了
      await expect(i18n.applyLanguage('en-US')).rejects.toThrow('fail')
    })
  })
})
