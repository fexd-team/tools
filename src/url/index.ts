import isNull from '../isNull'
import get from '../get'
import run from '../run'
import root from '../globalThis'
import __ from '../__'

/**
 * URL 参数工具集：解析单个/全部参数、生成 query string
 */

const safeDecode = (value: any) => {
  const decoders = [root.decodeURIComponent, root.decodeURI, root.unescape]

  for (let decode of decoders) {
    try {
      return decode(value)
    } catch (error) {
      continue
    }
  }

  return value
}

export const paramEscape = __(param)(__, __, root.unescape)

/**
 * 获取 URL 中指定参数的值
 * @param name - 参数名
 * @param url - 完整 URL 或 search 部分，默认 location.search
 * @param decode - 解码函数
 */
export function param(
  name: string,
  url = root.location.search,
  decode = safeDecode
): any {
  let res = get<string>(run(url, 'split', '?'), '1', '').match(
    new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
  )

  return isNull(res) ? undefined : decode((res as RegExpMatchArray)[2])
}

export const allParamEscape = __(allParam)(__, root.unescape)

/**
 * 解析 URL 中所有参数为键值对对象
 * @param url - 完整 URL 或 search 部分
 * @param decode - 解码函数
 */
export function allParam(url = root.location.search, decode = safeDecode): any {
  const search = get<string>(url.split('?'), [1], '')

  if (search.length === 0) {
    return {}
  }

  return search.split('&').reduce((res, pair) => {
    const eqIdx = pair.indexOf('=')
    if (eqIdx === -1) {
      res[pair] = ''
      return res
    }
    const key = pair.slice(0, eqIdx)
    const value = pair.slice(eqIdx + 1)
    res[key] = decode(value)
    return res
  }, {} as Record<string, any>)
}

/**
 * 将对象生成 query string（含前导 ?）
 * @param paramObj - 键值对对象
 * @param encode - 编码函数，默认 encodeURIComponent
 */
export function generateParamStr(
  paramObj: Object,
  encode: Function = root.encodeURIComponent
) {
  return `?${Object.entries(paramObj)
    .map(([key, value]) => [key, encode(value)].join('='))
    .join('&')}`
}

export default {
  paramEscape,
  param,
  allParamEscape,
  allParam,
  generateParamStr,
}
