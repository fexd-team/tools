import get from './get'

/**
 * 按规则函数将列表分组
 * @param namer - 分组键生成函数，接收列表项
 * @param list - 源数组
 * @returns 以分组键为属性的对象
 */
const groupBy = (namer: Function, list: any[]): Object =>
  list.reduce((res, item, ...args) => {
    const groupName = String(namer(item, ...args))
    const group = get<any[]>(res, groupName, [])

    return {
      ...res,
      [groupName]: [...group, item],
    }
  }, {})

export default groupBy
