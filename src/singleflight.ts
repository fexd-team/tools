import lock, { LockedFunction } from './lock'

export type SingleflightFunction<T> = (() => Promise<T>) &
  Pick<LockedFunction, 'unlock' | 'isLocked'>

/**
 * 同一时刻对同一异步请求合并等待，不重复发起（singleflight 模式）
 * @param query - 异步查询函数，需要返回 Promise
 * @returns 带 unlock/isLocked 的包装函数
 */
const singleflight = <T = any>(
  query: () => Promise<T>
): SingleflightFunction<T> => {
  const wrappedFunc = lock(function (...args) {
    return new Promise<T>(async (resolve, reject) => {
      try {
        const result = await query.apply(this, args)
        resolve(result)
      } catch (error) {
        reject(error)
      } finally {
        wrappedFunc.unlock()
      }
    })
  })

  return wrappedFunc as unknown as SingleflightFunction<T>
}

export default singleflight
