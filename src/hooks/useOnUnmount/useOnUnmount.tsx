import { useUpdatingRef } from "hooks"
import { useEffect } from "react"

const useUnmount = (func: () => void) => {
  const funcRef = useUpdatingRef(func)

  // Runs provided func method when the component unmounts
  useEffect(() => {
    const func = funcRef.current
    return () => func()
  }, [funcRef])
}

export default useUnmount
