type StringIndexableObject = { [key: string]: any }

export const merge = (a: StringIndexableObject, b: StringIndexableObject) => {
  const merged = { ...a }
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
    } else if (typeof value === "object") {
      merged[key] = merge(merged[key], value)
    } else {
      merged[key] = value
    }
  })
  return merged
}
