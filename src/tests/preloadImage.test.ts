import preloadImage from '../preloadImage'

describe('preloadImage', () => {
  test('为每个 URL 创建 Image 并设置 src', () => {
    const images: HTMLImageElement[] = []
    const origImage = global.Image
    ;(global as any).Image = class MockImage {
      src: string = ''
      constructor() {
        images.push(this as any)
      }
    }

    const srcList = ['http://a.com/1.jpg', 'http://b.com/2.png']
    preloadImage(srcList)

    expect(images.length).toBe(2)
    expect(images[0].src).toBe('http://a.com/1.jpg')
    expect(images[1].src).toBe('http://b.com/2.png')

    global.Image = origImage
  })

  test('空数组不做任何操作', () => {
    expect(() => preloadImage([])).not.toThrow()
  })

  test('单个 URL', () => {
    const images: HTMLImageElement[] = []
    const origImage = global.Image
    ;(global as any).Image = class MockImage {
      src: string = ''
      constructor() {
        images.push(this as any)
      }
    }

    preloadImage(['http://a.com/1.jpg'])
    expect(images.length).toBe(1)

    global.Image = origImage
  })

  test('返回 void（无返回值）', () => {
    const result = preloadImage(['http://a.com/1.jpg'])
    expect(result).toBeUndefined()
  })
})
