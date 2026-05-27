import isFunction from './isFunction'

/**
 * 创建代理对象的 getter，对属性值进行自定义处理
 * @param target - 被代理的目标对象
 * @param valueHandler - 属性值处理函数
 * @returns 代理后的对象，失败时返回原对象
 */
export default function createProxyGetter(
  target: any,
  valueHandler: (value: any, prop: any) => any
) {
  try {
    return new Proxy(target, {
      get: (obj, prop) => {
        if (
          typeof prop === 'symbol' ||
          !Object.prototype.hasOwnProperty.call(obj, prop)
        ) {
          return Reflect.get(obj, prop)
        }
        return isFunction(valueHandler)
          ? valueHandler(obj[prop], prop)
          : valueHandler
      },
    })
  } catch (error) {
    console.error('[createProxyGetter] error', error)
    return target
  }
}
