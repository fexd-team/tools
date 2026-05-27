import merge from '../merge'

describe('merge', () => {
  // ═══════════════════════════════════════════════════════
  //  基础行为 - 与旧版对齐 (override 模式，默认行为)
  // ═══════════════════════════════════════════════════════
  describe('基础行为 - 与旧版对齐 (override 模式)', () => {
    test('应合并两个扁平对象', () => {
      expect(merge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 })
    })

    test('source 应覆盖 target 同名字段', () => {
      expect(merge({ a: 1, b: 2 }, { b: 3, c: 4 })).toEqual({
        a: 1,
        b: 3,
        c: 4,
      })
    })

    test('应递归合并嵌套对象', () => {
      expect(merge({ a: { x: 1, y: 2 } }, { a: { y: 3, z: 4 } })).toEqual({
        a: { x: 1, y: 3, z: 4 },
      })
    })

    test('深层嵌套应递归覆盖', () => {
      expect(merge({ a: { b: { c: 1 } } }, { a: { b: { c: 2 } } })).toEqual({
        a: { b: { c: 2 } },
      })
    })

    test('目标为非对象值时源对象覆盖', () => {
      expect(merge({ a: 'string' }, { a: { x: 1 } })).toEqual({ a: { x: 1 } })
    })

    test('源为非对象值时直接覆盖', () => {
      expect(merge({ a: { x: 1 } }, { a: 'string' })).toEqual({ a: 'string' })
    })

    test('数组应被视为值直接替换 (默认 replace)', () => {
      expect(merge({ a: [1, 2] }, { a: [3, 4] })).toEqual({ a: [3, 4] })
    })

    test('空对象合并', () => {
      expect(merge({}, { a: 1 })).toEqual({ a: 1 })
    })

    test('合并到空对象', () => {
      expect(merge({ a: 1 }, {})).toEqual({ a: 1 })
    })

    test('两个空对象', () => {
      expect(merge({}, {})).toEqual({})
    })

    test('会就地修改 target 并返回 (默认行为)', () => {
      const target = { a: 1 }
      const result = merge(target, { b: 2 })
      expect(result).toBe(target)
      expect(target).toEqual({ a: 1, b: 2 })
    })
  })

  // ═══════════════════════════════════════════════════════
  //  supplement 模式
  // ═══════════════════════════════════════════════════════
  describe('supplement 模式', () => {
    test('不应覆盖已有字段', () => {
      const result = merge(
        { a: 1, b: 2 },
        { b: 3, c: 4 },
        { mode: 'supplement' }
      )
      expect(result).toEqual({ a: 1, b: 2, c: 4 })
    })

    test('应补足 undefined 字段', () => {
      const result = merge(
        { a: undefined },
        { a: 1, b: 2 },
        { mode: 'supplement' }
      )
      expect(result).toEqual({ a: 1, b: 2 })
    })

    test('已有字段保持原值，包括 falsy 值 0/""/false', () => {
      const result = merge(
        { a: 0, b: '', c: false },
        { a: 1, b: 'val', c: true, d: 'new' },
        { mode: 'supplement' }
      )
      expect(result).toEqual({ a: 0, b: '', c: false, d: 'new' })
    })

    test('null 值不应被覆盖', () => {
      const result = merge({ a: null }, { a: 1 }, { mode: 'supplement' })
      expect(result.a).toBeNull()
    })

    test('嵌套对象应递归 supplement', () => {
      const result = merge(
        { a: { x: 1, y: 2 } },
        { a: { y: 3, z: 4 } },
        { mode: 'supplement' }
      )
      expect(result).toEqual({ a: { x: 1, y: 2, z: 4 } })
    })

    test('深层嵌套应递归 supplement', () => {
      const result = merge(
        { a: { b: { c: 1 } } },
        { a: { b: { c: 2, d: 3 } } },
        { mode: 'supplement' }
      )
      expect(result).toEqual({ a: { b: { c: 1, d: 3 } } })
    })

    test('目标为非对象值时 source 为对象也不覆盖', () => {
      const result = merge(
        { a: 'string' },
        { a: { x: 1 } },
        { mode: 'supplement' }
      )
      expect(result).toEqual({ a: 'string' })
    })

    test('目标为 undefined 时源为对象应补足', () => {
      const result = merge(
        { a: undefined },
        { a: { x: 1 } },
        { mode: 'supplement' }
      )
      expect(result).toEqual({ a: { x: 1 } })
    })

    test('supplement 模式下数组也不覆盖已有', () => {
      const result = merge({ a: [1, 2] }, { a: [3, 4] }, { mode: 'supplement' })
      expect(result).toEqual({ a: [1, 2] })
    })

    test('supplement 模式下空数组应补足', () => {
      const result = merge({ a: [] }, { a: [1, 2] }, { mode: 'supplement' })
      expect(result).toEqual({ a: [1, 2] })
    })
  })

  // ═══════════════════════════════════════════════════════
  //  paths 细粒度控制
  // ═══════════════════════════════════════════════════════
  describe('paths 细粒度控制', () => {
    test('supplement 模式下 paths 指定字段 override', () => {
      const result = merge(
        { a: 1, b: { x: 1, y: 2 } },
        { a: 10, b: { x: 10, y: 20 } },
        { mode: 'supplement', paths: { a: 'override' } }
      )
      expect(result).toEqual({ a: 10, b: { x: 1, y: 2 } })
    })

    test('override 模式下 paths 指定字段 supplement', () => {
      const result = merge(
        { a: 1, b: { x: 1, y: 2 } },
        { a: 10, b: { x: 10, y: 20 } },
        { mode: 'override', paths: { a: 'supplement' } }
      )
      expect(result).toEqual({ a: 1, b: { x: 10, y: 20 } })
    })

    test('paths 支持嵌套路径 override', () => {
      const result = merge(
        {
          config: {
            types: {
              default: { format: 'old', resources: { en: 'old-en' } },
            },
          },
        },
        {
          config: {
            types: {
              default: { format: 'new', resources: { en: 'new-en', zh: 'zh' } },
            },
          },
        },
        {
          mode: 'supplement',
          paths: { 'config.types.default.resources': 'override' },
        }
      )
      expect(result.config.types.default.format).toBe('old')
      expect(result.config.types.default.resources.en).toBe('new-en')
      expect((result.config.types.default.resources as any).zh).toBe('zh')
    })

    test('paths 中多个路径指定不同策略', () => {
      const result = merge(
        { a: 1, b: 2, c: 3 },
        { a: 10, b: 20, c: 30 },
        { mode: 'supplement', paths: { a: 'override', c: 'override' } }
      )
      expect(result).toEqual({ a: 10, b: 2, c: 30 })
    })

    test('paths 嵌套路径在递归中正确传递 (supplement 下局部 override)', () => {
      const result = merge(
        {
          level1: {
            level2: { keepField: 'keep', overrideField: 'old' },
            otherField: 'old',
          },
        },
        {
          level1: {
            level2: { keepField: 'new', overrideField: 'new' },
            otherField: 'new',
          },
        },
        {
          mode: 'supplement',
          paths: { 'level1.level2.overrideField': 'override' },
        }
      )
      expect(result.level1.otherField).toBe('old')
      expect(result.level1.level2.keepField).toBe('keep')
      expect(result.level1.level2.overrideField).toBe('new')
    })

    test('paths 不匹配任何字段时使用默认 mode', () => {
      const result = merge(
        { a: 1 },
        { a: 2 },
        { mode: 'supplement', paths: { b: 'override' } }
      )
      expect(result.a).toBe(1)
    })
  })

  // ═══════════════════════════════════════════════════════
  //  clone 模式 (不修改原对象)
  // ═══════════════════════════════════════════════════════
  describe('clone 模式', () => {
    test('clone=true 时不应修改 target', () => {
      const target = { a: 1, b: { c: 2 } }
      const targetCopy = JSON.parse(JSON.stringify(target))
      merge(target, { b: { d: 3 } }, { clone: true })
      expect(target).toEqual(targetCopy)
    })

    test('clone=true 时结果应包含合后的值', () => {
      const result = merge({ a: 1 }, { b: 2 }, { clone: true })
      expect(result).toEqual({ a: 1, b: 2 })
    })

    test('clone=true 嵌套对象也应合并', () => {
      const result = merge({ a: { x: 1 } }, { a: { y: 2 } }, { clone: true })
      expect(result).toEqual({ a: { x: 1, y: 2 } })
    })

    test('clone=false (默认) 应就地修改', () => {
      const target = { a: 1 }
      const result = merge(target, { b: 2 })
      expect(result).toBe(target)
    })

    test('clone=true 返回值不是同一个引用', () => {
      const target = { a: 1 }
      const result = merge(target, { b: 2 }, { clone: true })
      expect(result).not.toBe(target)
    })

    test('clone=true 与 supplement 组合', () => {
      const target = { a: 1 }
      const targetCopy = JSON.parse(JSON.stringify(target))
      const result = merge(
        target,
        { a: 10, b: 2 },
        { clone: true, mode: 'supplement' }
      )
      expect(target).toEqual(targetCopy)
      expect(result).toEqual({ a: 1, b: 2 })
    })
  })

  // ═══════════════════════════════════════════════════════
  //  arrayMerge 策略
  // ═══════════════════════════════════════════════════════
  describe('arrayMerge 策略', () => {
    test('默认 (replace) 数组整体替换', () => {
      const result = merge({ a: [1, 2] }, { a: [3, 4] })
      expect(result).toEqual({ a: [3, 4] })
    })

    test('replace 显式指定数组替换', () => {
      const result = merge(
        { a: [1, 2] },
        { a: [3, 4] },
        { arrayMerge: 'replace' }
      )
      expect(result).toEqual({ a: [3, 4] })
    })

    test('concat 拼接数组', () => {
      const result = merge(
        { a: [1, 2] },
        { a: [3, 4] },
        { arrayMerge: 'concat' }
      )
      expect(result).toEqual({ a: [1, 2, 3, 4] })
    })

    test('concat 对嵌套数组中的数组', () => {
      const result = merge(
        { a: { items: [1, 2] } },
        { a: { items: [3, 4] } },
        { arrayMerge: 'concat' }
      )
      expect(result).toEqual({ a: { items: [1, 2, 3, 4] } })
    })

    test('combine 按索引合并数组中的对象', () => {
      const result = merge(
        { items: [{ id: 1, name: 'a' }] },
        { items: [{ id: 2, score: 100 }] },
        { arrayMerge: 'combine' }
      )
      expect(result).toEqual({ items: [{ id: 2, name: 'a', score: 100 }] })
    })

    test('combine source 较长时补足额外元素', () => {
      const result = merge(
        { items: [{ id: 1 }] },
        { items: [{ id: 2 }, { id: 3 }] },
        { arrayMerge: 'combine' }
      )
      expect(result).toEqual({ items: [{ id: 2 }, { id: 3 }] })
    })

    test('combine source 较短时保留 target 多余元素', () => {
      const result = merge(
        { items: [{ id: 1 }, { id: 2 }] },
        { items: [{ id: 10 }] },
        { arrayMerge: 'combine' }
      )
      expect(result).toEqual({ items: [{ id: 10 }, { id: 2 }] })
    })

    test('combine 非对象元素按索引覆盖', () => {
      const result = merge(
        { items: [1, 2, 3] },
        { items: [10] },
        { arrayMerge: 'combine' }
      )
      expect(result).toEqual({ items: [10, 2, 3] })
    })

    test('combine 嵌套数组中的数组按 combine 处理', () => {
      const result = merge(
        { items: [[1, 2], [3]] },
        { items: [[10], [20, 30]] },
        { arrayMerge: 'combine' }
      )
      expect(result).toEqual({
        items: [
          [10, 2],
          [20, 30],
        ],
      })
    })

    test('concat 空数组拼接', () => {
      const result = merge({ a: [] }, { a: [1, 2] }, { arrayMerge: 'concat' })
      expect(result).toEqual({ a: [1, 2] })
    })

    test('arrayMerge 与 supplement 模式组合', () => {
      const result = merge(
        { a: [1, 2], b: 'keep' },
        { a: [3, 4], b: 'overwrite', c: 'new' },
        { mode: 'supplement', arrayMerge: 'concat' }
      )
      expect(result).toEqual({ a: [1, 2], b: 'keep', c: 'new' })
    })
  })

  // ═══════════════════════════════════════════════════════
  //  isMergeableObject
  // ═══════════════════════════════════════════════════════
  describe('isMergeableObject', () => {
    test('默认行为合并所有 plain object', () => {
      const result = merge({ a: { x: 1 } }, { a: { y: 2 } })
      expect(result).toEqual({ a: { x: 1, y: 2 } })
    })

    test('排除指定 key 时不递归合并该字段', () => {
      const result = merge(
        { config: { x: 1 }, other: { y: 2 } },
        { config: { x: 10 }, other: { y: 20 } },
        {
          isMergeableObject: (value, key) =>
            key !== 'config' ? isObject(value) : false,
        }
      )
      expect(result.config).toEqual({ x: 10 })
      expect(result.other).toEqual({ y: 20 })
    })

    test('isMergeableObject 在嵌套递归中生效', () => {
      const result = merge(
        { a: { b: { c: 1, d: 2 } } },
        { a: { b: { c: 10, d: 20 } } },
        { isMergeableObject: (value) => false }
      )
      expect(result.a.b).toEqual({ c: 10, d: 20 })
    })

    test('isMergeableObject 返回 false 时整体替换', () => {
      const specialObj = { type: 'special', data: [1, 2] }
      const result = merge(
        { item: { type: 'old' } },
        { item: specialObj },
        { isMergeableObject: (value, key) => key !== 'item' && isObject(value) }
      )
      expect(result.item).toBe(specialObj)
    })

    test('isMergeableObject 与 supplement 模式组合', () => {
      const result = merge(
        { a: { x: 1 }, b: { y: 2 } },
        { a: { x: 10 }, b: { y: 20 } },
        {
          mode: 'supplement',
          isMergeableObject: (value, key) => key !== 'a' && isObject(value),
        }
      )
      expect(result.a).toEqual({ x: 1 })
      expect(result.b).toEqual({ y: 2 })
    })
  })

  // ═══════════════════════════════════════════════════════
  //  customMerge
  // ═══════════════════════════════════════════════════════
  describe('customMerge', () => {
    test('为指定 key 提供自定义合并函数', () => {
      const result = merge(
        { name: { first: 'Alex', last: 'Smith' }, age: 30 },
        { name: { first: 'Bob', last: 'Jones' }, age: 25 },
        {
          customMerge: {
            name: (targetVal, sourceVal) =>
              `${targetVal.first} & ${sourceVal.first}`,
          },
        }
      )
      expect(result.name).toBe('Alex & Bob')
      expect(result.age).toBe(25)
    })

    test('customMerge 优先于 mode 和默认合并逻辑', () => {
      const result = merge(
        { count: 10, label: 'old' },
        { count: 20, label: 'new' },
        {
          mode: 'supplement',
          customMerge: {
            count: (a, b) => a + b,
          },
        }
      )
      expect(result.count).toBe(30)
      expect(result.label).toBe('old')
    })

    test('未被 customMerge 覆盖的 key 使用默认合并逻辑', () => {
      const result = merge(
        { a: { x: 1 }, b: { y: 2 } },
        { a: { x: 10 }, b: { y: 20 } },
        { customMerge: { a: (a, b) => ({ ...a, ...b, merged: true }) } }
      )
      expect(result.a).toEqual({ x: 10, merged: true })
      expect(result.b).toEqual({ y: 20 })
    })

    test('customMerge 可以访问 options 参数', () => {
      const result = merge(
        { items: [1, 2] },
        { items: [3, 4] },
        {
          customMerge: {
            items: (targetVal, sourceVal, options) => {
              if (options?.arrayMerge === 'concat')
                return targetVal.concat(sourceVal)
              return sourceVal
            },
          },
          arrayMerge: 'concat',
        }
      )
      expect(result.items).toEqual([1, 2, 3, 4])
    })
  })

  // ═══════════════════════════════════════════════════════
  //  循环引用保护
  // ═══════════════════════════════════════════════════════
  describe('循环引用保护', () => {
    test('target 自引用不应栈溢出，且引用关系保持', () => {
      const obj: any = { name: 'root' }
      obj.__self = obj

      let result: any
      expect(() => {
        result = merge(obj, { extra: true })
      }).not.toThrow()

      expect(result.name).toBe('root')
      expect(result.extra).toBe(true)
      expect(result.__self).toBe(result)
    })

    test('source 自引用不应栈溢出', () => {
      const source: any = { name: 'source' }
      source.__self = source

      let result: any
      expect(() => {
        result = merge({ a: 1 }, source)
      }).not.toThrow()

      expect(result.a).toBe(1)
      expect(result.name).toBe('source')
      expect(result.__self).toBe(result)
    })

    test('两层互相引用不应栈溢出', () => {
      const a: any = { id: 'a' }
      const b: any = { id: 'b' }
      a.ref = b
      b.ref = a

      let result: any
      expect(() => {
        result = merge(a, { extra: true })
      }).not.toThrow()

      expect(result.id).toBe('a')
      expect(result.extra).toBe(true)
    })

    test('defineApi 风格的 __rawConfig 循环引用', () => {
      const config: any = { url: '/test', method: 'get' }
      config.__rawConfig = config

      let result: any
      expect(() => {
        result = merge(config, { url: '/changed' })
      }).not.toThrow()

      expect(result.url).toBe('/changed')
      expect(result.method).toBe('get')
    })
  })

  describe('source 共享引用 + supplement 模式', () => {
    test('supplement 模式下 source 共享引用不应替换不同的 target 子对象', () => {
      const sharedLocale = { greeting: 'Hello', farewell: 'Goodbye' }
      const source = { en_US: sharedLocale, 'en-US': sharedLocale }
      const target = {
        en_US: { greeting: 'Hi', farewell: 'Bye' },
        'en-US': { greeting: 'Hey!', farewell: 'See ya' },
      }
      const refA = target['en_US']
      const refB = target['en-US']

      merge(target, source, { mode: 'supplement' })

      expect(target['en_US']).toBe(refA)
      expect(target['en-US']).toBe(refB)
      expect(target['en_US'].greeting).toBe('Hi')
      expect(target['en-US'].greeting).toBe('Hey!')
      expect(target['en-US'].farewell).toBe('See ya')
    })

    test('override 写入的值不应被后续 supplement 的共享引用覆盖', () => {
      const config: any = {
        en_US: { greeting: 'Override-Hi', farewell: 'Override-Bye' },
        'en-US': { greeting: 'Override-Hey!', farewell: 'Override-See ya' },
      }
      const sharedDefaults = {
        greeting: 'Default',
        farewell: 'DefaultBye',
        extra: 'bonus',
      }
      merge(
        config,
        { en_US: sharedDefaults, 'en-US': sharedDefaults },
        { mode: 'supplement' }
      )

      expect(config['en_US'].greeting).toBe('Override-Hi')
      expect(config['en-US'].greeting).toBe('Override-Hey!')
      expect(config['en-US'].farewell).toBe('Override-See ya')
      expect(config['en_US'].extra).toBe('bonus')
      expect(config['en-US'].extra).toBe('bonus')
    })

    test('source 真正的循环引用在 supplement 模式下仍不应栈溢出', () => {
      const circular: any = { name: 'loop' }
      circular.self = circular

      let result: any
      expect(() => {
        result = merge({ name: 'existing', self: { deep: true } }, circular, {
          mode: 'supplement',
        })
      }).not.toThrow()

      expect(result.name).toBe('existing')
    })

    test('override 模式下 source 共享引用保持现有行为', () => {
      const shared = { x: 1 }
      const source = { a: shared, b: shared }
      const target: any = { a: { x: 10 }, b: { x: 20 } }

      merge(target, source, { mode: 'override' })

      expect(target.a.x).toBe(1)
      expect(target.a).toBe(target.b)
    })

    test('三个以上共享引用各自独立保持', () => {
      const shared = { val: 'src' }
      const source = { a: shared, b: shared, c: shared }
      const target: any = {
        a: { val: 'A' },
        b: { val: 'B' },
        c: { val: 'C' },
      }

      merge(target, source, { mode: 'supplement' })

      expect(target.a.val).toBe('A')
      expect(target.b.val).toBe('B')
      expect(target.c.val).toBe('C')
      expect(target.a).not.toBe(target.b)
      expect(target.b).not.toBe(target.c)
    })

    test('嵌套层级中的共享引用也应独立保持', () => {
      const innerShared = { x: 1 }
      const source = { level1: { a: innerShared, b: innerShared } }
      const target: any = {
        level1: { a: { x: 10 }, b: { x: 20 } },
      }

      merge(target, source, { mode: 'supplement' })

      expect(target.level1.a.x).toBe(10)
      expect(target.level1.b.x).toBe(20)
      expect(target.level1.a).not.toBe(target.level1.b)
    })

    test('supplement 时 target 缺少 key：resolveRef 将共享 source 解析为首次合并结果', () => {
      const shared = { greeting: 'Hello', farewell: 'Goodbye' }
      const source = { en_US: shared, 'en-US': shared }
      const target: any = { en_US: { greeting: 'Hi' } }

      merge(target, source, { mode: 'supplement' })

      expect(target['en_US'].greeting).toBe('Hi')
      expect(target['en_US'].farewell).toBe('Goodbye')
      expect(target['en-US']).toBeDefined()
      // resolveRef 将 shared 解析为 en_US 的合并结果（含 override 值），
      // 对 I18n 场景来说，别名 locale 共享 override 值是合理的
      expect(target['en-US']).toBe(target['en_US'])
      expect(target['en-US'].greeting).toBe('Hi')
    })

    test('clone + supplement + 共享引用：不修改原 target，各子树独立', () => {
      const shared = { val: 'src', extra: 'bonus' }
      const source = { a: shared, b: shared }
      const target: any = { a: { val: 'A' }, b: { val: 'B' } }
      const origA = target.a
      const origB = target.b

      const result = merge(target, source, {
        mode: 'supplement',
        clone: true,
      })

      expect(target.a).toBe(origA)
      expect(target.b).toBe(origB)
      expect(result.a.val).toBe('A')
      expect(result.b.val).toBe('B')
      expect(result.a.extra).toBe('bonus')
      expect(result.b.extra).toBe('bonus')
      expect(result.a).not.toBe(result.b)
    })

    test('paths 局部 override + 共享引用不影响 supplement 的 key', () => {
      const shared = { val: 'src' }
      const source = { a: shared, b: shared }
      const target: any = { a: { val: 'A' }, b: { val: 'B' } }

      merge(target, source, {
        mode: 'supplement',
        paths: { a: 'override' },
      })

      expect(target.a.val).toBe('src')
      expect(target.b.val).toBe('B')
    })

    test('shallowAfterDepth + supplement + 共享引用', () => {
      const shared = { greeting: 'Hello', extra: 'bonus' }
      const source = { en_US: shared, 'en-US': shared }
      const target: any = {
        en_US: { greeting: 'Hi' },
        'en-US': { greeting: 'Hey' },
      }

      merge(target, source, { mode: 'supplement', shallowAfterDepth: 1 })

      expect(target['en_US'].greeting).toBe('Hi')
      expect(target['en-US'].greeting).toBe('Hey')
      expect(target['en_US'].extra).toBe('bonus')
      expect(target['en-US'].extra).toBe('bonus')
    })

    test('source 互相引用（非自引用）在 supplement 模式下不应栈溢出', () => {
      const a: any = { id: 'srcA' }
      const b: any = { id: 'srcB' }
      a.ref = b
      b.ref = a

      let result: any
      expect(() => {
        result = merge({ ref: { id: 'targetB', ref: { id: 'targetA' } } }, a, {
          mode: 'supplement',
        })
      }).not.toThrow()

      expect(result.id).toBe('srcA')
      expect(result.ref.id).toBe('targetB')
    })

    test('source 和 target 是同一对象时 supplement 不应出错', () => {
      const obj: any = { a: 1, b: { x: 2 } }

      expect(() => {
        merge(obj, obj, { mode: 'supplement' })
      }).not.toThrow()

      expect(obj.a).toBe(1)
      expect(obj.b.x).toBe(2)
    })

    test('模拟真实 I18n 场景：多包逐层 supplement 共享 locale', () => {
      const sharedEn = { save: 'Save', cancel: 'Cancel' }
      const sharedZh = { save: '保存', cancel: '取消' }

      const bizOverride: any = {
        en_US: { save: 'Submit' },
        'en-US': { save: 'Submit' },
        zh_CN: { save: '提交' },
        'zh-CN': { save: '提交' },
      }

      const frameworkDefaults = {
        en_US: sharedEn,
        'en-US': sharedEn,
        zh_CN: sharedZh,
        'zh-CN': sharedZh,
      }

      merge(bizOverride, frameworkDefaults, { mode: 'supplement' })

      expect(bizOverride['en_US'].save).toBe('Submit')
      expect(bizOverride['en-US'].save).toBe('Submit')
      expect(bizOverride['en_US'].cancel).toBe('Cancel')
      expect(bizOverride['en-US'].cancel).toBe('Cancel')
      expect(bizOverride['zh_CN'].save).toBe('提交')
      expect(bizOverride['zh-CN'].save).toBe('提交')
      expect(bizOverride['zh_CN'].cancel).toBe('取消')
      expect(bizOverride['zh-CN'].cancel).toBe('取消')

      expect(bizOverride['en_US']).not.toBe(bizOverride['en-US'])
      expect(bizOverride['zh_CN']).not.toBe(bizOverride['zh-CN'])
    })
  })

  // ═══════════════════════════════════════════════════════
  //  边界情况和特殊输入
  // ═══════════════════════════════════════════════════════
  describe('边界情况', () => {
    test('target 为 null 应返回 source', () => {
      const result = merge(null as any, { a: 1 })
      expect(result).toEqual({ a: 1 })
    })

    test('source 为 null 应返回 target', () => {
      const result = merge({ a: 1 }, null as any)
      expect(result).toEqual({ a: 1 })
    })

    test('target 和 source 都为 null', () => {
      const result = merge(null as any, null as any)
      expect(result).toBeNull()
    })

    test('target 为非对象基本类型', () => {
      const result = merge(42 as any, { a: 1 })
      expect(result).toEqual({ a: 1 })
    })

    test('source 为非对象基本类型，target 为对象', () => {
      const target = { a: 1 }
      const result = merge(target, 'string' as any)
      expect(result).toBe(target)
    })

    test('Date 对象应作为原始值处理', () => {
      const date = new Date('2024-01-01')
      const result = merge({ time: date }, { time: 'replaced' })
      expect(result.time).toBe('replaced')
    })

    test('函数应作为原始值处理', () => {
      const fn = () => 'hello'
      const result = merge({ callback: fn }, { other: 1 } as any)
      expect(result.callback).toBe(fn)
      expect((result as any).other).toBe(1)
    })
  })

  // ═══════════════════════════════════════════════════════
  //  功能组合
  // ═══════════════════════════════════════════════════════
  describe('功能组合', () => {
    test('clone + supplement + arrayMerge=concat', () => {
      const target = { items: [1, 2], name: 'old' }
      const targetCopy = JSON.parse(JSON.stringify(target))
      const result = merge(
        target,
        { items: [3, 4], name: 'new', extra: true },
        { clone: true, mode: 'supplement', arrayMerge: 'concat' }
      )
      expect(target).toEqual(targetCopy)
      expect(result).toEqual({ items: [1, 2], name: 'old', extra: true })
    })

    test('clone + override + arrayMerge=concat', () => {
      const target = { items: [1, 2], name: 'old' }
      const result = merge(
        target,
        { items: [3, 4], name: 'new' },
        { clone: true, arrayMerge: 'concat' }
      )
      expect(result).toEqual({ items: [1, 2, 3, 4], name: 'new' })
    })

    test('clone + paths + supplement', () => {
      const target = { a: 1, b: { x: 1, y: 2 } }
      const targetCopy = JSON.parse(JSON.stringify(target))
      const result = merge(
        target,
        { a: 10, b: { x: 10, y: 20 } },
        { clone: true, mode: 'supplement', paths: { a: 'override' } }
      )
      expect(target).toEqual(targetCopy)
      expect(result).toEqual({ a: 10, b: { x: 1, y: 2 } })
    })

    test('所有功能组合: clone + supplement + customMerge + isMergeableObject', () => {
      const target = { count: 5, data: { x: 1 }, special: { y: 2 } }
      const targetCopy = JSON.parse(JSON.stringify(target))
      const result = merge(
        target,
        { count: 10, data: { x: 10, z: 3 }, special: { y: 20 } },
        {
          clone: true,
          mode: 'override',
          customMerge: {
            count: (a, b) => a + b,
          },
          isMergeableObject: (value, key) =>
            key !== 'special' && isObject(value),
        }
      )
      expect(target).toEqual(targetCopy)
      expect(result.count).toBe(15)
      expect(result.data).toEqual({ x: 10, z: 3 })
      expect(result.special).toEqual({ y: 20 })
    })
  })
})

// isObject import for test use
function isObject(value: any): boolean {
  return typeof value === 'object' && !(Array.isArray(value) || value === null)
}
