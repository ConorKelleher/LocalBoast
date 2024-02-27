import { TruncateFrom, UseTruncateOptions } from "localboast/hooks/useTruncate"

// Inspired by (and with thanks to) https://stackoverflow.com/a/9541579
const isOverflownHoriz = ({ clientWidth, scrollWidth }: HTMLElement) => {
  return scrollWidth > clientWidth
}

const getInitialInsertionIndex = (
  originalString: string,
  fromSetting: TruncateFrom,
  startOffset: number,
  endOffset: number,
) =>
  fromSetting === TruncateFrom.Middle
    ? Math.floor(originalString.length / 2) - startOffset + endOffset
    : fromSetting === TruncateFrom.Start
    ? startOffset
    : originalString.length - endOffset

export const calculate = (
  originalString: string,
  el: HTMLElement,
  options: UseTruncateOptions,
): string => {
  const originalElTextContent = el.textContent
  const originalElWordBreak = el.style.wordBreak
  el.style.wordBreak = "break-all"
  el.textContent = originalString
  const availableWidth =
    el.clientWidth || el.getBoundingClientRect().width - options.threshold!
  el.style.wordBreak = originalElWordBreak

  const newEl = el.cloneNode() as HTMLElement
  newEl.style.whiteSpace = "nowrap"
  newEl.style.opacity = "0"
  newEl.style.position = "absolute"
  newEl.style.display = "flex"
  newEl.style.width = `${availableWidth}px`
  document.body.appendChild(newEl)

  let ellipsisStartIndex = getInitialInsertionIndex(
    originalString,
    options.from!,
    options.startOffset!,
    options.endOffset!,
  )
  let ellipsisEndIndex = ellipsisStartIndex
  let firstHalf = ""
  let lastHalf = ""
  let truncatedString = ""
  const updateString = () => {
    firstHalf = originalString.slice(0, ellipsisStartIndex)
    lastHalf = originalString.slice(ellipsisEndIndex, originalString.length)
    truncatedString =
      firstHalf +
      (ellipsisEndIndex > ellipsisStartIndex ? options.ellipsis : "") +
      lastHalf
    newEl.textContent = truncatedString
  }
  updateString()

  while (
    isOverflownHoriz(newEl) &&
    ellipsisStartIndex >= 0 &&
    ellipsisEndIndex <= originalString.length
  ) {
    switch (options.from) {
      case TruncateFrom.Start: {
        if (ellipsisEndIndex >= originalString.length) {
          ellipsisStartIndex -= 1
        } else {
          ellipsisEndIndex += 1
        }
        break
      }
      case TruncateFrom.End: {
        if (ellipsisStartIndex <= 0) {
          ellipsisEndIndex += 1
        } else {
          ellipsisStartIndex -= 1
        }
        break
      }
      case TruncateFrom.Middle: {
        if (
          firstHalf.length +
            options.startOffset! -
            lastHalf.length -
            options.endOffset! >
          0
        ) {
          // First half bigger than second - remove from start unless already at 0
          if (ellipsisStartIndex <= 0) {
            ellipsisEndIndex += 1
          } else {
            ellipsisStartIndex -= 1
          }
        } else {
          // First half smaller than second - remove second unless already at end
          if (ellipsisEndIndex >= originalString.length) {
            ellipsisStartIndex -= 1
          } else {
            ellipsisEndIndex += 1
          }
        }
        break
      }
    }
    updateString()
  }

  newEl.remove()

  if (!options.disableMutation) {
    // In theory this shouldn't be needed. In practice, it basically is.
    // Without mutation, the hook returns a string which can just be passed to the tag as a child
    // But react renders are slower than dom manipulation.
    // Component updates and renders are likely to get outdated when resizing a window or element gradually
    // Component will think it's done truncating but dom has since updated.
    // Mutating an externally created ref is shady as hell but it gives best stability
    el.textContent = truncatedString
    el.style.whiteSpace = "nowrap"
  } else {
    // If no mutation wanted, put it back before we started playing with it
    el.textContent = originalElTextContent
  }

  return truncatedString
}
