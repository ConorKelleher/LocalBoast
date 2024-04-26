import useUpdatingRef from "localboast/hooks/useUpdatingRef"
import { merge } from "localboast/utils/objectHelpers"
import { useCallback, useEffect, useRef, useState } from "react"

export interface UseTimeoutOptions {
  active?: boolean
}
export const USE_TIMEOUT_DEFAULT_OPTIONS = {
  active: true,
}
export const useTimeout = (
  func: () => void,
  ms: number,
  options?: UseTimeoutOptions,
) => {
  const mergedOptions = merge(USE_TIMEOUT_DEFAULT_OPTIONS, options)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const funcRef = useUpdatingRef(func)
  const [timeoutActive, setTimeoutActive] = useState(false)

  const cancelTimeout = useCallback(() => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = undefined
    setTimeoutActive(false)
  }, [])

  useEffect(() => {
    if (!mergedOptions.active) {
      if (timeoutRef.current) {
        cancelTimeout()
      }
      return
    }
    setTimeoutActive(true)
    timeoutRef.current = setTimeout(() => {
      funcRef.current()
      setTimeoutActive(false)
    }, ms)
    return cancelTimeout
  }, [funcRef, ms, mergedOptions.active, cancelTimeout])

  return timeoutActive ? cancelTimeout : null
}

export default useTimeout
