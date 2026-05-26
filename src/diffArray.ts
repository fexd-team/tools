import difference from './difference'

/**
 * 比较初始数组与当前数组，返回新增、移除与变更项
 * @param init - 初始数组
 * @param current - 当前数组
 * @returns 包含 add、remove、diff 字段的差异对象
 */
export default function diffArray<T = any>(init: T[], current: T[]) {
  const add = difference(current, init) as T[]
  const remove = difference(init, current) as T[]
  const diff = [...add, ...remove]

  return {
    add,
    remove,
    diff,
  }
}
