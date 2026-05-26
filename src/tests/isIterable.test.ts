import isIterable from '../isIterable'

describe('isIterable', () => {
  test('数组返回 true', () => {
    expect(isIterable([1, 2, 3])).toBe(true)
    expect(isIterable([])).toBe(true)
  })

  test('字符串返回 true', () => {
    expect(isIterable('hello')).toBe(true)
    expect(isIterable('')).toBe(true)
  })

  test('Map 返回 true', () => {
    expect(isIterable(new Map())).toBe(true)
  })

  test('Set 返回 true', () => {
    expect(isIterable(new Set())).toBe(true)
  })

  test('TypedArray 返回 true', () => {
    expect(isIterable(new Uint8Array())).toBe(true)
  })

  test('generator 返回 true', () => {
    function* gen() {
      yield 1
    }
    expect(isIterable(gen())).toBe(true)
  })

  test('自定义迭代器返回 true', () => {
    const iterable = {
      [Symbol.iterator]() {
        return {
          next() {
            return { done: true, value: undefined }
          },
        }
      },
    }
    expect(isIterable(iterable)).toBe(true)
  })

  test('普通对象返回 false', () => {
    expect(isIterable({})).toBe(false)
    expect(isIterable({ a: 1 })).toBe(false)
  })

  test('null 返回 false', () => {
    expect(isIterable(null)).toBe(false)
  })

  test('undefined 返回 false', () => {
    expect(isIterable(undefined)).toBe(false)
  })

  test('数字返回 false', () => {
    expect(isIterable(42)).toBe(false)
  })

  test('布尔值返回 false', () => {
    expect(isIterable(true)).toBe(false)
  })

  test('函数返回 false', () => {
    expect(isIterable(() => {})).toBe(false)
  })

  test('Date 实例返回 false (没有 Symbol.iterator)', () => {
    expect(isIterable(new Date())).toBe(false)
  })
})
