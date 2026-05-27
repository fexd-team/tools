import isArray from './isArray'
import isObject from './isObject'
import run from './run'

/**
 * 深度遍历对象或数组并变换各节点
 * @param object - 源对象或数组
 * @param options - 配置项（handleItem、filterItem、mutable、prefixKeys）
 * @returns 变换后的对象或数组
 */
const deepMapItem = (
  object: any,
  options?: {
    handleItem?: (item: any, key: any, keyPath: any[]) => any
    filterItem?: (item: any, key: any, keyPath: any[]) => boolean
    /** 是否原地修改对象/数组，默认 false（返回新副本） */
    mutable?: boolean
    prefixKeys?: any[]
  }
) => {
  const {
    handleItem = (value: any) => value,
    filterItem = () => true,
    mutable = false,
    prefixKeys = [],
  } = options ?? {}
  const childOptions = {
    handleItem,
    filterItem,
    mutable,
    prefixKeys: [] as any[],
  }

  if (isArray(object)) {
    const source = mutable ? object : [...object]
    for (let i = 0; i < source.length; i++) {
      const item = source[i]
      const nextPrefixKeys = [...prefixKeys, i]
      if (run(filterItem, undefined, item, i, nextPrefixKeys) === false) {
        continue
      }
      const nextItem = deepMapItem(item, {
        ...childOptions,
        prefixKeys: nextPrefixKeys,
      })
      source[i] = run(handleItem, undefined, nextItem, i, nextPrefixKeys)
    }
    return source
  }

  if (isObject(object)) {
    const result = mutable ? object : { ...object }
    for (const key in result) {
      const value = result[key]
      const nextPrefixKeys = [...prefixKeys, key]
      try {
        if (run(filterItem, undefined, value, key, nextPrefixKeys) === false) {
          continue
        }
        const nextValue = deepMapItem(value, {
          ...childOptions,
          prefixKeys: nextPrefixKeys,
        })
        result[key] = run(handleItem, undefined, nextValue, key, nextPrefixKeys)
      } catch {}
    }
    return result
  }

  if (prefixKeys.length > 0) {
    return object
  }
  return run(handleItem, undefined, object, undefined, prefixKeys)
}

export default deepMapItem
