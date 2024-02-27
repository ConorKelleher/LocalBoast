import useUpdatingRef from "localboast/hooks/useUpdatingRef"
import useSize from "localboast/hooks/useSize"
import { useCallback, useRef, useState } from "react"
import { calculate } from "./helpers/useTruncateHelpers"

export enum TruncateFrom {
  Start = "start",
  Middle = "middle",
  End = "end",
}

export interface UseTruncateOptions {
  ellipsis?: string
  from?: TruncateFrom
  startOffset?: number
  endOffset?: number
  disableWarnings?: boolean
  disableMutation?: boolean
  disableNativeTruncate?: boolean
  threshold?: number
}

export const USE_TRUNCATE_DEFAULT_OPTIONS = {
  from: TruncateFrom.End,
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
    from === TruncateFrom.End &&
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
