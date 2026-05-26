export interface Obj2FormdataOptions {
  /** 使用下标形式 key[0] 而非 key[] 序列化数组 */
  indices?: boolean
  /** 将 null 视为 undefined（跳过该字段） */
  nullsAsUndefined?: boolean
  /** 布尔值序列化为 '1'/'0' 而非 'true'/'false' */
  booleansAsIntegers?: boolean
  /** 启用嵌套对象/数组递归序列化（默认 false，与原版行为一致） */
  nested?: boolean
}

function isFile(value: any): boolean {
  return (
    (typeof File !== 'undefined' && value instanceof File) ||
    (typeof Blob !== 'undefined' && value instanceof Blob)
  )
}

function serialize(
  formData: FormData,
  key: string,
  value: any,
  options: Obj2FormdataOptions
): void {
  if (value === undefined) return
  if (value === null) {
    if (!options.nullsAsUndefined) {
      formData.append(key, '')
    }
    return
  }

  if (value instanceof Date) {
    formData.append(key, value.toISOString())
    return
  }

  if (typeof value === 'boolean') {
    formData.append(
      key,
      options.booleansAsIntegers ? (value ? '1' : '0') : String(value)
    )
    return
  }

  if (isFile(value)) {
    formData.append(key, value)
    return
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const arrayKey = options.indices ? `${key}[${index}]` : `${key}[]`
      serialize(formData, arrayKey, item, options)
    })
    return
  }

  if (typeof value === 'object') {
    Object.keys(value).forEach((prop) => {
      serialize(formData, `${key}[${prop}]`, value[prop], options)
    })
    return
  }

  formData.append(key, String(value))
}

/**
 * 将普通对象序列化为 FormData
 * 默认行为与原版一致（简单 append），传入 { nested: true } 启用递归序列化
 * @param obj - 源对象
 * @param options - 序列化选项
 * @returns FormData 实例
 */
export default function obj2formdata(
  obj: Record<string, any>,
  options?: Obj2FormdataOptions
): FormData {
  const formData = new FormData()
  if (!obj || typeof obj !== 'object') return formData

  if (!options || !options.nested) {
    Object.keys(obj).forEach((key) => {
      formData.append(key, obj[key])
    })
    return formData
  }

  Object.keys(obj).forEach((key) => {
    serialize(formData, key, obj[key], options)
  })

  return formData
}
