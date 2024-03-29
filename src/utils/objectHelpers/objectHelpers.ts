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
      merged[key] = {}
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
