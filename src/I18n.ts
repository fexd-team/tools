// import set from './set'
import get from './get'
import run from './run'
import value from './value'
import isArray from './isArray'
import isObject from './isObject'
import isFunction from './isFunction'
import memoize from './memoize'
import EventBus from './EventBus'
import merge, { DeepMergeOptions, MergeMode } from './merge'
import isPromiseLike from './isPromiseLike'
import random from './random'

const NSReg = /:/

export interface I18nConfig {
  types?: Record<
    string,
    {
      resources?: Record<any, any> | false
      format?: any
    }
  >
  splitByDot?: boolean | 'auto'
  defaultType?: string
  fallback?: I18n[] | Record<any, any>
  translateFallback?: ((keys: any, options: any) => any) | any
  /**
   * applyConfig 的默认合并模式。
   * - 'override'（默认）: 新值覆盖已有值
   * - 'supplement': 仅补充缺失的键，不覆盖已有值
   *
   * 调用 applyConfig 时显式传入的 mode 会覆盖此默认值。
   */
  defaultApplyMode?: MergeMode
}

export interface ApplyConfigOptions extends DeepMergeOptions {
  /**
   * 补充优先级 (数值越大越优先)。仅在 mode='supplement' 时生效。
   *
   * 行为:
   * - 未指定: 传统 supplement 行为（不覆盖已有值）
   * - 指定数值: 写入时与已有值的优先级比较
   *   - 当前 > 已有 → 覆盖（无论 target 是否已有值）
   *   - 当前 = 已有 → 不覆盖（先到先得）
   *   - 当前 < 已有 → 跳过
   */
  priority?: number
}

// const defaultTranslateFallback = (keys) => keys

export default class I18n {
  static instances = []
  static language = undefined
  static documentEventName = 'fexd-I18n-change'
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
    data: Record<string, any> = {},
    {
      split = false,
      fallback = '(unknow)' as string | ((key: string, orig: string) => string),
    } = {}
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

  resources: Record<string, Record<string, any>> = {}
  language = undefined
  key = random(0, 99999)
  documentEventSilent = false
  get lng() {
    return this.language
  }
  eventBus = new EventBus()
  config: I18nConfig
  // 记录每个 type → locale → key 的写入优先级（用纯对象，比 Map 更快）
  private _priorities: Record<string, Record<string, Record<string, number>>> =
    {}

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

  private _getPriorityStore(
    type: string,
    locale: string
  ): Record<string, number> {
    if (!this._priorities[type]) {
      this._priorities[type] = {}
    }
    if (!this._priorities[type][locale]) {
      this._priorities[type][locale] = {}
    }
    return this._priorities[type][locale]
  }

  private _applyWithPriority(
    config: I18nConfig,
    priority: number,
    mergeOptions?: DeepMergeOptions
  ) {
    if (!config.types) return

    if (!this.config.types) {
      this.config.types = {}
    }

    for (const [type, typeConfig] of Object.entries(config.types)) {
      if (!typeConfig.resources) continue

      if (!this.config.types[type]) {
        this.config.types[type] = {}
      }
      if (!this.config.types[type].resources) {
        this.config.types[type].resources = {}
      }

      if (typeConfig.format !== undefined && !this.config.types[type].format) {
        this.config.types[type].format = typeConfig.format
      }

      const targetResources = this.config.types[type].resources as Record<
        string,
        any
      >
      const sourceResources = typeConfig.resources

      for (const locale of Object.keys(sourceResources)) {
        const sourceLocale = sourceResources[locale]
        if (!isObject(sourceLocale) && !isFunction(sourceLocale)) continue

        if (!targetResources[locale]) {
          targetResources[locale] = {}
        }

        if (isFunction(sourceLocale)) {
          const store = this._getPriorityStore(type, locale)
          const existingPriority = store['__loader__'] ?? 0
          if (priority > existingPriority) {
            targetResources[locale] = sourceLocale
            store['__loader__'] = priority
          }
          continue
        }

        const target = targetResources[locale]
        if (!isObject(target)) continue

        const store = this._getPriorityStore(type, locale)

        for (const key in sourceLocale) {
          if (!(key in store) || priority > store[key]) {
            target[key] = sourceLocale[key]
            store[key] = priority
          }
        }
      }
    }

    // 合并非 types 的其他配置项（fallback, splitByDot 等）
    const { types: _types, ...restConfig } = config
    if (Object.keys(restConfig).length > 0) {
      merge(this.config, restConfig as any, mergeOptions)
    }
  }

  applyConfig = async (config: I18nConfig, options?: ApplyConfigOptions) => {
    const { priority, ...mergeOptions } = options ?? ({} as ApplyConfigOptions)

    if (mergeOptions.mode === undefined && this.config.defaultApplyMode) {
      mergeOptions.mode = this.config.defaultApplyMode
    }

    if (
      priority !== undefined &&
      priority !== 0 &&
      mergeOptions?.mode === 'supplement'
    ) {
      this._applyWithPriority(config, priority, mergeOptions)
    } else {
      merge(this.config, config, mergeOptions)
    }

    if (!!this.language) {
      return await this.applyLanguage(this.language)
    }

    if (I18n.language) {
      await this.applyLanguage(I18n.language)
    } else {
      return new Promise((resolve) => {
        I18n.eventBus.once('change', async (language) => {
          await this.applyLanguage(I18n.language)
          resolve(undefined)
        })
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

    if (!this.documentEventSilent) {
      try {
        document.dispatchEvent(
          new CustomEvent(I18n.documentEventName, {
            detail: {
              language,
              config: this.config,
              key: this.key,
              instance: this,
            },
          })
        )
      } catch (e) {}
    }
  }

  applyLng = this.applyLanguage

  translate = (
    str,
    rawOptions: {
      [key: string]: any
      '@namespace'?: string
      '@type'?: string
      '@splitByDot'?: I18nConfig['splitByDot']
    } = {}
  ) => {
    const {
      '@namespace': __options_namespace,
      '@type': __options_type,
      '@splitByDot': __options_splitByDot = this.config.splitByDot || 'auto',
      ...options
    } = rawOptions

    const useKeyNamespace = NSReg.test(str)
    const [
      _keys,
      type = __options_type || this.config.defaultType || 'default',
    ] = str.split('@')

    let keys = _keys
    let namespace

    if (useKeyNamespace) {
      ;[namespace, keys] = _keys.split(':')
    }

    if (__options_namespace) {
      namespace = __options_namespace
    }

    const useNamespace = !!namespace

    if (!useNamespace && this.language) {
      const format = get(
        this.config,
        `types.${type}.format.${this.language}`,
        get(this.config, `types.${type}.format`, I18n.template)
      )
      const useResource = get(this.config, `types.${type}.resources`) !== false

      if (isFunction(format)) {
        const getRes = (splitByDot: boolean) => {
          const keyPaths = [type, this.language, keys]
          return run(
            format,
            undefined,
            useResource
              ? get(this.resources, splitByDot ? keyPaths.join('.') : keyPaths)
              : keys,
            options
          )
        }

        const resWithDot = getRes(true)
        const resWithoutDot = getRes(false)
        const res =
          __options_splitByDot === 'auto'
            ? resWithDot || resWithoutDot
            : __options_splitByDot
            ? resWithDot
            : resWithoutDot

        if (res) {
          return res
        }
      }
    }

    const fallbackRes =
      this.fallbackTranslate(`${keys}@${type}`, rawOptions, namespace) ||
      run(this.config, 'translateFallback', keys, rawOptions)

    if (fallbackRes) {
      return fallbackRes
    }

    if ((rawOptions as any)._fbT) {
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
