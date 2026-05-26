import isDesktop from './isDesktop'
import isAndroid from './isAndroid'
import isIOS from './isIOS'

/**
 * 判断当前是否为移动设备
 * @returns 如果是移动设备返回 true
 */
const isMobile = (): boolean => !isDesktop() && (isAndroid() || isIOS())

export default isMobile
