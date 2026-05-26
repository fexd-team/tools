import isArray from './isArray'
import isObject from './isObject'
import run from './run'

/**
 * 深度遍历对象或数组并变换各节点
 * @param object - 源对象或数组
 * @param options - 配置项（handleItem、filterItem、prefixKeys）
 * @returns 变换后的对象或数组
 */
const deepMapItem = (
  object: any,
  options?: {
    handleItem?: (item: any, key: any, keyPath: any[]) => any
    filterItem?: (item: any, key: any, keyPath: any[]) => boolean
    prefixKeys?: any[]
  }
) => {
  const {
    handleItem = (value: any) => value,
    filterItem = () => true,
    prefixKeys = [],
  } = options ?? {}

  if (isArray(object)) {
    return object.map((item: any, index: number) => {
      const nextPrefixKeys = [...prefixKeys, index]
      if (run(filterItem, undefined, item, index, nextPrefixKeys) === false) {
        return item
      }
      const nextItem = deepMapItem(item, {
        handleItem,
        filterItem,
        prefixKeys: nextPrefixKeys,
      })
      return run(handleItem, undefined, nextItem, index, nextPrefixKeys)
    })
  }

  if (isObject(object)) {
    for (const key in object) {
      const value = object?.[key]
      const nextPrefixKeys = [...prefixKeys, key]
      if (run(filterItem, undefined, value, key, nextPrefixKeys) === false) {
        object[key] = value
        continue
      }
      const nextValue = deepMapItem(value, {
        handleItem,
        filterItem,
        prefixKeys: nextPrefixKeys,
      })
      object[key] = run(handleItem, undefined, nextValue, key, nextPrefixKeys)
    }
  }

  return run(handleItem, undefined, object, undefined, prefixKeys)
}

export default deepMapItem
