import pipe from '../pipe'

describe('pipe', () => {
  test('单函数管道', () => {
    const result = pipe((x: number) => x * 2)(5)
    expect(result).toBe(10)
  })

  test('多函数管道', () => {
    const result = pipe<number>(
      (x: number) => x + 1,
      (x: number) => x * 2,
      (x: number) => x - 3
    )(5)
    expect(result).toBe(9)
  })

  test('空管道返回原值', () => {
    const result = pipe()(5)
    expect(result).toBe(5)
  })

  test('类型转换管道', () => {
    const result = pipe(
      (x: number) => String(x),
      (x: string) => x + '!',
      (x: string) => x.toUpperCase()
    )(42)
    expect(result).toBe('42!')
  })

  test('数组操作管道', () => {
    const result = pipe(
      (arr: number[]) => arr.filter((x) => x > 2),
      (arr: number[]) => arr.map((x) => x * 2)
    )([1, 2, 3, 4])
    expect(result).toEqual([6, 8])
  })

  test('管道中抛出错误会传播', () => {
    const fn = pipe(
      (_x: number) => {
        throw new Error('pipe error')
      },
      (x: number) => x
    )
    expect(() => fn(1)).toThrow('pipe error')
  })

  test('管道传递 undefined', () => {
    const result = pipe(
      (_x: number) => undefined,
      (x: any) => x
    )(5)
    expect(result).toBeUndefined()
  })

  test('管道传递 null', () => {
    const result = pipe(
      (_x: number) => null,
      (x: any) => x
    )(5)
    expect(result).toBeNull()
  })

  test('管道传递对象', () => {
    const result = pipe(
      (x: number) => ({ value: x }),
      (obj: { value: number }) => obj.value * 2
    )(10)
    expect(result).toBe(20)
  })
})
