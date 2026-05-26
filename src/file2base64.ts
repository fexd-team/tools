/**
 * 将文件读取为 base64 Data URL
 * @param file - File 对象
 * @returns 包含 base64 字符串的 Promise
 */
const file2base64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

export default file2base64
