let uuid = 0

/**
 * 生成带前缀的唯一 ID
 * @param prefix - ID 前缀，默认空字符串
 * @returns 唯一 ID 字符串
 */
const uniqueId = (prefix: string = ''): string =>
  `${prefix}_${++uuid}_${Date.now()}_${Math.floor(Math.random() * 1000000)}`

export default uniqueId
