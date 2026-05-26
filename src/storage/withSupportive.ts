import globalThis from '../globalThis'
import isExist from '../isExist'

let isStorageSupported = true

const TEST_KET = '__testSupportive__'
const storage = globalThis.localStorage

if (!isExist(storage)) {
  isStorageSupported = false
}

try {
  storage.setItem(TEST_KET, '__testSupportive__')
  storage.removeItem(TEST_KET)
} catch (err) {
  isStorageSupported = false
}

/**
 * Storage 兼容性包装：若浏览器不支持 localStorage 则返回警告函数
 * @param func - 原始操作函数
 * @returns 原函数或降级的 warn 函数
 */
export default function withSupportive(func: Function): Function {
  if (!isStorageSupported) {
    return () => console.warn('Storage unsupported')
  }

  return func
}
