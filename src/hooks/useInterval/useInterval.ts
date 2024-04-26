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
  const mergedOptions = merge(USE_INTERVAL_DEFAULT_OPTIONS, options)
  const intervalRef = useRef<NodeJS.Timeout>()
  const funcRef = useUpdatingRef(func)
  const [intervalActive, setIntervalActive] = useState(false)

  const cancelInterval = useCallback(() => {
    clearInterval(intervalRef.current)
    intervalRef.current = undefined
    setIntervalActive(false)
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
    mergedOptions.runAtStart,
    mergedOptions.active,
    cancelInterval,
  ])

  return intervalActive ? cancelInterval : null
}

export default useInterval
