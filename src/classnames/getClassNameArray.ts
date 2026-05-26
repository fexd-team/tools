import isObject from '../isObject'
import isArray from '../isArray'
import isString from '../isString'
import flatten from '../flatten'

const mapObjectClassName = (obj: Object): string[] =>
  Object.entries(obj)
    .filter(([, value]) => !!value)
    .map(([key]) => key)

const parseClassName = (className: string): string | string[] =>
  /\s/.test(className) ? className.trim().split(' ') : className

/**
 * 将混合参数（字符串/对象/数组）解析为扁平的 className 数组
 * @param args - 类名参数，支持字符串、对象（truthy key）、嵌套数组
 * @returns 扁平化的类名字符串数组
 */
const getClassNameArray = (...args: any[]): string[] =>
  flatten(
    args
      .filter((arg) => !!arg)
      .map((arg) => {
        if (isObject(arg)) {
          return mapObjectClassName(arg)
        }

        if (isArray(arg)) {
          return getClassNameArray(...arg)
        }

        if (isString(arg)) {
          return parseClassName(arg)
        }

        return String(arg)
      })
  )

export default getClassNameArray
