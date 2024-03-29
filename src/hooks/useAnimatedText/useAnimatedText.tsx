import {
  diffStrings,
  getInterpolatedStringDiff,
} from "localboast/utils/stringHelpers"
import useUpdatingRef from "localboast/hooks/useUpdatingRef"
import useAnimationFrames from "localboast/hooks/useAnimationFrames"
import { merge } from "localboast/utils/objectHelpers"
import { useCallback, useEffect, useRef, useState } from "react"

export const USE_ANIMATED_TEXT_DEFAULT_OPTIONS = {
  msPerChar: 15,
}

export interface UseAnimatedTextOptions {
  /**
   * Milliseconds allocated per character revealed/hidden.
   *
   * Note: Since animation here is done through interpolation
   * of full anim time (msPerChar * diff.length) (to keep overall time consistent
   * across machines, this per-char figure is not strictly true in practice.
   */
  msPerChar?: number
}

export const useAnimatedText = (
  text: string,
  options?: UseAnimatedTextOptions,
) => {
  const [currString, setCurrString] = useState(text)
  const currStringRef = useRef(currString)
  const { start } = useAnimationFrames()
  const mergedOptionsRef = useUpdatingRef(
    merge(USE_ANIMATED_TEXT_DEFAULT_OPTIONS, options),
  )

  const animate = useCallback(
    (goalString: string) => {
      const startString = currStringRef.current
      if (startString !== goalString) {
        const stringDiff = diffStrings(currStringRef.current, goalString)
        const {
          removed,
          added,
          removedIndex,
          addedIndex,
          stringAfterRemovals,
        } = stringDiff
        const totalCharsChange = removed.length + added.length
        const removedRatio = removed.length / totalCharsChange
        const additionRatio = 1 - removedRatio
        let completedRemoval = removed.length === 0
        const animTime = totalCharsChange * mergedOptionsRef.current!.msPerChar! // Safe to assert since we've merged in our defaults
        start((progress) => {
          let interpolatedString

          if (completedRemoval) {
            interpolatedString = stringAfterRemovals
          } else {
            const unclampedRemovalProgress = completedRemoval
              ? 1
              : progress / removedRatio
            const clampedRemovalProgress = Math.min(1, unclampedRemovalProgress)
            if (unclampedRemovalProgress >= 1) {
              completedRemoval = true
              interpolatedString = stringAfterRemovals
            } else {
              interpolatedString = getInterpolatedStringDiff(
                stringAfterRemovals,
                { addedIndex: removedIndex, added: removed },
                1 - clampedRemovalProgress,
              )
            }
          }
          if (added.length && completedRemoval) {
            const unclampedAdditionProgress =
              (progress - removedRatio) / additionRatio
            const clampedAdditionProgress = Math.min(
              1,
              unclampedAdditionProgress,
            )
            interpolatedString = getInterpolatedStringDiff(
              stringAfterRemovals,
              { added, addedIndex },
              clampedAdditionProgress,
            )
          }
          if (interpolatedString !== currStringRef.current) {
            setCurrString(interpolatedString)
            currStringRef.current = interpolatedString
          }
        }, animTime)
      }
    },
    [start, mergedOptionsRef, currStringRef],
  )

  useEffect(() => {
    if (typeof text === "string" && text !== currStringRef.current) {
      animate(text)
    }
  }, [text, currStringRef, animate])

  // Allow returning of provided argument if not string
  return typeof text === "string" ? currString : text
}

export default useAnimatedText
