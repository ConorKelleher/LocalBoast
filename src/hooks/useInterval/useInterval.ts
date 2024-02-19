import { useUpdatingRef } from "hooks"
import { useEffect, useRef } from "react"

const useInterval = (func: () => void, ms: number) => {
  const intervalRef = useRef<NodeJS.Timeout>()
  const funcRef = useUpdatingRef(func)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      funcRef.current()
    }, ms)
    return () => {
      clearInterval(intervalRef.current)
      intervalRef.current = undefined
    }
  }, [funcRef, ms])
}

export default useInterval
