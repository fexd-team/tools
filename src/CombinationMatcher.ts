interface Attr {
  [key: string]: any[]
}

/**
 * 组合匹配器，根据属性组合判断是否存在、获取可选项、精确查找
 */
export default class CombinationMatcher {
  public list: Record<string, any> | any[]
  public attr: Attr
  public attrKey: string[]

  constructor(list: Record<string, any> | any[]) {
    this.list = list

    this.attr = Object.entries(list).reduce((attr: Attr, [, item]) => {
      Object.entries(item).forEach(([key, val]) => {
        attr[key] = attr[key] || []
        attr[key] = [...new Set([...attr[key], val])]
      })

      return attr
    }, {})

    this.attrKey = Object.keys(this.attr)
  }

  /** 判断给定属性组合是否在列表中存在匹配 */
  public have = (activeAttr: Record<string, any>): boolean =>
    Object.values(this.list).some((item) =>
      Object.entries(activeAttr).every(([key, val]) => item[key] === val)
    )

  /** 根据已选属性返回各维度可选值 */
  public adaptedAttr = (
    activeAttr: Record<string, any>
  ): Record<string, any[]> =>
    Object.entries(this.attr).reduce(
      (adaptedAttr, [key, values]) =>
        Object.assign(adaptedAttr, {
          [key]: values.filter((val) =>
            this.have(
              Object.assign({}, activeAttr, {
                [key]: val,
              })
            )
          ),
        }),
      {} as Record<string, any[]>
    )

  /** 精确匹配所有属性后返回对应的 key；未匹配返回 undefined */
  public find = (activeAttr: Record<string, any>): string | undefined => {
    for (let [id, item] of Object.entries(this.list)) {
      if (
        Object.entries(activeAttr).every(([key, val]) => item[key] === val) &&
        Object.keys(item).every((key) => key in activeAttr)
      ) {
        return id
      }
    }
  }
}
