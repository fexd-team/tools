/**
 * 判断值是否为 React-like 类型（Element、Memo、ForwardRef、Lazy、Portal 等）
 * 通过检测 $$typeof 是否为 Symbol 实现，兼容 React 14~19 全版本
 * @param object - 要检查的值
 * @returns 如果具有 React 内部 $$typeof Symbol 标记返回 true
 */
const isReactElementLike = (object: any): boolean => {
  return (
    typeof object === 'object' &&
    object !== null &&
    typeof object.$$typeof === 'symbol'
  )
}

export default isReactElementLike
