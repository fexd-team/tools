/**
 * 比较两个依赖数组是否发生变化（浅比较）
 * @param oldDeps - 上一轮的依赖数组
 * @param newDeps - 当前的依赖数组
 * @returns 若长度或任一元素不同则返回 true
 */
const depsChanged = (oldDeps: any[], newDeps: any[]): boolean => {
  if (oldDeps.length !== newDeps.length) {
    return true
  }
  for (let i = 0; i < newDeps.length; i++) {
    if (oldDeps[i] !== newDeps[i]) {
      return true
    }
  }
  return false
}

export default depsChanged
