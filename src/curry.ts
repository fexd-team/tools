/**
 * 将多参数函数转换为柯里化形式
 * @param fn - 待柯里化的函数
 * @returns 支持分次传参的柯里化函数
 */
const curry = <T = any>(fn: Function): ((...args: any[]) => T) =>
  function (...args: any[]): any {
    return args.length < fn.length
      ? curry<T>(fn.bind(this, ...args))
      : fn.apply(this, args)
  } as any

export default curry
