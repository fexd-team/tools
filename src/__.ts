type AnyFunction = (...args: any[]) => any

/**
 * 函数参数占位符，支持偏应用（partial application）
 * @param func - 目标函数
 * @param context - 绑定的 this 上下文
 * @returns 接收预填参数的高阶函数，__ 本身作为占位符
 */
const __ = <T extends AnyFunction>(func: T, context?: any) => {
  return (...preArgs: any[]) =>
    function (...args: any[]): ReturnType<T> {
      return func.apply(
        context || this,
        preArgs
          .map((preArg) => (preArg === __ ? args.shift() : preArg))
          .concat(args)
      )
    }
}

export default __
