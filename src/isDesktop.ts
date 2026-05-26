import get from './get'
import root from './globalThis'

const platformReg =
  /(Win32|Win64|MacIntel|Linux x86_64|Linux x86|FreeBSD|CrOS)/i

/**
 * 判断当前是否为桌面设备
 * 排除 iPadOS 桌面模式（通过 maxTouchPoints 区分真实 Mac 和 iPad）
 * @returns 如果是桌面设备返回 true
 */
const isDesktop = (): boolean => {
  const platform: string = get(root, 'navigator.platform') || ''
  if (!platformReg.test(platform)) return false
  if (platform === 'MacIntel' && get(root, 'navigator.maxTouchPoints') > 1) {
    return false
  }
  return true
}

export default isDesktop
