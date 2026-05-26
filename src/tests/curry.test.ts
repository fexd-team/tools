import curry from '../curry'

describe('curry', () => {
  test('两参数函数分步调用', () => {
    const add = curry((a: number, b: number) => a + b)
    expect(add(1)(2)).toBe(3)
  })

  test('两参数函数一次性调用', () => {
    const add = curry((a: number, b: number) => a + b)
    expect(add(1, 2)).toBe(3)
  })

  test('三参数函数分步调用', () => {
    const add3 = curry((a: number, b: number, c: number) => a + b + c)
    expect(add3(1)(2)(3)).toBe(6)
  })

  test('三参数函数部分分步调用', () => {
    const add3 = curry((a: number, b: number, c: number) => a + b + c)
    expect(add3(1, 2)(3)).toBe(6)
    expect(add3(1)(2, 3)).toBe(6)
  })

  test('单参数函数直接调用', () => {
    const double = curry((a: number) => a * 2)
    expect(double(5)).toBe(10)
  })

  test('零参数函数', () => {
    const fn = curry(() => 42)
    expect(fn()).toBe(42)
  })

  test('保持 this 上下文', () => {
    const obj = {
      value: 10,
      add: curry(function (this: any, a: number, b: number) {
        return this.value + a + b
      }),
    }
    expect(obj.add(1)(2)).toBe(13)
  })

  test('柯里化函数可复用', () => {
    const add = curry((a: number, b: number) => a + b)
    const add5 = add(5)
    expect(add5(3)).toBe(8)
    expect(add5(10)).toBe(15)
  })
})
