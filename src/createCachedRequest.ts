import singleflight from './singleflight'
import memoize, { CachedFunction } from './memoize'
import run from './run'

type CachedRequest<T> = T & { cache: Map<any, any> }

/**
 * 创建带缓存与过期时间的请求函数，内部合并并发请求（singleflight）
 * @param request - 原始异步请求函数
 * @param options - 配置项，含 cacheMinutes 缓存分钟数
 * @returns 带 cache 属性的缓存请求函数
 */
const createCachedRequest = <T extends (...args: any[]) => Promise<any>>(
  request: T,
  { cacheMinutes = 1 }: { cacheMinutes?: number } = {}
): CachedRequest<T> => {
  const memoizedFetch = memoize(singleflight(request as any), {
    disable: ({
      result,
      drop,
    }: {
      cache: Map<any, any>
      key: any
      result: any
      drop: () => void
    }) => {
      run(
        result,
        'then',
        () => {
          if (cacheMinutes > 0) {
            setTimeout(() => drop(), 1000 * 60 * cacheMinutes)
          }
        },
        () => {
          drop()
        }
      )
      return false
    },
  })

  return memoizedFetch as unknown as CachedRequest<T>
}

export default createCachedRequest
