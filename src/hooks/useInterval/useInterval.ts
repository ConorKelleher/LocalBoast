import useUpdatingRef from "localboast/hooks/useUpdatingRef"
import { merge } from "localboast/utils/objectHelpers"
import { useCallback, useEffect, useRef, useState } from "react"

export interface UseIntervalOptions {
  active?: boolean
  runAtStart?: boolean
}

export const USE_INTERVAL_DEFAULT_OPTIONS = {
  active: true,
  runAtStart: false,
}

export const useInterval = (
  func: () => void,
  ms: number,
  options?: UseIntervalOptions,
) => {
  // Used as a dep for our useEffect to allow external "resetting" of the interval
  const [intervalIndex, setIntervalIndex] = useState(0)
  const mergedOptions = merge(USE_INTERVAL_DEFAULT_OPTIONS, options)
  const intervalRef = useRef<NodeJS.Timeout>()
  const funcRef = useUpdatingRef(func)
  const [intervalActive, setIntervalActive] = useState(false)

  const cancelInterval = useCallback(() => {
    clearInterval(intervalRef.current)
    intervalRef.current = undefined
    setIntervalActive(false)
  }, [])

  const resetInterval = useCallback(() => {
    setIntervalIndex((prevIndex) => prevIndex + 1)
  }, [])

  useEffect(() => {
    if (!mergedOptions.active) {
      if (intervalRef.current) {
        cancelInterval()
      }
      return
    }
    setIntervalActive(true)
    intervalRef.current = setInterval(() => {
      funcRef.current()
    }, ms)
    if (mergedOptions.runAtStart) {
      funcRef.current()
    }
    return cancelInterval
  }, [
    funcRef,
    ms,
    intervalIndex,
    mergedOptions.runAtStart,
    mergedOptions.active,
    cancelInterval,
  ])

  return {
    cancel: cancelInterval,
    reset: resetInterval,
    active: intervalActive,
  }
}

export default useInterval
