export type MergeableObject = { [key: string]: any }
export type OptionalMergeableObject = undefined | MergeableObject

export const merge = <
  A extends MergeableObject,
  B extends OptionalMergeableObject,
>(
  a: A,
  b: B,
) => {
  if (!a) {
    return b as A & B
  }
  if (!b) {
    return a as A & B
  }
  const merged: MergeableObject = { ...a }
  Object.entries(b).forEach(([key, value]) => {
    if (typeof merged[key] === "object" && !Array.isArray(merged[key])) {
      // if key exists and is object, create shallow clone
      merged[key] = { ...merged[key] }
    } else {
      // If key doesn't exist or is anything but extensible object, reset it
      delete merged[key]
    }
    if (Array.isArray(value)) {
      merged[key] = [
        ...(Array.isArray(merged[key]) ? merged[key] : []),
        ...value,
      ]
    } else if (typeof value === "object" && value !== null) {
      merged[key] = merge(merged[key], value)
    } else {
      merged[key] = value
    }
  })
  return merged as A & B
}

export interface PrettyPrintOptions {
  singleLine?: boolean
  tabIndent?: number
}
export const PRETTY_PRINT_DEFAULT_OPTIONS = {
  singleLine: false,
  tabIndent: 2,
}
export const prettyPrint = (json: object, options?: PrettyPrintOptions) => {
  const mergedOptions = merge(PRETTY_PRINT_DEFAULT_OPTIONS, options)
  const prettyJson = JSON.stringify(
    json,
    null,
    mergedOptions.singleLine ? 1 : mergedOptions.tabIndent,
  )
    .replace(/}$/, " }")
    .replace(/"([a-zA-Z]+)":/g, "$1:")

  return mergedOptions.singleLine ? prettyJson.replaceAll("\n", "") : prettyJson
}
