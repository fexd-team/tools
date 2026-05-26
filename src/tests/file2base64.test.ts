import file2base64 from '../file2base64'

describe('file2base64', () => {
  test('转换 File 为 base64 字符串', async () => {
    const file = new File(['hello world'], 'test.txt', { type: 'text/plain' })
    const result = await file2base64(file)
    expect(result).toMatch(/^data:text\/plain;base64,/)
    expect(atob(result.split(',')[1])).toBe('hello world')
  })

  test('处理空文件', async () => {
    const file = new File([], 'empty.txt', { type: 'text/plain' })
    const result = await file2base64(file)
    expect(result).toMatch(/^data:text\/plain;base64,/)
  })

  test('处理图片类型文件', async () => {
    const bytes = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])
    const file = new File([bytes], 'test.png', { type: 'image/png' })
    const result = await file2base64(file)
    expect(result).toMatch(/^data:image\/png;base64,/)
  })

  test('FileReader 出错时 reject', async () => {
    const file = new File(['x'], 'fail.txt', { type: 'text/plain' })
    const origReadAsDataURL = FileReader.prototype.readAsDataURL
    FileReader.prototype.readAsDataURL = function () {
      setTimeout(() => {
        this.onerror?.(new ProgressEvent('error') as any)
      }, 0)
    }

    await expect(file2base64(file)).rejects.toBeDefined()

    FileReader.prototype.readAsDataURL = origReadAsDataURL
  })
})
