/**
 * 浅合并多个对象到目标对象
 * @param first - 基础对象
 * @param rest - 待合并的源对象
 * @returns 合并后的新对象
 */
const shallowMerge = <T extends Record<string, any>>(
  first: T,
  ...rest: Record<string, any>[]
): T & Record<string, any> => {
  const result = { ...first } as Record<string, any>
  for (const obj of rest) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = obj[key]
      }
    }
  }
  return result as T
}

export default shallowMerge
