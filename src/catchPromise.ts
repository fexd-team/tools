import run from './run'

/**
 * 捕获 Promise 结果或错误，返回 [err, data] 元组
 * @param promise - Promise 对象或返回 Promise 的函数
 * @returns 成功时为 [undefined, data]，失败时为 [err, undefined]
 */
const catchPromise: <T = any>(
  promise: Promise<T> | (() => Promise<T>)
) => Promise<[undefined, T] | [any, undefined]> = async (promise) => {
  try {
    const value = await run(promise)
    return [undefined, value]
  } catch (err) {
    return [err, undefined]
  }
}

export default catchPromise
