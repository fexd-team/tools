import isEmpty from '../isEmpty'

describe('isEmpty', () => {
  describe('null/undefined', () => {
    test('null → true', () => {
      expect(isEmpty(null)).toBe(true)
    })

    test('undefined → true', () => {
      expect(isEmpty(undefined)).toBe(true)
    })
  })

  describe('字符串', () => {
    test('"" → true', () => {
      expect(isEmpty('')).toBe(true)
    })

    test('" " → false', () => {
      expect(isEmpty(' ')).toBe(false)
    })

    test('"hello" → false', () => {
      expect(isEmpty('hello')).toBe(false)
    })
  })

  describe('数组', () => {
    test('[] → true', () => {
      expect(isEmpty([])).toBe(true)
    })

    test('[1] → false', () => {
      expect(isEmpty([1])).toBe(false)
    })

    test('[undefined] → false', () => {
      expect(isEmpty([undefined])).toBe(false)
    })
  })

  describe('对象', () => {
    test('{} → true', () => {
      expect(isEmpty({})).toBe(true)
    })

    test('{ a: 1 } → false', () => {
      expect(isEmpty({ a: 1 })).toBe(false)
    })

    test('Object.create(null) → true', () => {
      expect(isEmpty(Object.create(null))).toBe(true)
    })
  })

  describe('Map/Set', () => {
    test('new Map() → true', () => {
      expect(isEmpty(new Map())).toBe(true)
    })

    test('有元素的 Map → false', () => {
      expect(isEmpty(new Map([['a', 1]]))).toBe(false)
    })

    test('new Set() → true', () => {
      expect(isEmpty(new Set())).toBe(true)
    })

    test('有元素的 Set → false', () => {
      expect(isEmpty(new Set([1]))).toBe(false)
    })
  })

  describe('其他类型', () => {
    test('数字 0 → true', () => {
      expect(isEmpty(0)).toBe(true)
    })

    test('数字 1 → true', () => {
      expect(isEmpty(1)).toBe(true)
    })

    test('false → true', () => {
      expect(isEmpty(false)).toBe(true)
    })

    test('函数 → true', () => {
      expect(isEmpty(() => {})).toBe(true)
    })
  })
})
