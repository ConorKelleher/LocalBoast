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
  let foundAddition = false

  // Find startIndex of additions to aString
  for (let i = 0; i < bString.length; i++) {
    const charsEqual = aString.charAt(i) === bString.charAt(i)
    if (charsEqual) {
      addedIndex += 1
    } else {
      foundAddition = true
      break
    }
  }
  if (foundAddition) {
    // If found startIndex for addition, find full scale of addition
    for (let i = 0; i < bString.length - addedIndex; i++) {
      const charsEqual =
        aString.charAt(aString.length - 1 - i) ===
        bString.charAt(bString.length - 1 - i)
      if (!charsEqual) {
        added = bString.slice(addedIndex, bString.length - i)
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
