import hexToRgb from './hexToRgb'

/**
 * 计算十六进制颜色的感知亮度
 * @param hexColor - 十六进制颜色值
 * @returns 亮度值（0-255）
 */
const getBrightness = (hexColor: string): number => {
  const { r, g, b } = hexToRgb(hexColor)
  return 0.299 * r + 0.587 * g + 0.114 * b
}

export default getBrightness
