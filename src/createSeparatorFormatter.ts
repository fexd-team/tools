import isUndefined from './isUndefined'
import isNumber from './isNumber'

/**
 * 创建分隔符格式化函数，支持数字千分位分隔与任意文本按长度分组
 * @param options - 分隔符、分组长度、是否反向、是否数字模式、小数点分隔符
 * @returns 格式化函数
 */
const createSeparatorFormatter =
  ({
    separator = ' ',
    length = 3,
    reverse = false,
    isNumber: isNumberFormat = false,
    decimalSeparator,
  }: {
    separator?: string
    length?: number
    reverse?: boolean
    isNumber?: boolean
    decimalSeparator?: string
  } = {}) =>
  (text): string => {
    if (isNumberFormat) {
      if (text === null || text === undefined) return ''

      const resolvedDecimal = !isUndefined(decimalSeparator)
        ? decimalSeparator
        : separator === '.'
        ? ','
        : '.'

      const str = text.toString()
      const dotIndex = str.indexOf('.')

      const addSeparator = (s: string) =>
        s.replace(
          new RegExp(`\\d{1,${length}}(?=(\\d{${length}})+$)`, 'g'),
          `$&${separator}`
        )

      if (dotIndex !== -1) {
        return (
          addSeparator(str.slice(0, dotIndex)) +
          resolvedDecimal +
          str.slice(dotIndex + 1)
        )
      } else {
        return addSeparator(str)
      }
    }

    text = isNumber(text) ? Math.floor(text) : text

    if (isUndefined(text)) {
      return text
    }

    let res: any = String(text).split('')

    if (!reverse) {
      res = res.reverse()
    }

    res = res.reduce((result, letter, index) => {
      result.unshift(
        letter,
        index > 0 && index % length === 0 ? separator : undefined
      )
      return result
    }, [])

    if (reverse) {
      res = res.reverse()
    }

    res = res.join('')

    return res
  }

export default createSeparatorFormatter
