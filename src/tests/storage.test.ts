import storage from '../storage'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  describe('localStorage', () => {
    test('set 和 get', () => {
      storage.set('key1', { a: 1 })
      expect(storage.get('key1')).toEqual({ a: 1 })
    })

    test('get 不存在的 key 返回 undefined', () => {
      expect(storage.get('nonexistent')).toBeUndefined()
    })

    test('set 字符串值', () => {
      storage.set('str', 'hello')
      expect(storage.get('str')).toBe('hello')
    })

    test('set 数字值', () => {
      storage.set('num', 42)
      expect(storage.get('num')).toBe(42)
    })

    test('set null 值', () => {
      storage.set('null', null)
      expect(storage.get('null')).toBeNull()
    })

    test('set boolean 值', () => {
      storage.set('bool', true)
      expect(storage.get('bool')).toBe(true)
    })

    test('remove 删除', () => {
      storage.set('key', 'value')
      storage.remove('key')
      expect(storage.get('key')).toBeUndefined()
    })

    test('覆盖已有值', () => {
      storage.set('key', 'old')
      storage.set('key', 'new')
      expect(storage.get('key')).toBe('new')
    })

    test('存储 undefined 返回 undefined', () => {
      storage.set('undef', undefined)
      expect(storage.get('undef')).toBeUndefined()
    })

    test('存储数组', () => {
      storage.set('arr', [1, 2, 3])
      expect(storage.get('arr')).toEqual([1, 2, 3])
    })

    test('存储嵌套对象', () => {
      storage.set('nested', { a: { b: { c: 1 } } })
      expect(storage.get('nested')).toEqual({ a: { b: { c: 1 } } })
    })

    test('存储 "undefined" 字符串返回 undefined', () => {
      localStorage.setItem('str_undef', 'undefined')
      expect(storage.get('str_undef')).toBeUndefined()
    })

    test('存储非法 JSON 时返回原始字符串', () => {
      localStorage.setItem('bad_json', '{invalid json}')
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      const result = storage.get('bad_json')
      expect(result).toBe('{invalid json}')
      errorSpy.mockRestore()
    })

    test('remove 不存在的 key 不报错', () => {
      expect(() => storage.remove('no_such_key')).not.toThrow()
    })

    test('set 循环引用对象时降级存储', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      const circular: any = { a: 1 }
      circular.self = circular
      storage.set('circular', circular)
      errorSpy.mockRestore()
    })
  })

  describe('sessionStorage', () => {
    test('setSession 和 getSession', () => {
      storage.setSession('key', { b: 2 })
      expect(storage.getSession('key')).toEqual({ b: 2 })
    })

    test('removeSession', () => {
      storage.setSession('key', 'value')
      storage.removeSession('key')
      expect(storage.getSession('key')).toBeUndefined()
    })

    test('getSession 不存在的 key 返回 undefined', () => {
      expect(storage.getSession('nonexistent')).toBeUndefined()
    })

    test('setSession 布尔值', () => {
      storage.setSession('flag', false)
      expect(storage.getSession('flag')).toBe(false)
    })

    test('setSession 数值', () => {
      storage.setSession('count', 100)
      expect(storage.getSession('count')).toBe(100)
    })
  })
})
