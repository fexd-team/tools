// fork from https://github.com/smiranton-ua/deep-merge-js/blob/master/lib/deepmerge.js
import isObject from './isObject'

const deepMerge = (...sources) => {
  const onlyObjects = sources.filter((s) => isObject(s))

  // in case of not valid objects in the arguments
  if (onlyObjects.length === 0) {
    return {}
  }

  // in case of only one valid object in the arguments
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
