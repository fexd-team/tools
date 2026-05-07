const isReactValidElement = (object: any): boolean => {
  return (
    typeof object === 'object' &&
    object !== null &&
    typeof object.$$typeof === 'symbol'
  )
}

export default isReactValidElement
