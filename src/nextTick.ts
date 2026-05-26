/**
 * 在下一个微任务中执行函数
 * @param func - 待执行的回调
 * @returns 微任务 Promise
 */
const nextTick = (func: (value?: any) => any) => Promise.resolve().then(func)

export default nextTick
