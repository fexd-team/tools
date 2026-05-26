/**
 * 预加载图片 URL 列表
 * @param srcList - 图片地址数组
 * @returns 无返回值
 */
const preloadImage = (srcList: string[]): void =>
  srcList.forEach((src) => {
    const img = new Image()
    img.src = src
  })

export default preloadImage
