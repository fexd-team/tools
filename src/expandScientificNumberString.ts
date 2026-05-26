/**
 * 将科学计数法字符串展开为完整十进制字符串
 * @param str - 科学计数法或普通数字字符串
 * @returns 展开后的十进制字符串，无法解析时原样返回
 */
const expandScientificNumberString = (str: string): string => {
  if (typeof str !== 'string' || str.length === 0) return str

  if (!/[eE]/.test(str)) return str

  const isNegative = str.startsWith('-')
  const absStr = str.startsWith('-') || str.startsWith('+') ? str.slice(1) : str
  const [mantissa, expStr] = absStr.split(/[eE]/)
  const exp = parseInt(expStr, 10)

  if (Number.isNaN(exp)) return str

  const [intPart, decPart = ''] = mantissa.split('.')

  const allDigits = intPart + decPart
  const decPos = intPart.length + exp

  let result: string
  if (decPos >= allDigits.length) {
    result = allDigits + '0'.repeat(decPos - allDigits.length)
  } else if (decPos <= 0) {
    result = '0.' + '0'.repeat(-decPos) + allDigits
  } else {
    result = allDigits.slice(0, decPos) + '.' + allDigits.slice(decPos)
  }

  return (isNegative ? '-' : '') + result
}

export default expandScientificNumberString
