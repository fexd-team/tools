/**
 * I18n 使用示例
 * 
 * 这个文件展示了基于测试用例的实际使用场景
 * 注意：这不是测试文件，而是使用示例
 */

import I18n from '../../I18n'

// ============================================
// 示例 1: 基础使用
// ============================================
export function example1_BasicUsage() {
  // 创建 I18n 实例
  const i18n = new I18n({
    types: {
      default: {
        resources: {
          'zh-CN': {
            hello: '你好',
            welcome: '欢迎使用',
            'user.name': '用户名',
            'user.age': '年龄',
          },
          'en-US': {
            hello: 'Hello',
            welcome: 'Welcome',
            'user.name': 'Username',
            'user.age': 'Age',
          },
        },
      },
    },
    defaultType: 'default',
  })

  // 设置语言
  I18n.applyLanguage('zh-CN')

  // 使用翻译
  console.log(i18n.t('hello')) // 输出: 你好
  console.log(i18n.t('welcome')) // 输出: 欢迎使用
  console.log(i18n.t('user.name')) // 输出: 用户名
}

// ============================================
// 示例 2: 字符串模板
// ============================================
export function example2_Template() {
  const i18n = new I18n({
    types: {
      default: {
        resources: {
          'zh-CN': {
            greeting: '你好，{{name}}！',
            userInfo: '用户 {{name}} 今年 {{age}} 岁',
          },
        },
        format: (str, options) => I18n.template(str, options),
      },
    },
  })

  I18n.applyLanguage('zh-CN')

  console.log(i18n.t('greeting', { name: '张三' }))
  // 输出: 你好，张三！

  console.log(i18n.t('userInfo', { name: '李四', age: 25 }))
  // 输出: 用户 李四 今年 25 岁
}

// ============================================
// 示例 3: 多类型资源
// ============================================
export function example3_MultipleTypes() {
  const i18n = new I18n({
    types: {
      // 默认类型 - 常规文本
      default: {
        resources: {
          'zh-CN': {
            hello: '你好',
            goodbye: '再见',
          },
        },
      },
      // 错误消息类型
      error: {
        resources: {
          'zh-CN': {
            'not-found': '未找到资源',
            'network-error': '网络错误',
            'permission-denied': '权限不足',
          },
        },
      },
      // 提示消息类型
      hint: {
        resources: {
          'zh-CN': {
            'save-success': '保存成功',
            'loading': '加载中...',
          },
        },
      },
    },
    defaultType: 'default',
  })

  I18n.applyLanguage('zh-CN')

  console.log(i18n.t('hello')) // 默认类型
  console.log(i18n.t('not-found@error')) // 错误类型
  console.log(i18n.t('save-success@hint')) // 提示类型

  // 或使用选项
  console.log(i18n.t('network-error', { '@type': 'error' }))
}

// ============================================
// 示例 4: 回退机制
// ============================================
export function example4_Fallback() {
  // 创建公共翻译实例
  const commonI18n = new I18n({
    types: {
      default: {
        resources: {
          'zh-CN': {
            ok: '确定',
            cancel: '取消',
            save: '保存',
            delete: '删除',
          },
        },
      },
    },
  })

  // 创建应用特定翻译实例，使用公共翻译作为回退
  const appI18n = new I18n({
    types: {
      default: {
        resources: {
          'zh-CN': {
            welcome: '欢迎',
            // 没有定义 ok、cancel 等，会从 fallback 查找
          },
        },
      },
    },
    fallback: [commonI18n],
  })

  I18n.applyLanguage('zh-CN')

  console.log(appI18n.t('welcome')) // 输出: 欢迎
  console.log(appI18n.t('ok')) // 输出: 确定（从 commonI18n 回退）
  console.log(appI18n.t('cancel')) // 输出: 取消（从 commonI18n 回退）
}

// ============================================
// 示例 5: 命名空间
// ============================================
export function example5_Namespace() {
  const commonI18n = new I18n({
    types: {
      default: {
        resources: {
          'zh-CN': {
            button: '按钮',
            link: '链接',
          },
        },
      },
    },
  })

  const appI18n = new I18n({
    types: {
      default: {
        resources: {
          'zh-CN': {
            title: '标题',
          },
        },
      },
    },
    fallback: {
      common: commonI18n, // 命名空间方式
    },
  })

  I18n.applyLanguage('zh-CN')

  console.log(appI18n.t('title')) // 输出: 标题
  console.log(appI18n.t('common:button')) // 输出: 按钮
  console.log(appI18n.t('common:link')) // 输出: 链接
}

