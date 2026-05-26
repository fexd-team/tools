/**
 * 随机生成十六进制 RGB 颜色
 * @param min - RGB 各分量的最小值，默认 0
 * @returns 随机颜色的十六进制字符串
 */
const randomRGB = (min: number = 0): string => {
  const getValue = () => Math.floor(Math.random() * (255 - min) + min)
  const r = getValue().toString(16).padStart(2, '0')
  const g = getValue().toString(16).padStart(2, '0')
  const b = getValue().toString(16).padStart(2, '0')
  return `#${r}${g}${b}`
}

export default randomRGB
