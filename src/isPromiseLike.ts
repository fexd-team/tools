import isExist from './isExist'
import isFunction from './isFunction'

const isPromiseLike = (value: any): value is Promise<any> =>
  isExist(value) && isFunction(value.then)

export default isPromiseLike
