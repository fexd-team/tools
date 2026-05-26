import isPromiseLike from '../isPromiseLike'

describe('isPromiseLike', () => {
  test('Promise 实例', () => {
    expect(isPromiseLike(Promise.resolve())).toBe(true)
    expect(isPromiseLike(new Promise(() => {}))).toBe(true)
  })

  test('thenable 对象', () => {
    expect(isPromiseLike({ then: () => {} })).toBe(true)
  })

  test('非 Promise 值', () => {
    expect(isPromiseLike(null)).toBe(false)
    expect(isPromiseLike(undefined)).toBe(false)
    expect(isPromiseLike({})).toBe(false)
    expect(isPromiseLike(123)).toBe(false)
    expect(isPromiseLike('string')).toBe(false)
    expect(isPromiseLike(() => {})).toBe(false)
  })
})
