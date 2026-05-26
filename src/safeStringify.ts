import isReactValidElement from './isReactValidElement'

/**
 * 安全 JSON 序列化，处理循环引用与 React 元素
 * @param object - 待序列化的对象
 * @returns JSON 字符串
 */
const safeStringify = (object: any) => {
  const ancestors: any[] = []

  return JSON.stringify(object, function (key, value) {
    if (isReactValidElement(value)) {
      return undefined
    }

    if (typeof value === 'object' && value !== null) {
      while (ancestors.length > 0 && ancestors[ancestors.length - 1] !== this) {
        ancestors.pop()
      }

      if (ancestors.includes(value)) return '[Circular]'
      ancestors.push(value)
    }

    return value
  })
}

export default safeStringify
