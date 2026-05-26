import get from './get'
import root from './globalThis'

const reg = /(Android)/i
/**
 * 判断当前是否为 Android 环境
 * @returns 如果是 Android 环境返回 true
 */
const isAndroid = (): boolean => reg.test(get(root, 'navigator.userAgent'))

export default isAndroid
