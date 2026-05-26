import source from '../source'

describe('source', () => {
  describe('css', () => {
    test('加载 CSS 链接', () => {
      source.css('http://example.com/style-unique-1.css')
      const link = document.querySelector(
        'link[href="http://example.com/style-unique-1.css"]'
      )
      expect(link).not.toBeNull()
      expect(link?.getAttribute('rel')).toBe('stylesheet')
    })

    test('重复加载输出警告', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
      source.css('http://example.com/style-unique-2.css')
      source.css('http://example.com/style-unique-2.css')
      expect(warnSpy).toHaveBeenCalled()
      warnSpy.mockRestore()
    })

    test('link 元素被添加到 body', () => {
      source.css('http://example.com/style-unique-3.css')
      const link = document.body.querySelector(
        'link[href="http://example.com/style-unique-3.css"]'
      )
      expect(link).not.toBeNull()
    })

    test('DOM 中已存在的 link 标签不重复添加', () => {
      const href = 'http://example.com/style-preexist.css'
      const existing = document.createElement('link')
      existing.setAttribute('href', href)
      existing.setAttribute('rel', 'stylesheet')
      document.body.appendChild(existing)

      const linksBefore = document.querySelectorAll(
        `link[href="${href}"]`
      ).length
      source.css(href)
      const linksAfter = document.querySelectorAll(
        `link[href="${href}"]`
      ).length
      expect(linksAfter).toBe(linksBefore)
    })
  })

  describe('js', () => {
    test('加载 JS 返回 Promise', () => {
      const result = source.js('http://example.com/script-unique-1.js')
      expect(result).toBeInstanceOf(Promise)
    })

    test('JS 加载失败时 Promise reject', async () => {
      const src = 'http://example.com/script-err-unique.js'

      const promise = source.js(src)

      const scripts = document.querySelectorAll(`script[src="${src}"]`)
      const script = scripts[scripts.length - 1]
      script.dispatchEvent(new Event('error'))

      await expect(promise).rejects.toThrow('Failed to load script')
    })

    test('JS 加载成功后 resolve（无 externals 时返回 undefined）', async () => {
      const src = 'http://example.com/script-load-unique2.js'

      const promise = source.js(src)

      const scripts = document.querySelectorAll(`script[src="${src}"]`)
      const script = scripts[scripts.length - 1] as HTMLScriptElement
      script.dispatchEvent(new Event('load'))

      const result = await promise
      expect(result).toBeUndefined()
    })

    test('重复加载 JS 输出警告', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
      const src = 'http://example.com/script-dup-unique.js'

      const promise = source.js(src)
      const scripts = document.querySelectorAll(`script[src="${src}"]`)
      scripts[scripts.length - 1].dispatchEvent(new Event('load'))
      await promise

      source.js(src)
      expect(warnSpy).toHaveBeenCalled()
      warnSpy.mockRestore()
    })

    test('JS 带 externals 参数', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
      const src = 'http://example.com/script-ext-unique.js'

      const promise = source.js(src, 'NonExistentGlobal')
      const scripts = document.querySelectorAll(`script[src="${src}"]`)
      scripts[scripts.length - 1].dispatchEvent(new Event('load'))

      await promise
      expect(warnSpy).toHaveBeenCalled()
      warnSpy.mockRestore()
    })
  })
})
