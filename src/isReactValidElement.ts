/**
 * 判断值是否为有效 React 元素
 * @param object - 要检查的值
 * @returns 如果是有效 React 元素返回 true
 */
const isReactValidElement = (object: any): boolean => {
  return (
    typeof object === 'object' &&
    object !== null &&
    typeof object.$$typeof === 'symbol'
  )
}

export default isReactValidElement
