import uniqueId from '../uniqueId'

describe('uniqueId', () => {
  test('无前缀时返回带下划线的 id', () => {
    const id = uniqueId()
    expect(id).toMatch(/^_\d+_\d+_\d+$/)
  })

  test('带前缀', () => {
    const id = uniqueId('test')
    expect(id).toMatch(/^test_\d+_\d+_\d+$/)
  })

  test('每次调用生成不同 id', () => {
    const ids = Array.from({ length: 100 }, () => uniqueId())
    expect(new Set(ids).size).toBe(100)
  })

  test('相同前缀每次也不同', () => {
    const id1 = uniqueId('prefix')
    const id2 = uniqueId('prefix')
    expect(id1).not.toBe(id2)
  })
})
