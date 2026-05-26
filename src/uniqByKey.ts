/**
 * 按对象指定键对数组去重
 * @param array - 源数组
 * @param key - 去重依据的属性键
 * @returns 去重后的新数组
 */
const uniqByKey = <T = any>(array = [], key): T[] => {
  const cache = {}

  return array.filter((item) => {
    if (!(key in item)) {
      return true
    }

    const value = item[key]

    if (value in cache) {
      return false
    }

    cache[value] = true
    return true
  })
}

export default uniqByKey
