import safeStringify from '../safeStringify'

describe('safeStringify', () => {
  test('普通对象正常序列化', () => {
    expect(safeStringify({ a: 1, b: 'hello' })).toBe('{"a":1,"b":"hello"}')
  })

  test('嵌套对象', () => {
    const obj = { a: { b: { c: 1 } } }
    expect(JSON.parse(safeStringify(obj)!)).toEqual(obj)
  })

  test('共享引用（DAG）- 不应被标记为 Circular', () => {
    const shared = { x: 1 }
    const obj = { a: shared, b: shared }
    const result = JSON.parse(safeStringify(obj)!)
    expect(result).toEqual({ a: { x: 1 }, b: { x: 1 } })
  })

  test('深层共享引用', () => {
    const shared = { val: 42 }
    const obj = {
      first: { nested: shared },
      second: { nested: shared },
      third: shared,
    }
    const result = JSON.parse(safeStringify(obj)!)
    expect(result.first.nested).toEqual({ val: 42 })
    expect(result.second.nested).toEqual({ val: 42 })
    expect(result.third).toEqual({ val: 42 })
  })

  test('直接循环引用 - 应标记为 [Circular]', () => {
    const obj: any = { name: 'root' }
    obj.self = obj
    const result = JSON.parse(safeStringify(obj)!)
    expect(result.name).toBe('root')
    expect(result.self).toBe('[Circular]')
  })

  test('间接循环引用', () => {
    const a: any = { id: 'a' }
    const b: any = { id: 'b', ref: a }
    a.ref = b
    const result = JSON.parse(safeStringify(a)!)
    expect(result.id).toBe('a')
    expect(result.ref.id).toBe('b')
    expect(result.ref.ref).toBe('[Circular]')
  })

  test('数组中的循环引用', () => {
    const arr: any[] = [1, 2]
    arr.push(arr)
    const result = JSON.parse(safeStringify(arr)!)
    expect(result[0]).toBe(1)
    expect(result[1]).toBe(2)
    expect(result[2]).toBe('[Circular]')
  })

  test('React 元素被过滤', () => {
    const reactEl = { $$typeof: Symbol.for('react.element'), type: 'div' }
    const obj = { el: reactEl, x: 1 }
    const result = JSON.parse(safeStringify(obj)!)
    expect(result.x).toBe(1)
    expect(result.el).toBeUndefined()
  })

  test('基本类型正常处理', () => {
    expect(safeStringify(null)).toBe('null')
    expect(safeStringify(42)).toBe('42')
    expect(safeStringify('hello')).toBe('"hello"')
    expect(safeStringify(true)).toBe('true')
  })

  test('空对象和空数组', () => {
    expect(safeStringify({})).toBe('{}')
    expect(safeStringify([])).toBe('[]')
  })

  test('多层嵌套中的共享引用', () => {
    const leaf = { id: 'leaf' }
    const obj = {
      level1a: { level2a: leaf, level2b: leaf },
      level1b: leaf,
    }
    const result = JSON.parse(safeStringify(obj)!)
    expect(result.level1a.level2a).toEqual({ id: 'leaf' })
    expect(result.level1a.level2b).toEqual({ id: 'leaf' })
    expect(result.level1b).toEqual({ id: 'leaf' })
  })

  test('共享数组引用不应被标记为 Circular', () => {
    const sharedArr = [1, 2, 3]
    const obj = { a: sharedArr, b: sharedArr }
    const result = JSON.parse(safeStringify(obj)!)
    expect(result.a).toEqual([1, 2, 3])
    expect(result.b).toEqual([1, 2, 3])
  })

  test('深层循环引用', () => {
    const a: any = { id: 'a' }
    const b: any = { id: 'b' }
    const c: any = { id: 'c' }
    a.child = b
    b.child = c
    c.child = a
    const result = JSON.parse(safeStringify(a)!)
    expect(result.id).toBe('a')
    expect(result.child.id).toBe('b')
    expect(result.child.child.id).toBe('c')
    expect(result.child.child.child).toBe('[Circular]')
  })
})
