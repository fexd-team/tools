import obj2formdata from '../obj2formdata'

describe('obj2formdata', () => {
  describe('默认行为（与原版兼容）', () => {
    test('将简单对象转为 FormData', () => {
      const formData = obj2formdata({ name: 'hello', age: '25' })
      expect(formData).toBeInstanceOf(FormData)
      expect(formData.get('name')).toBe('hello')
      expect(formData.get('age')).toBe('25')
    })

    test('空对象', () => {
      const formData = obj2formdata({})
      expect([...formData.entries()]).toHaveLength(0)
    })

    test('null/undefined 输入', () => {
      expect(obj2formdata(null as any)).toBeInstanceOf(FormData)
      expect(obj2formdata(undefined as any)).toBeInstanceOf(FormData)
    })

    test('数值直接 append（toString）', () => {
      const formData = obj2formdata({ count: 42 } as any)
      expect(formData.get('count')).toBe('42')
    })

    test('布尔值直接 append', () => {
      const formData = obj2formdata({ active: true } as any)
      expect(formData.get('active')).toBe('true')
    })

    test('数组直接 append（toString）', () => {
      const formData = obj2formdata({ tags: ['a', 'b'] } as any)
      expect(formData.get('tags')).toBe('a,b')
    })

    test('嵌套对象直接 append（toString）', () => {
      const formData = obj2formdata({ meta: { x: 1 } } as any)
      expect(formData.get('meta')).toBe('[object Object]')
    })

    test('null 值直接 append', () => {
      const formData = obj2formdata({ val: null } as any)
      expect(formData.get('val')).toBe('null')
    })

    test('undefined 值直接 append', () => {
      const formData = obj2formdata({ val: undefined } as any)
      expect(formData.get('val')).toBe('undefined')
    })
  })

  describe('nested: true（增强模式）', () => {
    test('简单对象正常序列化', () => {
      const formData = obj2formdata({ name: 'hello' }, { nested: true })
      expect(formData.get('name')).toBe('hello')
    })

    test('数值转字符串', () => {
      const formData = obj2formdata({ count: 42 } as any, { nested: true })
      expect(formData.get('count')).toBe('42')
    })

    test('布尔值默认转为字符串', () => {
      const formData = obj2formdata({ active: true, disabled: false } as any, {
        nested: true,
      })
      expect(formData.get('active')).toBe('true')
      expect(formData.get('disabled')).toBe('false')
    })

    test('booleansAsIntegers 选项', () => {
      const formData = obj2formdata({ active: true, disabled: false } as any, {
        nested: true,
        booleansAsIntegers: true,
      })
      expect(formData.get('active')).toBe('1')
      expect(formData.get('disabled')).toBe('0')
    })

    test('null 值转为空字符串', () => {
      const formData = obj2formdata({ val: null } as any, { nested: true })
      expect(formData.get('val')).toBe('')
    })

    test('nullsAsUndefined 选项跳过 null', () => {
      const formData = obj2formdata({ val: null, other: 'ok' } as any, {
        nested: true,
        nullsAsUndefined: true,
      })
      expect(formData.has('val')).toBe(false)
      expect(formData.get('other')).toBe('ok')
    })

    test('undefined 值被跳过', () => {
      const formData = obj2formdata({ val: undefined, other: 'ok' } as any, {
        nested: true,
      })
      expect(formData.has('val')).toBe(false)
      expect(formData.get('other')).toBe('ok')
    })

    test('数组默认使用 [] 后缀', () => {
      const formData = obj2formdata({ tags: ['a', 'b', 'c'] } as any, {
        nested: true,
      })
      expect(formData.getAll('tags[]')).toEqual(['a', 'b', 'c'])
    })

    test('数组 indices 选项使用 [0] [1]', () => {
      const formData = obj2formdata({ tags: ['a', 'b'] } as any, {
        nested: true,
        indices: true,
      })
      expect(formData.get('tags[0]')).toBe('a')
      expect(formData.get('tags[1]')).toBe('b')
    })

    test('嵌套对象使用 [] 语法', () => {
      const formData = obj2formdata(
        { user: { name: 'Alice', age: 30 } } as any,
        { nested: true }
      )
      expect(formData.get('user[name]')).toBe('Alice')
      expect(formData.get('user[age]')).toBe('30')
    })

    test('深层嵌套', () => {
      const formData = obj2formdata({ a: { b: { c: 'deep' } } } as any, {
        nested: true,
      })
      expect(formData.get('a[b][c]')).toBe('deep')
    })

    test('Date 转为 ISO 字符串', () => {
      const date = new Date('2024-01-15T10:30:00.000Z')
      const formData = obj2formdata({ created: date } as any, { nested: true })
      expect(formData.get('created')).toBe('2024-01-15T10:30:00.000Z')
    })

    test('File/Blob 直接追加', () => {
      const blob = new Blob(['hello'], { type: 'text/plain' })
      const formData = obj2formdata({ file: blob } as any, { nested: true })
      expect(formData.get('file')).toBeInstanceOf(Blob)
    })

    test('混合复杂场景', () => {
      const formData = obj2formdata(
        {
          name: 'test',
          tags: ['a', 'b'],
          meta: { color: 'red' },
          active: true,
        } as any,
        { nested: true }
      )
      expect(formData.get('name')).toBe('test')
      expect(formData.getAll('tags[]')).toEqual(['a', 'b'])
      expect(formData.get('meta[color]')).toBe('red')
      expect(formData.get('active')).toBe('true')
    })
  })
})
