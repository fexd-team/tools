import isArray from '../isArray'
import isUndefined from '../isUndefined'
import root from '../globalThis'
import curry from '../curry'

const getExt = curry<(value: string, index: number, array: string[]) => any>(
  (src: string, key: string) => {
    const ext = root[key]
    !isUndefined(key) &&
      isUndefined(ext) &&
      console.warn(`No external named '${key}' in global after loaded ${src}`)
    return ext
  }
)

/**
 * 从全局获取脚本加载后的 externals 导出变量
 * @param src - 脚本 URL（用于 warn 提示）
 * @param externals - 要获取的全局变量名或名称数组
 */
const getExternals = (src: string, externals?: string | string[]) =>
  isArray(externals)
    ? (externals as string[]).map(getExt(src))
    : getExt(src, externals)

export default getExternals
