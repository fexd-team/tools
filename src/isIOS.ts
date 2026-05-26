import get from './get'
import root from './globalThis'

const reg = /(iPhone|iPad|iPod|iOS)/i

/**
 * 判断当前是否为 iOS 环境（包括 iPadOS 桌面模式）
 * @returns 如果是 iOS 环境返回 true
 */
const isIOS = (): boolean => {
  const ua: string = get(root, 'navigator.userAgent') || ''
  if (reg.test(ua)) return true
  const platform: string = get(root, 'navigator.platform') || ''
  if (platform === 'MacIntel' && get(root, 'navigator.maxTouchPoints') > 1) {
    return true
  }
  return false
}

export default isIOS
