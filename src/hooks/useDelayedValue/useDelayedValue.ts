import useUpdatingRef from "localboast/hooks/useUpdatingRef"
import { merge } from "localboast/utils"
import { useCallback, useEffect, useRef, useState } from "react"

export interface UseDelayedValueOptions {
  delay: number
  immediateIf?: (value: unknown) => boolean
}
export const USE_DELAYED_VALUE_DEFAULT_OPTIONS = {
  delay: 200,
  immediateIf: false,
}
export const useDelayedValue = <T>(
  value: T,
  options: UseDelayedValueOptions,
) => {
  const [storedValue, setStoredValue] = useState(value)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const lastValueRef = useRef(value)
  const mergedOptions = merge(USE_DELAYED_VALUE_DEFAULT_OPTIONS, options)
  const immediateIfRef = useUpdatingRef(mergedOptions.immediateIf)

  useEffect(() => {
    if (lastValueRef.current !== value) {
      const update = () => {
        setStoredValue(value)
        timeoutRef.current = undefined
        lastValueRef.current = value
      }
      if (immediateIfRef.current && immediateIfRef.current(value)) {
        update()
      } else {
        timeoutRef.current = setTimeout(update, mergedOptions.delay)
      }
    }

    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [value, mergedOptions.delay, immediateIfRef])

  const setImmediate = useCallback((immediateValue: T) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setStoredValue(immediateValue)
    lastValueRef.current = immediateValue
  }, [])

  return [storedValue, setImmediate] as const
}

export default useDelayedValue
