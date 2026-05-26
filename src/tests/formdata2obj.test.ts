import formdata2obj from '../formdata2obj'

describe('formdata2obj', () => {
  describe('默认行为（与原版兼容）', () => {
    test('将简单 FormData 转为对象', () => {
      const formData = new FormData()
      formData.append('name', 'hello')
      formData.append('age', '25')
      expect(formdata2obj(formData)).toEqual({ name: 'hello', age: '25' })
    })

    test('空 FormData', () => {
      const formData = new FormData()
      expect(formdata2obj(formData)).toEqual({})
    })

    test('同名键后者覆盖前者', () => {
      const formData = new FormData()
      formData.append('key', 'value1')
      formData.append('key', 'value2')
      expect(formdata2obj(formData)).toEqual({ key: 'value2' })
    })

    test('带 [] 的键名作为普通字符串', () => {
      const formData = new FormData()
      formData.append('tags[]', 'a')
      formData.append('tags[]', 'b')
      const result = formdata2obj(formData)
      expect(result['tags[]']).toBe('b')
    })

    test('带 [key] 的键名作为普通字符串', () => {
      const formData = new FormData()
      formData.append('user[name]', 'Alice')
      const result = formdata2obj(formData)
      expect(result['user[name]']).toBe('Alice')
    })

    test('空字符串值', () => {
      const formData = new FormData()
      formData.append('empty', '')
      expect(formdata2obj(formData)).toEqual({ empty: '' })
    })
  })

  describe('nested: true（增强模式）', () => {
    test('简单键值正常转换', () => {
      const formData = new FormData()
      formData.append('name', 'hello')
      formData.append('age', '25')
      expect(formdata2obj(formData, { nested: true })).toEqual({
        name: 'hello',
        age: '25',
      })
    })

    test('同名键合并为数组', () => {
      const formData = new FormData()
      formData.append('key', 'value1')
      formData.append('key', 'value2')
      expect(formdata2obj(formData, { nested: true })).toEqual({
        key: ['value1', 'value2'],
      })
    })

    test('[] 后缀解析为数组', () => {
      const formData = new FormData()
      formData.append('tags[]', 'a')
      formData.append('tags[]', 'b')
      formData.append('tags[]', 'c')
      const result = formdata2obj(formData, { nested: true })
      expect(result.tags).toEqual(['a', 'b', 'c'])
    })

    test('[index] 语法解析为数组', () => {
      const formData = new FormData()
      formData.append('items[0]', 'first')
      formData.append('items[1]', 'second')
      const result = formdata2obj(formData, { nested: true })
      expect(result.items).toEqual(['first', 'second'])
    })

    test('嵌套对象 key[subkey] 语法', () => {
      const formData = new FormData()
      formData.append('user[name]', 'Alice')
      formData.append('user[age]', '30')
      const result = formdata2obj(formData, { nested: true })
      expect(result.user).toEqual({ name: 'Alice', age: '30' })
    })

    test('深层嵌套', () => {
      const formData = new FormData()
      formData.append('a[b][c]', 'deep')
      const result = formdata2obj(formData, { nested: true })
      expect(result.a.b.c).toBe('deep')
    })

    test('混合场景', () => {
      const formData = new FormData()
      formData.append('name', 'test')
      formData.append('tags[]', 'a')
      formData.append('tags[]', 'b')
      formData.append('meta[color]', 'red')
      const result = formdata2obj(formData, { nested: true })
      expect(result.name).toBe('test')
      expect(result.tags).toEqual(['a', 'b'])
      expect(result.meta).toEqual({ color: 'red' })
    })

    test('特殊字符值', () => {
      const formData = new FormData()
      formData.append('special', 'hello=world&foo=bar')
      expect(formdata2obj(formData, { nested: true })).toEqual({
        special: 'hello=world&foo=bar',
      })
    })
  })
})
