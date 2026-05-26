/**
 * 将数字按指定小数位四舍五入，返回 number 类型
 * @param num - 源数字
 * @param fractionDigits - 保留的小数位数，默认 2
 * @returns 四舍五入后的数字
 */
const toFixed = (num: number = 0, fractionDigits: number = 2): number => {
  const sign = num >= 0 ? 1 : -1
  const factor = Math.pow(10, fractionDigits)
  return (sign * Math.round((Math.abs(num) + Number.EPSILON) * factor)) / factor
}

export default toFixed
