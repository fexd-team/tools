import first from '../first'

describe('first', () => {
  test('数组 - 返回第一个元素', () => {
    expect(first([1, 2, 3])).toBe(1)
  })

  test('数组 - 单元素', () => {
    expect(first([42])).toBe(42)
  })

  test('数组 - 空数组返回 undefined', () => {
    expect(first([])).toBeUndefined()
  })

  test('对象 - 返回第一个属性的值', () => {
    expect(first({ a: 1, b: 2, c: 3 })).toBe(1)
  })

  test('对象 - 单属性', () => {
    expect(first({ x: 'hello' })).toBe('hello')
  })

  test('对象 - 空对象返回 undefined', () => {
    expect(first({})).toBeUndefined()
  })

  test('非数组非对象返回 undefined', () => {
    expect(first('string' as any)).toBeUndefined()
    expect(first(123 as any)).toBeUndefined()
    expect(first(null as any)).toBeUndefined()
  })

  test('数组元素为对象', () => {
    expect(first([{ id: 1 }, { id: 2 }])).toEqual({ id: 1 })
  })

  test('数组元素为 undefined', () => {
    expect(first([undefined, 2])).toBeUndefined()
  })
})
