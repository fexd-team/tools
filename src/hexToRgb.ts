type HexRgbResult = { r: number; g: number; b: number; a?: number }

/**
 * 将十六进制颜色转换为 RGB 对象
 * @param hex - 十六进制颜色字符串
 * @returns 包含 r、g、b 及可选 a 的对象
 */
const hexToRgb = (hex: string): HexRgbResult => {
  const normalized = hex.replace(/^#/, '')
  let fullHex: string

  switch (normalized.length) {
    case 3:
      fullHex =
        normalized[0] +
        normalized[0] +
        normalized[1] +
        normalized[1] +
        normalized[2] +
        normalized[2]
      break
    case 4:
      fullHex =
        normalized[0] +
        normalized[0] +
        normalized[1] +
        normalized[1] +
        normalized[2] +
        normalized[2] +
        normalized[3] +
        normalized[3]
      break
    case 6:
    case 8:
      fullHex = normalized
      break
    default:
      fullHex = normalized
  }

  const result: HexRgbResult = {
    r: parseInt(fullHex.slice(0, 2), 16),
    g: parseInt(fullHex.slice(2, 4), 16),
    b: parseInt(fullHex.slice(4, 6), 16),
  }

  if (fullHex.length === 8) {
    result.a = Math.round((parseInt(fullHex.slice(6, 8), 16) / 255) * 100) / 100
  }

  return result
}

export default hexToRgb
