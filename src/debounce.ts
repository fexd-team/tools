export type AnyFunction = (...args: any[]) => any

/**
 * [防抖]
 * @param {Function} func 执行函数
 * @param {Number} wait 多少毫秒后运行一次
 */
const debounce = <T extends AnyFunction>(func: T, wait: number = 16): T & { cancel: () => void } => {
  let timeout: any

  const debounced = function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, wait)
    return timeout
  }

  debounced.cancel = () => {
    clearTimeout(timeout)
    timeout = undefined
  }

  return debounced as unknown as T & { cancel: () => void }
}

export default debounce
