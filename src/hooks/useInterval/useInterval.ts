import useUpdatingRef from "localboast/hooks/useUpdatingRef"
import { useEffect, useRef } from "react"

export const useInterval = (
  func: () => void,
  ms: number,
  runAtStart?: boolean,
) => {
  const intervalRef = useRef<NodeJS.Timeout>()
  const funcRef = useUpdatingRef(func)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      funcRef.current()
    }, ms)
    if (runAtStart) {
      funcRef.current()
    }
    return () => {
      clearInterval(intervalRef.current)
      intervalRef.current = undefined
    }
  }, [funcRef, ms, runAtStart])

  return intervalRef
}

export default useInterval
