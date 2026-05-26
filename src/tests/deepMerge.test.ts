import deepMerge from '../deepMerge'

describe('deepMerge (variadic)', () => {
  test('应合并两个扁平对象', () => {
    expect(deepMerge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 })
  })

  test('source 应覆盖 target 同名字段', () => {
    expect(deepMerge({ a: 1, b: 2 }, { b: 3, c: 4 })).toEqual({
      a: 1,
      b: 3,
      c: 4,
    })
  })

  test('应递归合并嵌套对象', () => {
    expect(deepMerge({ a: { x: 1, y: 2 } }, { a: { y: 3, z: 4 } })).toEqual({
      a: { x: 1, y: 3, z: 4 },
    })
  })

  test('深层嵌套应递归覆盖', () => {
    expect(deepMerge({ a: { b: { c: 1 } } }, { a: { b: { c: 2 } } })).toEqual({
      a: { b: { c: 2 } },
    })
  })

  test('数组应被视为值直接替换', () => {
    expect(deepMerge({ a: [1, 2] }, { a: [3, 4] })).toEqual({ a: [3, 4] })
  })

  test('空对象合并', () => {
    expect(deepMerge({}, { a: 1 })).toEqual({ a: 1 })
  })

  test('合并到空对象', () => {
    expect(deepMerge({ a: 1 }, {})).toEqual({ a: 1 })
  })

  test('两个空对象', () => {
    expect(deepMerge({}, {})).toEqual({})
  })

  test('支持多参数合并', () => {
    expect(deepMerge({ a: 1 }, { b: 2 }, { c: 3 })).toEqual({
      a: 1,
      b: 2,
      c: 3,
    })
  })

  test('多参数时后者覆盖前者', () => {
    expect(deepMerge({ a: 1 }, { a: 2 }, { a: 3 })).toEqual({ a: 3 })
  })

  test('多参数深层嵌套合并', () => {
    expect(
      deepMerge({ a: { x: 1 } }, { a: { y: 2 } }, { a: { z: 3 } })
    ).toEqual({ a: { x: 1, y: 2, z: 3 } })
  })

  test('过滤非对象参数', () => {
    expect(
      deepMerge(null as any, { a: 1 }, undefined as any, { b: 2 })
    ).toEqual({ a: 1, b: 2 })
  })

  test('所有参数均非对象时返回空对象', () => {
    expect(deepMerge(null as any, undefined as any, 123 as any)).toEqual({})
  })

  test('单参数返回该对象', () => {
    const obj = { a: 1 }
    expect(deepMerge(obj)).toBe(obj)
  })

  test('会就地修改 target', () => {
    const target = { a: 1 }
    const result = deepMerge(target, { b: 2 })
    expect(result).toBe(target)
    expect(target).toEqual({ a: 1, b: 2 })
  })
})