// ============================================
// 示例 6: 自定义格式化
// ============================================
export function example6_CustomFormat() {
  const i18n = new I18n({
    types: {
      default: {
        resources: {
          'zh-CN': {
            price: '100',
            discount: '0.8',
          },
        },
        format: {
          'zh-CN': (value, options) => {
            // 数字格式化
            if (options?.type === 'currency') {
              return `¥${parseFloat(value).toFixed(2)}`
            }
            if (options?.type === 'percent') {
              return `${(parseFloat(value) * 100).toFixed(0)}%`
            }
            return value
          },
        },
      },
    },
  })

  I18n.applyLanguage('zh-CN')

  console.log(i18n.t('price', { type: 'currency' })) // 输出: ¥100.00
  console.log(i18n.t('discount', { type: 'percent' })) // 输出: 80%
}

// ============================================
// 示例 7: 多实例协同
// ============================================
export function example7_MultipleInstances() {
  // 页面 A 的翻译
  const pageAI18n = new I18n({
    types: {
      default: {
        resources: {
          'zh-CN': { title: '页面 A' },
          'en-US': { title: 'Page A' },
        },
      },
    },
  })

  // 页面 B 的翻译
  const pageBI18n = new I18n({
    types: {
      default: {
        resources: {
          'zh-CN': { title: '页面 B' },
          'en-US': { title: 'Page B' },
        },
      },
    },
  })

  // 全局切换语言，所有实例同步更新
  I18n.applyLanguage('zh-CN')
  console.log(pageAI18n.t('title')) // 页面 A
  console.log(pageBI18n.t('title')) // 页面 B

  I18n.applyLanguage('en-US')
  console.log(pageAI18n.t('title')) // Page A
  console.log(pageBI18n.t('title')) // Page B
}

// ============================================
// 示例 8: 监听语言变化
// ============================================
export function example8_EventListeners() {
  const i18n = new I18n({
    types: {
      default: {
        resources: {
          'zh-CN': { hello: '你好' },
          'en-US': { hello: 'Hello' },
        },
      },
    },
  })

  // 监听实例级别的语言变化
  i18n.eventBus.on('change', (language) => {
    console.log(`实例语言已切换为: ${language}`)
    // 更新 UI、重新渲染等
  })

  // 监听全局语言变化
  I18n.eventBus.on('change', (language) => {
    console.log(`全局语言已切换为: ${language}`)
  })

  // 监听 DOM 事件（用于跨组件通信）
  document.addEventListener(I18n.documentEventName, (event: any) => {
    console.log('收到语言变化事件:', event.detail)
  })

  // 切换语言
  I18n.applyLanguage('zh-CN')
}

// ============================================
// 示例 9: splitByDot 选项
// ============================================
export function example9_SplitByDot() {
  const i18n = new I18n({
    types: {
      default: {
        resources: {
          'zh-CN': {
            // 点分割方式
            'user.name': '用户名（点分割）',
            // 嵌套对象方式
            user: {
              name: '用户名（嵌套）',
              email: '邮箱',
            },
          },
        },
      },
    },
    splitByDot: 'auto', // auto | true | false
  })

  I18n.applyLanguage('zh-CN')

  // auto 模式：优先使用点分割
  console.log(i18n.t('user.name')) // 输出: 用户名（点分割）

  // 强制使用嵌套对象方式
  console.log(i18n.t('user.name', { '@splitByDot': false }))
  // 输出: 用户名（嵌套）

  // 只有嵌套对象有的 key
  console.log(i18n.t('user.email')) // 输出: 邮箱
}

// ============================================
// 示例 10: 使用 I18n.load 加载资源
// ============================================
export async function example10_LoadResources() {
  // 定义资源加载器
  const loadZhCN = I18n.load(
    () => ({ common: { ok: '确定', cancel: '取消' } }),
    () => ({ app: { title: '我的应用' } })
  )

  const loadEnUS = I18n.load(
    () => ({ common: { ok: 'OK', cancel: 'Cancel' } }),
    () => ({ app: { title: 'My App' } })
  )

  const i18n = new I18n({
    types: {
      default: {
        resources: {
          'zh-CN': loadZhCN,
          'en-US': loadEnUS,
        },
      },
    },
  })

  // 切换语言时自动加载（只加载一次，有缓存）
  await i18n.applyLanguage('zh-CN')
  console.log(i18n.t('common.ok'))

  // 再次切换，不会重新加载
  await i18n.applyLanguage('en-US')
  console.log(i18n.t('common.ok'))
}

// ============================================
// 示例 11: React 集成示例
// ============================================
export function example11_ReactIntegration() {
  // 创建全局 i18n 实例
  const i18n = new I18n({
    types: {
      default: {
        resources: {
          'zh-CN': {
            'button.submit': '提交',
            'button.cancel': '取消',
          },
          'en-US': {
            'button.submit': 'Submit',
            'button.cancel': 'Cancel',
          },
        },
      },
    },
  })

  // 在 React 组件中使用
  /*
  import { useState, useEffect } from 'react'

  function MyComponent() {
    const [, forceUpdate] = useState({})

    useEffect(() => {
      // 监听语言变化，重新渲染
      const listener = () => forceUpdate({})
      i18n.eventBus.on('change', listener)

      return () => {
        i18n.eventBus.off('change', listener)
      }
    }, [])

    return (
      <div>
        <button>{i18n.t('button.submit')}</button>
        <button>{i18n.t('button.cancel')}</button>
      </div>
    )
  }

  // 切换语言
  function LanguageSwitcher() {
    return (
      <select onChange={(e) => I18n.applyLanguage(e.target.value)}>
        <option value="zh-CN">中文</option>
        <option value="en-US">English</option>
      </select>
    )
  }
  */
}

