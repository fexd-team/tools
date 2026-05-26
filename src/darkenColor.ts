import hexToRgb from './hexToRgb'

const rgbToHex = (r: number, g: number, b: number): string =>
  `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b
    .toString(16)
    .padStart(2, '0')}`

const darkenValue = (value: number, percentage: number): number =>
  Math.max(0, Math.min(255, Math.floor(value * (1 - percentage / 100))))

/**
 * 按百分比加深十六进制颜色
 * @param hexColor - 十六进制颜色值
 * @param percentage - 加深比例（0-100）
 * @returns 加深后的十六进制颜色
 */
const darkenColor = (hexColor: string, percentage: number): string => {
  let { r, g, b } = hexToRgb(hexColor)
  r = darkenValue(r, percentage)
  g = darkenValue(g, percentage)
  b = darkenValue(b, percentage)
  return rgbToHex(r, g, b)
}

export default darkenColor
