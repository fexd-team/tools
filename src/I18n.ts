// import set from './set'
import get from './get'
import run from './run'
import value from './value'
import isArray from './isArray'
import isObject from './isObject'
import isFunction from './isFunction'
import memoize from './memoize'
import EventBus from './EventBus'
import deepMerge from './deepMerge'
import isPromiseLike from './isPromiseLike'

const NSReg = /:/

export interface I18nConfig {
  types?: Record<
    string,
    {
      resources?: Record<any, any> | false
      format?: any
    }
  >
  defaultType?: string
  fallback?: I18n[] | Record<any, any>
  translateFallback?: ((keys: any, options: any) => any) | any
}

// const defaultTranslateFallback = (keys) => keys

export default class I18n {
  static instances = []
  static language = undefined
  static get lng() {
    return I18n.language
  }
  static eventBus = new EventBus()
  /**
   * [template 简易字符串模板函数]
   * e.g: template('hello {{name}}', { name: 'CJY' }) ==> 'hello CJY'
   * @param  {[字符串]} str  [description]
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  static template = (
    str = '',
    data = {},
    { split = false, fallback = '(unknow)' } = {}
  ) => {
    const tmpReg = /{{\s*\w*\s*}}/g
    const isFunctionFallback = isFunction(fallback)
    const vars = (str.match(tmpReg) || []).map((val) => {
      const origWord = val
      val = val.replace(/({{\s*)|(\s*}})/g, '')
      const fallbackWord = isFunctionFallback
        ? fallback(val, origWord)
        : fallback
      val = value(data[val], fallbackWord)
      return val
    })

    const slitted = (str.split(tmpReg) || []).reduce((res, word) => {
      return res.concat([word, vars.shift()])
    }, [])

    return split ? slitted : slitted.join('')
  }
  static load = (...loaders) =>
    memoize(async () => {
      const res = await Promise.all(
        loaders.map((loader) => {
          const res = run(loader)
          const getValue = (res) => get(res, 'default', res)

          return isPromiseLike(res)
            ? (res as any).then(getValue)
            : getValue(res)
        })
      )

      return Object.assign({}, ...res)
    })
  static applyLanguage = async (language) => {
    if (!language) {
      return
    }
    await Promise.all(
      I18n.instances.map((instance) => instance.applyLanguage(language))
    )

    I18n.language = language
    I18n.eventBus.emit('change', language)
  }

  static applyLng = I18n.applyLanguage

  resources = {}
  language = undefined
  get lng() {
    return this.language
  }
  eventBus = new EventBus()
  config: I18nConfig

  constructor(config: I18nConfig) {
    this.config = config

    I18n.instances.push(this)
    if (I18n.language) {
      this.applyLanguage(I18n.language)
    } else {
      I18n.eventBus.once('change', (language) => {
        this.applyLanguage(I18n.language)
      })
    }
  }

  applyConfig = async (config: I18nConfig) => {
    deepMerge(this.config, config)

    if (!!this.language) {
      return this.applyLanguage(this.language)
    }

    if (I18n.language) {
      await this.applyLanguage(I18n.language)
    } else {
      I18n.eventBus.once('change', (language) => {
        this.applyLanguage(I18n.language)
      })
    }
  }

  applyLanguage = async (language) => {
    if (!language) {
      return
    }

    await Promise.all(
      Object.entries(this.config.types).map(async ([type, { resources }]) => {
        if (!this.resources[type]) {
          this.resources[type] = {}
        }
        this.resources[type][language] = await run(
          get(resources, language, resources)
        )
      })
    )
    this.language = language
    this.eventBus.emit('change', language)
  }

  applyLng = this.applyLanguage

  translate = (str, options = {}) => {
    const useNamespace = NSReg.test(str)
    const [_keys, type = this.config.defaultType || 'default'] = str.split('@')

    let keys = _keys
    let namespace

    if (useNamespace) {
      ;[namespace, keys] = _keys.split(':')
    }

    if (!useNamespace && this.language) {
      const format = get(
        this.config,
        `types.${type}.format.${this.language}`,
        get(this.config, `types.${type}.format`, I18n.template)
      )
      const useResource = get(this.config, `types.${type}.resources`) !== false

      if (isFunction(format)) {
        const res = run(
          format,
          undefined,
          useResource
            ? get(this.resources, `${type}.${this.language}.${keys}`)
            : keys,
          options
        )

        if (res) {
          return res
        }
      }
    }

    const fallbackRes =
      this.fallbackTranslate(`${keys}@${type}`, options, namespace) ||
      run(this.config, 'translateFallback', keys, options)

    if (fallbackRes) {
      return fallbackRes
    }

    if ((options as any)._fbT) {
      return undefined
    }

    return keys
  }

  fallbackTranslate = (str, options, namespace) => {
    if (!isArray(this.config.fallback) && !isObject(this.config.fallback)) {
      return undefined
    }

    const fallbackOptions = {
      ...options,
      _fbT: true,
    }

    if (namespace) {
      const res = run(
        this.config.fallback,
        `${namespace}.t`,
        str,
        fallbackOptions
      )

      if (res) {
        return res
      }
    } else {
      for (const i18n of Object.values(this.config.fallback)) {
        const res = i18n.t(str, fallbackOptions)

        if (res) {
          return res
        }
      }
    }

    return undefined
  }

  t = this.translate
}
