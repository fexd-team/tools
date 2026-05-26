/**
 * 返回 arr1 相对 arr2 的差集
 * @param arr1 - 被比较数组
 * @param arr2 - 对照数组
 * @returns arr1 中不在 arr2 里的元素组成的新数组
 */
export default function difference(arr1: any[], arr2: any[]) {
  return arr1.filter((item) => !arr2.includes(item))
}
