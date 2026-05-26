import copy from '../copy'

describe('copy', () => {
  describe('copyText', () => {
    test('复制字符串 - input 元素承载正确内容', () => {
      let capturedInput: HTMLInputElement | null = null
      const origCreate = document.createElement.bind(document)
      const createSpy = jest
        .spyOn(document, 'createElement')
        .mockImplementation((tag: string) => {
          const el = origCreate(tag)
          if (tag === 'input') capturedInput = el as HTMLInputElement
          return el
        })
      document.execCommand = jest.fn().mockReturnValue(true)
      copy('hello world')
      expect(capturedInput).not.toBeNull()
      expect(capturedInput!.getAttribute('value')).toBe('hello world')
      createSpy.mockRestore()
      ;(document.execCommand as any).mockRestore?.()
    })

    test('复制数字', () => {
      document.execCommand = jest.fn().mockReturnValue(true)
      copy(12345)
      expect(document.execCommand).toHaveBeenCalledWith('copy', true)
      ;(document.execCommand as any).mockRestore?.()
    })

    test('execCommand 返回 false 时不执行第二次 copy', () => {
      document.execCommand = jest.fn().mockReturnValue(false)
      copy('test')
      expect(document.execCommand).toHaveBeenCalledTimes(1)
      ;(document.execCommand as any).mockRestore?.()
    })

    test('execCommand 返回 true 时执行两次 copy', () => {
      document.execCommand = jest.fn().mockReturnValue(true)
      copy('test')
      expect(document.execCommand).toHaveBeenCalledTimes(2)
      ;(document.execCommand as any).mockRestore?.()
    })

    test('input 元素被添加到 body 并被移除', () => {
      const appendSpy = jest.spyOn(document.body, 'appendChild')
      const removeSpy = jest.spyOn(document.body, 'removeChild')
      document.execCommand = jest.fn().mockReturnValue(true)
      copy('test')
      expect(appendSpy).toHaveBeenCalled()
      expect(removeSpy).toHaveBeenCalled()
      appendSpy.mockRestore()
      removeSpy.mockRestore()
      ;(document.execCommand as any).mockRestore?.()
    })

    test('空字符串也能复制', () => {
      document.execCommand = jest.fn().mockReturnValue(true)
      copy('')
      expect(document.execCommand).toHaveBeenCalledWith('copy', true)
      ;(document.execCommand as any).mockRestore?.()
    })
  })

  describe('copyDom', () => {
    test('DOM 元素调用 clipboard API', async () => {
      const dom = document.createElement('div')
      dom.innerHTML = '<span>hello</span>'

      global.ClipboardItem = class ClipboardItem {
        constructor(public data: any) {}
      } as any

      const mockWrite = jest.fn().mockResolvedValue(undefined)
      Object.assign(navigator, {
        clipboard: { write: mockWrite },
      })

      await copy(dom)
      expect(mockWrite).toHaveBeenCalledTimes(1)
      const items = mockWrite.mock.calls[0][0]
      expect(items).toHaveLength(1)
      expect(items[0]).toBeInstanceOf(ClipboardItem)

      delete (global as any).ClipboardItem
    })

    test('非 DOM 元素走 copyText', () => {
      document.execCommand = jest.fn().mockReturnValue(true)
      copy('not a dom')
      expect(document.execCommand).toHaveBeenCalledWith('copy', true)
      ;(document.execCommand as any).mockRestore?.()
    })

    test('数字走 copyText', () => {
      document.execCommand = jest.fn().mockReturnValue(true)
      copy(42)
      expect(document.execCommand).toHaveBeenCalledWith('copy', true)
      ;(document.execCommand as any).mockRestore?.()
    })

    test('普通对象走 copyText（无 innerHTML/textContent）', () => {
      document.execCommand = jest.fn().mockReturnValue(true)
      copy({ key: 'val' } as any)
      expect(document.execCommand).toHaveBeenCalledWith('copy', true)
      ;(document.execCommand as any).mockRestore?.()
    })
  })
})
