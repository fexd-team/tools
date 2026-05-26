import CombinationMatcher from '../CombinationMatcher'

describe('CombinationMatcher', () => {
  const list = {
    item1: { color: 'red', size: 'S' },
    item2: { color: 'red', size: 'M' },
    item3: { color: 'blue', size: 'S' },
    item4: { color: 'blue', size: 'L' },
  }

  test('构造函数 - 正确初始化 attr', () => {
    const matcher = new CombinationMatcher(list)
    expect(matcher.attr).toEqual({
      color: ['red', 'blue'],
      size: ['S', 'M', 'L'],
    })
  })

  test('构造函数 - 正确初始化 attrKey', () => {
    const matcher = new CombinationMatcher(list)
    expect(matcher.attrKey.sort()).toEqual(['color', 'size'])
  })

  test('have - 存在的组合返回 true', () => {
    const matcher = new CombinationMatcher(list)
    expect(matcher.have({ color: 'red', size: 'S' })).toBe(true)
    expect(matcher.have({ color: 'blue', size: 'L' })).toBe(true)
  })

  test('have - 不存在的组合返回 false', () => {
    const matcher = new CombinationMatcher(list)
    expect(matcher.have({ color: 'red', size: 'L' })).toBe(false)
    expect(matcher.have({ color: 'blue', size: 'M' })).toBe(false)
  })

  test('have - 部分属性匹配', () => {
    const matcher = new CombinationMatcher(list)
    expect(matcher.have({ color: 'red' })).toBe(true)
    expect(matcher.have({ color: 'green' })).toBe(false)
  })

  test('adaptedAttr - 根据已选属性返回可选值', () => {
    const matcher = new CombinationMatcher(list)
    const adapted = matcher.adaptedAttr({ color: 'red' })
    expect(adapted.color).toEqual(['red', 'blue'])
    expect(adapted.size).toEqual(['S', 'M'])
  })

  test('adaptedAttr - 空选择返回全部可选值', () => {
    const matcher = new CombinationMatcher(list)
    const adapted = matcher.adaptedAttr({})
    expect(adapted.color).toEqual(['red', 'blue'])
    expect(adapted.size).toEqual(['S', 'M', 'L'])
  })

  test('find - 精确匹配返回对应 key', () => {
    const matcher = new CombinationMatcher(list)
    expect(matcher.find({ color: 'red', size: 'S' })).toBe('item1')
    expect(matcher.find({ color: 'blue', size: 'L' })).toBe('item4')
  })

  test('find - 未匹配返回 undefined', () => {
    const matcher = new CombinationMatcher(list)
    expect(matcher.find({ color: 'red', size: 'L' })).toBeUndefined()
  })

  test('find - 部分属性不会匹配（需要完整属性）', () => {
    const matcher = new CombinationMatcher(list)
    expect(matcher.find({ color: 'red' })).toBeUndefined()
  })

  test('支持数组形式的 list', () => {
    const arrayList = [
      { color: 'red', size: 'S' },
      { color: 'blue', size: 'M' },
    ]
    const matcher = new CombinationMatcher(arrayList)
    expect(matcher.have({ color: 'red', size: 'S' })).toBe(true)
    expect(matcher.find({ color: 'blue', size: 'M' })).toBe('1')
  })
})
