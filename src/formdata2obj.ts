export interface Formdata2ObjOptions {
  /** 启用嵌套键解析（如 key[0]、key[prop]），默认 false（与原版一致） */
  nested?: boolean
}

function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.replace(/\]/g, '').split('[')
  let current = obj

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    const nextKey = keys[i + 1]
    const isNextArray = nextKey === '' || /^\d+$/.test(nextKey)

    if (current[key] === undefined) {
      current[key] = isNextArray ? [] : {}
    }
    current = current[key]
  }

  const lastKey = keys[keys.length - 1]

  if (lastKey === '') {
    if (Array.isArray(current)) {
      current.push(value)
    }
  } else {
    const existing = current[lastKey]
    if (existing !== undefined) {
      if (Array.isArray(existing)) {
        existing.push(value)
      } else {
        current[lastKey] = [existing, value]
      }
    } else {
      current[lastKey] = value
    }
  }
}

/**
 * 将 FormData 转换为普通对象
 * 默认行为与原版一致（简单赋值，重复 key 后者覆盖），传入 { nested: true } 启用嵌套解析
 * @param formData - FormData 实例
 * @param options - 转换选项
 * @returns 对应的键值对象
 */
export default function formdata2obj(
  formData: FormData,
  options?: Formdata2ObjOptions
): Record<string, any> {
  const obj: any = {}

  if (!options || !options.nested) {
    formData.forEach((value, key) => {
      obj[key] = value
    })
    return obj
  }

  formData.forEach((value, key) => {
    if (key.indexOf('[') !== -1) {
      setNestedValue(obj, key, value)
    } else {
      const existing = obj[key]
      if (existing !== undefined) {
        if (Array.isArray(existing)) {
          existing.push(value)
        } else {
          obj[key] = [existing, value]
        }
      } else {
        obj[key] = value
      }
    }
  })

  return obj
}
