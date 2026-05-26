import identity from '../identity'

describe('identity', () => {
  test('返回原始值', () => {
    expect(identity(42)).toBe(42)
    expect(identity('hello')).toBe('hello')
    expect(identity(true)).toBe(true)
    expect(identity(null)).toBe(null)
    expect(identity(undefined)).toBe(undefined)
  })

  test('返回相同引用', () => {
    const obj = { a: 1 }
    expect(identity(obj)).toBe(obj)
    const arr = [1, 2, 3]
    expect(identity(arr)).toBe(arr)
  })

  test('泛型类型保留', () => {
    const num: number = identity<number>(42)
    expect(num).toBe(42)
    const str: string = identity<string>('test')
    expect(str).toBe('test')
  })
})
