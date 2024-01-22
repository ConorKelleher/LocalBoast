import { useCallback, useEffect, useRef, useState } from "react"
import styles from "./styles.module.sass"
import { useUpdatingRef } from "hooks"

const strings = [
  "Test",
  "Test: this is a PoC",
  "Test: this is a PoC of animating text.",
  "Test: those are PoCs of animating text.",
  "Test: those are PoCs of animating text that I hope you like.",
]

type ProgressUpdate = (progress: number) => void

const useAnimate = () => {
  const animationStartRef = useRef<number>()
  const previousTimeStampRef = useRef<number>()
  const [animating, setAnimating] = useState(false)
  const animationMsRef = useRef<number>(0)
  const progressCallbackRef = useRef<ProgressUpdate>()
  const animationRequestRef = useRef<number>()

  const cleanupRef = useRef(() => {
    if (animationRequestRef.current) {
      window.cancelAnimationFrame(animationRequestRef.current)
    }
    animationStartRef.current = undefined
    previousTimeStampRef.current = undefined
    animationMsRef.current = 0
    progressCallbackRef.current = undefined
    setAnimating(false)
    animationRequestRef.current = undefined
  })

  useEffect(() => {
    const cleanup = cleanupRef.current
    return () => {
      cleanup()
    }
  }, [])

  const animationStepRef = useRef((timeStamp: number) => {
    animationRequestRef.current = undefined
    if (animationStartRef.current === undefined) {
      animationStartRef.current = timeStamp
    }
    const elapsed = timeStamp - animationStartRef.current
    let done = false
    if (previousTimeStampRef.current !== timeStamp) {
      const unclampedProgress = elapsed / animationMsRef.current
      const clampedProgress = Math.min(1, unclampedProgress)
      if (unclampedProgress >= 1) {
        done = true
      }
      progressCallbackRef.current!(clampedProgress)
    }
    if (!done) {
      previousTimeStampRef.current = timeStamp
      animationRequestRef.current = window.requestAnimationFrame(
        animationStepRef.current,
      )
    } else {
      cleanupRef.current()
    }
  })

  const start = useCallback(
    (progressUpdate: ProgressUpdate, animationMs: number) => {
      // Cleanup any lingering anims + reset default states
      cleanupRef.current()
      animationMsRef.current = animationMs
      progressCallbackRef.current = progressUpdate
      setAnimating(true)
      animationRequestRef.current = window.requestAnimationFrame(
        animationStepRef.current,
      )
    },
    [],
  )

  const cancel = useCallback(() => {
    cleanupRef.current()
  }, [])

  return {
    animating,
    start,
    cancel,
  }
}

interface PlaybackOptions {
  msPerChar?: number
}

const DEFAULT_OPTIONS = {
  msPerChar: 50,
}

interface StringAddition {
  added: string
  addedIndex: number
}
interface StringRemoval {
  removed: string
  removedIndex: number
}
interface StringDiff extends StringAddition, StringRemoval {
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

const insertToString = (source: string, index: number, value: string) =>
  `${source.slice(0, index)}${value}${source.slice(index)}`

const removeFromString = (source: string, index: number, count: number) =>
  `${source.slice(0, index)}${source.slice(
    Math.min(source.length, index + count),
  )}`

const getInterpolatedStringDiff = (
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

const diffStrings = (aString: string, bString: string): StringDiff => {
  // // Find startIndex of removals from aString
  // for (let i = 0; i < aString.length; i++) {
  //   const charsEqual = aString.charAt(i) === bString.charAt(i)
  //   if (charsEqual) {
  //     removedIndex += 1
  //   } else {
  //     foundRemoval = true
  //     break
  //   }
  // }
  // if (foundRemoval) {
  //   // If found startIndex for removals, find endIndex
  //   for (let i = 0; i < aString.length - removedIndex; i++) {
  //     const charsEqual =
  //       aString.charAt(aString.length - 1 - i) ===
  //       bString.charAt(bString.length - 1 - i)
  //     if (!charsEqual) {
  //       removed = aString.slice(removedIndex, aString.length - 1 - i)
  //       break
  //     }
  //   }
  // } else {
  //   removedIndex = -1
  // }
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

const Playback = (options: PlaybackOptions) => {
  const [index, setIndex] = useState(0)
  const goalString = strings[index]
  const [currString, setCurrString] = useState(goalString)
  const currStringRef = useRef(currString)
  const { start } = useAnimate()
  const mergedOptionsRef = useUpdatingRef({
    ...DEFAULT_OPTIONS,
    ...options,
  })

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
        const animTime = totalCharsChange * mergedOptionsRef.current.msPerChar
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
    if (goalString !== currStringRef.current) {
      animate(goalString)
    }
  }, [goalString, currStringRef, animate])

  return (
    <>
      <pre className={styles.animate_text}>{currString}</pre>
      <button
        onClick={() => setIndex((oldIndex) => (oldIndex + 1) % strings.length)}
      >
        {index < strings.length - 1 ? "Next" : "reset"}
      </button>
    </>
  )
}

export default Playback
