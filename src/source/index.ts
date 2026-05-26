import getExternals from './getExternals'

interface Cache {
  js: string[]
  css: string[]
}

/**
 * 动态加载外部 JS/CSS 资源，自动去重
 */
const cache: Cache = {
  js: [],
  css: [],
}

/**
 * 动态加载 JS 脚本并返回 externals 导出
 * @param src - 脚本 URL
 * @param externals - 要从 window 上获取的全局变量名
 */
export const js = (src: string, externals?: string | string[]) => {
  if (cache.js.includes(src)) {
    console.warn(`[source.js] ${src} 已被加载`)
    return Promise.resolve(getExternals(src, externals))
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.setAttribute('src', src)
    script.addEventListener('load', () =>
      setTimeout(() => {
        cache.js.push(src)

        resolve(getExternals(src, externals))
      })
    )
    script.addEventListener('error', () =>
      reject(new Error(`Failed to load script: ${src}`))
    )
    document.body.appendChild(script)
  })
}

/**
 * 动态加载 CSS 样式表，自动去重
 * @param href - 样式表 URL
 */
export const css = (href: string) => {
  if (cache.css.includes(href)) {
    console.warn(`[source.css] ${href} 已被加载`)
    return
  }

  if (document.querySelector(`link[href="${href}"]`)) {
    cache.css.push(href)
    return
  }

  const link = document.createElement('link')
  link.setAttribute('href', href)
  link.setAttribute('rel', 'stylesheet')
  document.body.appendChild(link)

  cache.css.push(href)
}

export default {
  js,
  css,
}
