import get from './get'
import root from './globalThis'
import isIOS from './isIOS'
import isExist from './isExist'

/**
 * 判断当前是否为 WKWebView
 * @returns 如果是 WKWebView 返回 true
 */
const isWKWebview = (): boolean => isIOS() && isExist(get(root, 'webkit'))

export default isWKWebview
