/**
 * 返回指定毫秒后 resolve 的 Promise
 * @param time - 延迟时间（毫秒），省略或 Infinity 时不 resolve
 * @returns 延迟后 resolve 的 Promise
 */
const delay = (time?: number) =>
  new Promise((resolve) => {
    if (time === Infinity) {
      // Never resolve
      return
    }
    setTimeout(resolve, time)
  })

export default delay
