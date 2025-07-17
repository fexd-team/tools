import isFunction from './isFunction'

export default function createProxyGetter(
  target: any,
  valueHandler: (value: any, prop: any) => any
) {
  try {
    return new Proxy(target, {
      get: (obj, prop) => {
        if (prop in obj) {
          return isFunction(valueHandler)
            ? valueHandler(obj?.[prop], prop)
            : valueHandler
        }
        return undefined
      },
    })
  } catch (error) {
    console.error('[createProxyGetter] error', error)
    return target
  }
}
