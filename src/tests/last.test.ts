import last from '../last'

describe('last', () => {
  test('数组 - 返回最后一个元素', () => {
    expect(last([1, 2, 3])).toBe(3)
  })

  test('数组 - 单元素', () => {
    expect(last([42])).toBe(42)
  })

  test('数组 - 空数组返回 undefined', () => {
    expect(last([])).toBeUndefined()
  })

  test('对象 - 返回最后一个属性的值', () => {
    expect(last({ a: 1, b: 2, c: 3 })).toBe(3)
  })

  test('对象 - 单属性', () => {
    expect(last({ x: 'hello' })).toBe('hello')
  })

  test('对象 - 空对象返回 undefined', () => {
    expect(last({})).toBeUndefined()
  })

  test('非数组非对象返回 undefined', () => {
    expect(last('string' as any)).toBeUndefined()
    expect(last(123 as any)).toBeUndefined()
    expect(last(null as any)).toBeUndefined()
  })

  test('数组元素为对象', () => {
    expect(last([{ id: 1 }, { id: 2 }])).toEqual({ id: 2 })
  })

  test('数组元素为 undefined', () => {
    expect(last([1, undefined])).toBeUndefined()
  })
})
