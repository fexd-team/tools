import isUndefined from './isUndefined'
import isNumber from './isNumber'

const getFormatter =
  ({
    separator = ' ',
    length = 3,
    reverse = false,
    isNumber: isNumberFormat = false,
  } = {}) =>
  (text): string => {
    if (isNumberFormat) {
      if (text === null || text === undefined) return ''

      const str = text.toString()
      const hasDot = str.indexOf('.') !== -1

      if (hasDot) {
        return str.replace(
          new RegExp(`(\\d)(?=(\\d{${length}})+\\.)`, 'g'),
          ($0, $1) => $1 + separator
        )
      } else {
        return str.replace(
          new RegExp(`\\d{1,${length}}(?=(\\d{${length}})+$)`, 'g'),
          `$&${separator}`
        )
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

export default getFormatter
