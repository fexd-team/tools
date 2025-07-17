import run from './run'

/**
 * 接收一个返回任何类型的 Promise 对象，并在 Promise 被解决或拒绝后返回一个元组。
 * 如果 Promise 被解决，则第一个元素为 undefined，第二个元素为 Promise 解决时的值。
 * 如果 Promise 被拒绝，则第一个元素为 Promise 被拒绝时的错误对象，第二个元素为 undefined。
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
