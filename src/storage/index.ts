import isNull from '../isNull'
import safeStringify from '../safeStringify'
import root from '../globalThis'

import withSupportive from './withSupportive'

/**
 * 本地存储工具，对 localStorage/sessionStorage 封装 JSON 序列化与容错
 */

const getter = (storage: Storage) =>
  withSupportive((key: string) => {
    let data = storage.getItem(key)
    let result

    if (data === 'undefined' || isNull(data)) {
      result = undefined
    } else {
      try {
        result = JSON.parse(data as string)
      } catch (err) {
        console.error('[ERROR storage.get --> JSON.parse]', err)
        result = data
      }
    }

    return result
  })

const setter = (storage: Storage) =>
  withSupportive((key: string, value: any) => {
    let data

    try {
      data = safeStringify(value)
    } catch (err) {
      console.error('[ERROR storage.set --> safeStringify]', err)
      data = value
    }

    storage.setItem(key, data)

    return data
  })

const remover = (storage: Storage) =>
  withSupportive((key: string) => {
    storage.removeItem(key)
  })

export const get = getter(root.localStorage)
export const set = setter(root.localStorage)
export const remove = remover(root.localStorage)

export const getSession = getter(root.sessionStorage)
export const setSession = setter(root.sessionStorage)
export const removeSession = remover(root.sessionStorage)

export default {
  get,
  set,
  remove,
  getSession,
  setSession,
  removeSession,
}
