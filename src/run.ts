import isString from './isString'
import isFunction from './isFunction'
import get, { KType } from './get'

/**
 * 安全执行对象路径上的函数或取值
 * @param obj - 源对象
 * @param keys - 属性路径，支持点号字符串或数组
 * @param args - 调用函数时传入的参数
 * @returns 函数返回值或路径上的值
 */
const run = <T = any>(obj: any, keys: KType = [], ...args: any[]): T => {
  keys = isString(keys) ? (keys as string).split('.') : keys

  const func = get<Function | any>(obj, keys)
  const context = get<any>(obj, (keys as any[]).slice(0, -1))

  return isFunction(func) ? (func as Function).call(context, ...args) : func
}

export default run
