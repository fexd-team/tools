import random from './random'

/**
 * 将总长度随机分成指定段数，每段长度在范围内
 * @param length - 总长度
 * @param count - 分段数量
 * @param range - 每段长度的 [最小值, 最大值] 区间
 * @returns 各段长度组成的数组
 */
export default function segment(
  length: number,
  count: number,
  [min, max]: number[]
): number[] {
  const average = length / count // 平均值

  if (average < min || average > max) {
    throw new Error('无法分段')
  }

  let res = []

  const lastOne = Array(count)
    .fill(average)
    .reduce((left, right) => {
      const total = left + right // 游标当前所在区间的总长度
      const range = [
        min, // 左侧区间最小值
        max, // 左侧区间最小值
        total - min, // 右侧区间最小值
        total - max, // 右侧区间最小值
      ]
        .sort((a, b) => a - b)
        .slice(1, 3) // 游标的可取值范围为中间段
      left = random(range[0], range[1], false)
      right = total - left

      res.push(left) // 收集游标左侧长度

      return right // 游标右侧作为下个区间左侧
    })

  res.push(lastOne) // 收集最后一个值

  return res
}
