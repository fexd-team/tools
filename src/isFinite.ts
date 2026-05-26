const _isFinite =
  typeof Number.isFinite === 'function'
    ? Number.isFinite
    : (value: any) =>
        typeof value === 'number' &&
        value === value &&
        value !== Infinity &&
        value !== -Infinity

/**
 * 判断值是否为有限数字（排除 NaN、Infinity、-Infinity）
 *
 * 注意：该导出名与全局 `isFinite` 同名，解构导入时会遮蔽全局版本。
 * 与全局 `isFinite` 不同，本函数不会对非 number 类型做隐式转换。
 *
 * @param value - 要检查的值
 * @returns 如果是有限数字返回 true
 */
const isFinite = (value: any): value is number =>
  typeof value === 'number' && _isFinite(value)

export default isFinite
