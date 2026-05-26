import isError from '../isError'

describe('isError', () => {
  test('Error 实例', () => {
    expect(isError(new Error())).toBe(true)
    expect(isError(new TypeError())).toBe(true)
    expect(isError(new RangeError())).toBe(true)
    expect(isError(new SyntaxError())).toBe(true)
    expect(isError(new ReferenceError())).toBe(true)
  })

  test('非 Error 值', () => {
    expect(isError({})).toBe(false)
    expect(isError('error')).toBe(false)
    expect(isError(null)).toBe(false)
    expect(isError(undefined)).toBe(false)
    expect(isError(1)).toBe(false)
  })

  test('Error 子类', () => {
    class CustomError extends Error {}
    expect(isError(new CustomError())).toBe(true)
  })

  test('EvalError / URIError', () => {
    expect(isError(new EvalError())).toBe(true)
    expect(isError(new URIError())).toBe(true)
  })

  test('类似 Error 结构但不是 Error 的对象', () => {
    expect(isError({ message: 'fake', stack: '' })).toBe(false)
  })
})
