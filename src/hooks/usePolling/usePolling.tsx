import { merge } from "localboast/utils/objectHelpers"
import useInterval, {
  USE_INTERVAL_DEFAULT_OPTIONS,
  UseIntervalOptions,
} from "localboast/hooks/useInterval"
import { useEffect, useRef } from "react"

export interface UsePollingOptions extends UseIntervalOptions {}

export const USE_POLLING_DEFAULT_OPTIONS = {
  ...USE_INTERVAL_DEFAULT_OPTIONS,
}

export const usePolling = (
  func: (endPolling: () => void) => void,
  ms: number,
  options?: UsePollingOptions,
) => {
  const mergedOptions = merge(USE_POLLING_DEFAULT_OPTIONS, options)
  const endPollingRef = useRef<() => void>()

  const intervalData = useInterval(
    () => {
      func(endPollingRef.current!)
    },
    ms,
    mergedOptions,
  )
  const endPolling = intervalData[1]

  useEffect(() => {
    endPollingRef.current = endPolling
  }, [endPolling])

  return intervalData
}

export default usePolling
