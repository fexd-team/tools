import groupBy from '../groupBy'

describe('groupBy', () => {
  test('按属性值分组', () => {
    const list = [
      { type: 'a', value: 1 },
      { type: 'b', value: 2 },
      { type: 'a', value: 3 },
    ]
    const result = groupBy((item) => item.type, list)
    expect(result).toEqual({
      a: [
        { type: 'a', value: 1 },
        { type: 'a', value: 3 },
      ],
      b: [{ type: 'b', value: 2 }],
    })
  })

  test('空数组返回空对象', () => {
    expect(groupBy(() => 'key', [])).toEqual({})
  })

  test('namer 接收 index 参数', () => {
    const list = [10, 20, 30]
    const result = groupBy(
      (_item, index) => (index % 2 === 0 ? 'even' : 'odd'),
      list
    )
    expect(result).toEqual({ even: [10, 30], odd: [20] })
  })

  test('所有项同一组', () => {
    const result = groupBy(() => 'all', [1, 2, 3])
    expect(result).toEqual({ all: [1, 2, 3] })
  })

  test('数值类型的 key 被转为字符串', () => {
    const result = groupBy((item) => item % 2, [1, 2, 3, 4])
    expect(result).toEqual({ 1: [1, 3], 0: [2, 4] })
  })

  test('namer 返回 null 时以 "null" 为 key', () => {
    const result = groupBy(() => null, [1, 2])
    expect(result).toEqual({ null: [1, 2] })
  })

  test('namer 返回 undefined 时以 "undefined" 为 key', () => {
    const result = groupBy(() => undefined, [1, 2])
    expect(result).toEqual({ undefined: [1, 2] })
  })

  test('namer 接收原始数组参数', () => {
    const list = [1, 2, 3]
    const result = groupBy(
      (_item, _index, arr) => (arr.length > 2 ? 'long' : 'short'),
      list
    )
    expect(result).toEqual({ long: [1, 2, 3] })
  })

  test('多个分组', () => {
    const result = groupBy(
      (x) => (x > 0 ? 'pos' : x < 0 ? 'neg' : 'zero'),
      [-1, 0, 1, -2, 2]
    )
    expect(result).toEqual({
      neg: [-1, -2],
      zero: [0],
      pos: [1, 2],
    })
  })

  test('对象数组按嵌套属性分组', () => {
    const list = [
      { info: { category: 'A' } },
      { info: { category: 'B' } },
      { info: { category: 'A' } },
    ]
    const result = groupBy((item) => item.info.category, list)
    expect(result).toEqual({
      A: [{ info: { category: 'A' } }, { info: { category: 'A' } }],
      B: [{ info: { category: 'B' } }],
    })
  })
})
