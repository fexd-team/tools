import * as url from './url'

/**
 * 解析 query string 为对象
 * @param str - 包含 ? 的 URL 或纯 query 字符串
 * @returns 键值对对象
 */
export const parse = (str) => url.allParam(str)

/**
 * 将对象序列化为 query string（不含前导 ?）
 * @param params - 键值对对象
 * @returns 序列化字符串
 */
export const stringify = (params = {}) =>
  url.generateParamStr(params).replace(/^.?/, '')

export default {
  parse,
  stringify,
}
