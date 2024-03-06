import useUpdatingRef from "localboast/hooks/useUpdatingRef"
import useSize from "localboast/hooks/useSize"
import { useCallback, useRef, useState } from "react"
import { calculate } from "./helpers/useTruncateHelpers"

export enum TruncateFrom {
  start = "start",
  middle = "middle",
  end = "end",
}

export interface UseTruncateOptions {
  /**
   * Optional ellipsis character override when performing truncation
   */
  ellipsis?: string
  /**
   * How many pixels should it over-truncate by. Used to avoid wrapping of slow updates
   */
  threshold?: number
  /**
   * From where in the string should the truncation begin (start, middle, end)
   */
  from?: TruncateFrom | keyof typeof TruncateFrom
  /**
   * How many additional characters should there be to the left of the initial ellipsis insertion point
   */
  startOffset?: number
  /**
   * How many additional characters should there be to the right of the initial ellipsis insertion point
   */
  endOffset?: number
  /**
   * Disables the default optimization that happens when using default options. Anything other than right-based, no offset truncation is more intensive than native css-based truncation, so we try to use the built-in solution where possible.
   * If that native truncation is causing problems for you, disable it here to allow the truncation to always use the more costly observer-based JS solution for truncation
   */
  disableNativeTruncate?: boolean
  /**
   * By default, the element's component is programmatically assigned to guarantee renders are in sync with DOM changes. If this feels bad, disable it (note - this will likely cause issues with unwanted wrapping)
   */
  disableMutation?: boolean
  /**
   * Turn off console warnings about passing wrong children type
   */
  disableWarnings?: boolean
}

export const USE_TRUNCATE_DEFAULT_OPTIONS = {
  from: TruncateFrom.end,
  startOffset: 0,
  endOffset: 0,
  disableWarnings: false,
  disableMutation: false,
  disableNativeTruncate: false,
  ellipsis: "…",
  threshold: 3,
}

export const useTruncate = (
  originalString: string,
  options?: UseTruncateOptions,
) => {
  const mergedOptions = {
    ...USE_TRUNCATE_DEFAULT_OPTIONS,
    ...options,
  }
  const textRef = useRef<HTMLElement>()
  // Casting props.children to string - risky up as far as early exit
  const [truncatedText, setTruncatedText] = useState<string>(originalString)
  const truncatedTextRef = useUpdatingRef(truncatedText)
  // Destructuring to primitives now to save memoization later
  const {
    from,
    startOffset,
    endOffset,
    disableWarnings,
    ellipsis,
    disableMutation,
    disableNativeTruncate,
    threshold,
  } = mergedOptions
  const shouldUseNativeTruncate =
    !disableMutation &&
    !disableNativeTruncate &&
    ellipsis === USE_TRUNCATE_DEFAULT_OPTIONS.ellipsis &&
    from === TruncateFrom.end &&
    startOffset === 0 &&
    endOffset === 0

  const onNeedRecalculate = useCallback(() => {
    if (!textRef.current) {
      return
    }
    const newTruncatedText = calculate(originalString, textRef.current, {
      from,
      startOffset,
      endOffset,
      disableWarnings,
      disableMutation,
      ellipsis,
      threshold,
    })
    if (truncatedTextRef.current !== newTruncatedText) {
      setTruncatedText(newTruncatedText)
    }
  }, [
    originalString,
    ellipsis,
    threshold,
    from,
    startOffset,
    endOffset,
    disableWarnings,
    disableMutation,
    truncatedTextRef,
  ])
  const onNeedRecalculateRef = useUpdatingRef(onNeedRecalculate)
  const onResize = useCallback(() => {
    onNeedRecalculateRef.current()
  }, [onNeedRecalculateRef])
  const { setRef: setUseSizeRef } = useSize({ onResize })

  const setupTruncate = useCallback(
    (ref: HTMLElement) => {
      if (shouldUseNativeTruncate) {
        ref.style.whiteSpace = "nowrap"
        ref.style.overflow = "hidden"
        ref.style.textOverflow = "ellipsis"
        ref.style.display = "block"
      } else {
        onNeedRecalculate()
      }
    },
    [onNeedRecalculate, shouldUseNativeTruncate],
  )

  const refCallback = useCallback(
    (ref: HTMLElement | null) => {
      if (ref) {
        setUseSizeRef(ref)
        textRef.current = ref
        setupTruncate(ref)
      }
    },
    [setupTruncate, setUseSizeRef],
  )

  // Not memoized to avoid needless checks - Expected use involves destructuring (e.g. const [text, ref] = useTruncate(...))
  return [truncatedText, refCallback] as const
}

export default useTruncate
