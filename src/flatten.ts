import isArray from './isArray'

const flatten = <T = any>(array: any[]): T[] =>
  array.reduce(
    (res, item) => [...res, ...(isArray(item) ? flatten(item) : [item])],
    []
  )

export default flatten
