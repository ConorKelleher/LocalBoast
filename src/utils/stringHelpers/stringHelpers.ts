export const insertToString = (source: string, index: number, value: string) =>
  `${source.slice(0, index)}${value}${source.slice(index)}`

export const removeFromString = (
  source: string,
  index: number,
  count: number,
) =>
  `${source.slice(0, index)}${source.slice(
    Math.min(source.length, index + count),
  )}`

interface StringAddition {
  added: string
  addedIndex: number
}
interface StringRemoval {
  removed: string
  removedIndex: number
}
export interface StringDiff extends StringAddition, StringRemoval {
  stringAfterRemovals: string
}

const diffStringAdditions = (
  aString: string,
  bString: string,
): StringAddition => {
  let addedIndex = 0
  let added = ""
  let foundDifference = false

  // Find startIndex of additions to aString
  for (let i = 0; i < bString.length; i++) {
    const charsEqual = aString.charAt(i) === bString.charAt(i)
    if (charsEqual) {
      addedIndex += 1
    } else {
      foundDifference = true
      break
    }
  }
  if (foundDifference) {
    // If found startIndex for addition, find full scale of addition
    for (let i = 0; i < bString.length - addedIndex; i++) {
      const offsetFromAString = aString.length - 1 - i
      const offsetFromBString = bString.length - 1 - i

      const charsEqual =
        offsetFromAString >= addedIndex &&
        aString.charAt(offsetFromAString) === bString.charAt(offsetFromBString)
      if (!charsEqual) {
        added = bString.slice(addedIndex, offsetFromBString + 1)
        break
      }
    }
  } else {
    addedIndex = -1
  }
  return {
    added,
    addedIndex,
  }
}

export const getInterpolatedStringDiff = (
  startString: string,
  diff: StringAddition,
  progress: number,
) => {
  return insertToString(
    startString,
    diff.addedIndex,
    diff.added.slice(0, Math.floor(diff.added.length * progress)),
  )
}

export const diffStrings = (aString: string, bString: string): StringDiff => {
  const { added: removed, addedIndex: removedIndex } = diffStringAdditions(
    bString,
    aString,
  )

  const stringAfterRemovals =
    removedIndex >= 0
      ? removeFromString(aString, removedIndex, removed.length)
      : aString
  const { added, addedIndex } = diffStringAdditions(
    stringAfterRemovals,
    bString,
  )

  return {
    removed,
    added,
    removedIndex,
    addedIndex,
    stringAfterRemovals,
  }
}

export const capitalize = (input: string) =>
  input.length
    ? `${input.charAt(0).toLocaleUpperCase()}${input.slice(1)}`
    : // .toLocaleLowerCase()}`
      input

export const isFirstLetterUppercase = (letter: string) =>
  letter[0].toUpperCase() === letter[0]

export const dasherize = (input: string) =>
  input
    .replace(/([a-z])([A-Z])/, "$1-$2")
    .replace(/_/, "-")
    .toLowerCase()
