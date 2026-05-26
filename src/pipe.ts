import run from './run'

/**
 * 从左到右依次组合函数，形成新的流水线函数
 * @param handlers - 待组合的函数序列
 * @returns 接收初始参数并依次传递的函数
 */
const pipe =
  <T>(...handlers: Function[]) =>
  (arg: any): T =>
    handlers.reduce((res, handler) => run(handler, undefined, res), arg)

export default pipe