// ============================================
// 示例 12: Vue 集成示例
// ============================================
export function example12_VueIntegration() {
  // 创建 Vue 插件
  /*
  const i18n = new I18n({
    types: {
      default: {
        resources: {
          'zh-CN': { ... },
          'en-US': { ... }
        }
      }
    }
  })

  const i18nPlugin = {
    install(app) {
      // 注入 $t 方法
      app.config.globalProperties.$t = (key, options) => {
        return i18n.t(key, options)
      }

      // 注入 i18n 实例
      app.provide('i18n', i18n)

      // 响应式语言
      const language = ref(i18n.language)
      i18n.eventBus.on('change', (lang) => {
        language.value = lang
      })
      app.provide('language', language)
    }
  }

  // 使用插件
  app.use(i18nPlugin)

  // 在组件中使用
  export default {
    template: `
      <div>
        <p>{{ $t('hello') }}</p>
        <button @click="changeLanguage">切换语言</button>
      </div>
    `,
    methods: {
      changeLanguage() {
        const newLang = this.language === 'zh-CN' ? 'en-US' : 'zh-CN'
        I18n.applyLanguage(newLang)
      }
    }
  }
  */
}

// ============================================
// 示例 13: 异步资源加载
// ============================================
export async function example13_AsyncLoading() {
  const i18n = new I18n({
    types: {
      default: {
        resources: {
          'zh-CN': async () => {
            // 模拟从服务器加载翻译文件
            await new Promise((resolve) => setTimeout(resolve, 100))
            return {
              hello: '你好',
              goodbye: '再见',
            }
          },
          'en-US': async () => {
            await new Promise((resolve) => setTimeout(resolve, 100))
            return {
              hello: 'Hello',
              goodbye: 'Goodbye',
            }
          },
        },
      },
    },
  })

  // 异步应用语言
  await i18n.applyLanguage('zh-CN')
  console.log(i18n.t('hello'))
}

// ============================================
// 示例 14: 动态资源（函数形式）
// ============================================
export function example14_DynamicResources() {
  // 根据环境返回不同的翻译
  const getResources = () => {
    const isProd = process.env.NODE_ENV === 'production'

    return {
      'zh-CN': {
        debug: isProd ? '' : '调试信息',
        appName: isProd ? '生产应用' : '开发应用',
      },
    }
  }

  const i18n = new I18n({
    types: {
      default: {
        resources: getResources,
      },
    },
  })

  I18n.applyLanguage('zh-CN')
}

// ============================================
// 示例 15: 完整的应用场景
// ============================================
export async function example15_CompleteExample() {
  // 1. 创建公共翻译
  const commonI18n = new I18n({
    types: {
      default: {
        resources: {
          'zh-CN': {
            ok: '确定',
            cancel: '取消',
            save: '保存',
          },
        },
      },
    },
  })

  // 2. 创建应用翻译
  const appI18n = new I18n({
    types: {
      // 普通文本
      default: {
        resources: {
          'zh-CN': {
            'app.title': '我的应用',
            'user.welcome': '欢迎，{{name}}！',
          },
          'en-US': {
            'app.title': 'My App',
            'user.welcome': 'Welcome, {{name}}!',
          },
        },
        format: (str, options) => I18n.template(str, options),
      },
      // 错误消息
      error: {
        resources: {
          'zh-CN': {
            'network.timeout': '网络超时',
            'auth.failed': '认证失败',
          },
          'en-US': {
            'network.timeout': 'Network Timeout',
            'auth.failed': 'Authentication Failed',
          },
        },
      },
    },
    defaultType: 'default',
    fallback: [commonI18n],
    translateFallback: (key) => {
      // 开发环境显示缺失的翻译
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation: ${key}`)
        return `[${key}]`
      }
      return key
    },
  })

  // 3. 设置语言
  await I18n.applyLanguage('zh-CN')

  // 4. 使用翻译
  console.log(appI18n.t('app.title')) // 我的应用
  console.log(appI18n.t('user.welcome', { name: '张三' })) // 欢迎，张三！
  console.log(appI18n.t('ok')) // 确定（来自 commonI18n）
  console.log(appI18n.t('network.timeout@error')) // 网络超时
  console.log(appI18n.t('missing.key')) // [missing.key]（开发环境）

  // 5. 切换语言
  await I18n.applyLanguage('en-US')
  console.log(appI18n.t('app.title')) // My App
  console.log(appI18n.t('user.welcome', { name: 'John' })) // Welcome, John!
}

