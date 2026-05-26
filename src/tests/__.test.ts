import __ from '../__'

describe('__', () => {
  test('部分应用 - 填充前置参数', () => {
    const add = (a: number, b: number) => a + b
    const add5 = __(add)(5)
    expect(add5(3)).toBe(8)
  })

  test('__ 占位符 - 后置参数填充', () => {
    const add = (a: number, b: number) => a + b
    const add5 = __(add)(__, 5)
    expect(add5(3)).toBe(8)
  })

  test('多参数部分应用', () => {
    const add3 = (a: number, b: number, c: number) => a + b + c
    const fn = __(add3)(1, __, 3)
    expect(fn(2)).toBe(6)
  })

  test('指定 context', () => {
    const obj = { multiplier: 10 }
    const multiply = function (this: any, a: number) {
      return a * this.multiplier
    }
    const fn = __(multiply, obj)(5)
    expect(fn()).toBe(50)
  })

  test('多个 __ 占位符', () => {
    const add4 = (a: number, b: number, c: number, d: number) => a + b + c + d
    const fn = __(add4)(__, 2, __, 4)
    expect(fn(1, 3)).toBe(10)
  })

  test('无占位符完全预填充', () => {
    const add = (a: number, b: number) => a + b
    const fn = __(add)(1, 2)
    expect(fn()).toBe(3)
  })
})
