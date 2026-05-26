import isString from './isString'

/**
 * 将字符串首字母大写，多词按空格分别处理
 * @param word - 源字符串
 * @returns 首字母大写后的字符串
 */
export default function capitalize(word: string): string {
  if (!isString(word)) {
    return ''
  }

  if (/\s/.test(word)) {
    return word.split(' ').map(capitalize).join(' ')
  }

  return word
    .split('')
    .map((letter, idx) => (idx === 0 ? letter.toUpperCase() : letter))
    .join('')
}
