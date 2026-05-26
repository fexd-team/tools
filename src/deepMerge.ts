import isObject from './isObject'

/**
 * 递归深度合并多个对象，后者覆盖前者
 * @param sources - 待合并的对象列表
 * @returns 合并后的对象
 */
const deepMerge = (...sources: any[]) => {
  const onlyObjects = sources.filter((s) => isObject(s))

  if (onlyObjects.length === 0) {
    return {}
  }

  if (onlyObjects.length === 1) {
    return onlyObjects[0]
  }

  const [target, ...rest] = onlyObjects

  rest.forEach((object) => {
    for (const key in object) {
      const targetValue = target[key]
      const sourceValue = object[key]

      if (isObject(targetValue) && isObject(sourceValue)) {
        target[key] = deepMerge(Object.assign({}, targetValue), sourceValue)
      } else {
        target[key] = sourceValue
      }
    }
  })

  return target
}

export default deepMerge
