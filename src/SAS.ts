import singleflight, { SingleflightFunction } from './singleflight'

/** @deprecated 请使用 singleflight 代替 */
export type SASFunction<T> = SingleflightFunction<T>

/** @deprecated 请使用 singleflight 代替 */
const SAS = singleflight

export default SAS
