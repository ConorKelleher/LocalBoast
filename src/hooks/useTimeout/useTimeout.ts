import useUpdatingRef from "localboast/hooks/useUpdatingRef"
import { useEffect, useRef } from "react"

export const useTimeout = (
  func: () => void,
  ms: number,
  runAtStart?: boolean,
) => {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const funcRef = useUpdatingRef(func)

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      funcRef.current()
    }, ms)
    if (runAtStart) {
      funcRef.current()
    }
    return () => {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined
    }
  }, [funcRef, ms, runAtStart])
}

export default useTimeout
