import isObject from './isObject'
import isUndefined from './isUndefined'
import isArray from './isArray'

export type MergeMode = 'override' | 'supplement'
export type ArrayMergeMode = 'replace' | 'concat' | 'combine'

export interface DeepMergeOptions {
  mode?: MergeMode
  paths?: Record<string, MergeMode>
  clone?: boolean
  arrayMerge?: ArrayMergeMode
  isMergeableObject?: (value: any, key: string) => boolean
  customMerge?: Record<
    string,
    (targetVal: any, sourceVal: any, options?: DeepMergeOptions) => any
  >
  /**
   * 浅合并深度限制。达到该深度后，不再递归进入子对象：
   * - supplement 模式：仅做 "有就跳过、没就补" 的浅赋值
   * - override 模式：整体替换
   * 适用于语言包等已知底层是扁平 key-value 的场景，可大幅减少递归和类型判断开销。
   */
  shallowAfterDepth?: number
}

const defaultIsMergeableObject = (value: any) => isObject(value)

function combineArrayMerge(
  target: any[],
  source: any[],
  options?: DeepMergeOptions
): any[] {
  const result = target.slice()
  source.forEach((item, index) => {
    if (index < result.length) {
      const targetItem = result[index]
      if (
        defaultIsMergeableObject(targetItem) &&
        defaultIsMergeableObject(item)
      ) {
        result[index] = merge(targetItem, item, options)
      } else if (isArray(targetItem) && isArray(item)) {
        result[index] = combineArrayMerge(targetItem, item, options)
      } else {
        result[index] = item
      }
    } else {
      result.push(item)
    }
  })
  return result
}

const getEffectiveMode = (
  currentPath: string,
  defaultMode: MergeMode,
  paths?: Record<string, MergeMode>
): MergeMode => {
  if (!paths) return defaultMode
  if (paths[currentPath] !== undefined) return paths[currentPath]
  return defaultMode
}

const deriveChildPaths = (
  currentPath: string,
  paths?: Record<string, MergeMode>
): Record<string, MergeMode> | undefined => {
  if (!paths) return undefined
  const prefix = `${currentPath}.`
  const childPaths: Record<string, MergeMode> = {}
  const keys = Object.keys(paths)
  for (let i = 0; i < keys.length; i++) {
    const p = keys[i]
    if (p.indexOf(prefix) === 0) {
      childPaths[p.slice(prefix.length)] = paths[p]
    }
  }
  return Object.keys(childPaths).length > 0 ? childPaths : undefined
}

/**
 * supplement 模式的浅合并快速路径：
 * 跳过所有 isMergeableObject / customMerge / paths / 循环引用 检查，
 * 直接做 "target 没有就从 source 补" 的赋值。
 */
const shallowSupplement = (
  target: Record<string, any>,
  source: Record<string, any>
): void => {
  for (const key in source) {
    if (target[key] === undefined) {
      target[key] = source[key]
    }
  }
}

/**
 * override 模式的浅合并快速路径：等价于 Object.assign。
 */
const shallowOverride = (
  target: Record<string, any>,
  source: Record<string, any>
): void => {
  for (const key in source) {
    target[key] = source[key]
  }
}

/**
 * 深度合并两个对象，支持多种合并模式与数组策略
 * @param target - 目标对象
 * @param source - 源对象
 * @param options - 合并选项（模式、路径策略、数组合并等）
 * @returns 合并后的对象
 */
const merge = <T extends Record<string, any>>(
  target: T,
  source: Record<string, any>,
  options?: DeepMergeOptions,
  _seen?: WeakMap<object, any>,
  _depth?: number
): T => {
  if (!isObject(source)) {
    return isObject(target) ? target : (source as unknown as T)
  }
  if (!isObject(target)) {
    return source as T
  }

  const depth = _depth ?? 0
  const seen = _seen ?? new WeakMap()
  if (seen.has(target)) return seen.get(target)
  if (seen.has(source)) return seen.get(source)

  const isMergeableObject =
    options?.isMergeableObject ?? defaultIsMergeableObject
  const defaultMode = options?.mode ?? 'override'
  const paths = options?.paths
  const arrayMergeMode = options?.arrayMerge ?? 'replace'
  const shallowAfterDepth = options?.shallowAfterDepth

  let result: Record<string, any> = target
  if (options?.clone) {
    result = { ...target }
  }

  seen.set(target, result)
  seen.set(source, result)

  // 浅合并快速路径：达到指定深度后，对子对象使用浅合并
  if (shallowAfterDepth !== undefined && depth >= shallowAfterDepth) {
    if (defaultMode === 'supplement') {
      shallowSupplement(result, source)
    } else {
      shallowOverride(result, source)
    }
    return result as T
  }

  const resolveRef = (value: any): any =>
    isObject(value) && seen.has(value) ? seen.get(value) : value

  for (const key in source) {
    const targetValue = result[key]
    const sourceValue = source[key]
    const currentPath = key

    if (options?.customMerge && options.customMerge[key]) {
      result[key] = options.customMerge[key](targetValue, sourceValue, options)
      continue
    }

    const effectiveMode = getEffectiveMode(currentPath, defaultMode, paths)

    if (isArray(targetValue) && isArray(sourceValue)) {
      if (effectiveMode === 'supplement') {
        if (targetValue.length > 0) {
          if (isUndefined(result[key])) {
            result[key] = sourceValue
          }
        } else {
          result[key] = sourceValue
        }
      } else {
        switch (arrayMergeMode) {
          case 'concat':
            result[key] = targetValue.concat(sourceValue)
            break
          case 'combine':
            result[key] = combineArrayMerge(targetValue, sourceValue, options)
            break
          case 'replace':
          default:
            result[key] = sourceValue
            break
        }
      }
      continue
    }

    if (effectiveMode === 'supplement') {
      if (!isUndefined(targetValue)) {
        if (
          isMergeableObject(targetValue, key) &&
          isMergeableObject(sourceValue, key)
        ) {
          result[key] = merge(
            targetValue,
            sourceValue,
            {
              mode: 'supplement',
              paths: deriveChildPaths(currentPath, paths),
              isMergeableObject,
              customMerge: options?.customMerge,
              arrayMerge: arrayMergeMode,
              clone: options?.clone,
              shallowAfterDepth,
            },
            seen,
            depth + 1
          )
        }
      } else {
        result[key] = resolveRef(sourceValue)
      }
    } else {
      if (
        isMergeableObject(targetValue, key) &&
        isMergeableObject(sourceValue, key)
      ) {
        result[key] = merge(
          targetValue,
          sourceValue,
          {
            mode: getEffectiveMode(currentPath, 'override', paths),
            paths: deriveChildPaths(currentPath, paths),
            isMergeableObject,
            customMerge: options?.customMerge,
            arrayMerge: arrayMergeMode,
            clone: options?.clone,
            shallowAfterDepth,
          },
          seen,
          depth + 1
        )
      } else {
        result[key] = resolveRef(sourceValue)
      }
    }
  }

  return result as T
}

export default merge
