import useUpdatingRef from "localboast/hooks/useUpdatingRef"
import { merge } from "localboast/utils/objectHelpers"
import { useCallback, useEffect, useRef } from "react"

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

  const cancel = useCallback(() => {
    clearInterval(intervalRef.current)
    intervalRef.current = undefined
  }, [])

  useEffect(() => {
    if (!mergedOptions.active) {
      return
    }
    intervalRef.current = setInterval(() => {
      funcRef.current()
    }, ms)
    if (mergedOptions.runAtStart) {
      funcRef.current()
    }
    return cancel
  }, [funcRef, ms, mergedOptions.runAtStart, mergedOptions.active, cancel])

  return [intervalRef, cancel] as const
}

export default useInterval
