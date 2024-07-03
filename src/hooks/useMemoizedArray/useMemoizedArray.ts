import { shallowEqual } from "localboast/utils"
import { useEffect, useRef } from "react"

// Allows shallow-memoization of an arbitrary array
const useMemoizedArray = <T>(arr: T[]) => {
  const arrRef = useRef(arr)

  const arrayChanged = !shallowEqual(arr, arrRef.current)

  useEffect(() => {
    if (arrayChanged) {
      arrRef.current = arr
    }
  }, [arrayChanged, arr])

  return arrayChanged ? arr : arrRef.current
}

export default useMemoizedArray
