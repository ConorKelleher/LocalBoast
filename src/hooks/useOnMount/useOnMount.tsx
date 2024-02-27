import useUpdatingRef from "localboast/hooks/useUpdatingRef"
import { useEffect } from "react"

export const useOnMount = (func: () => void) => {
  const funcRef = useUpdatingRef(func)

  // Runs provided func method exactly once - when the component first mounts
  useEffect(() => {
    funcRef.current()
  }, [funcRef])
}

export default useOnMount
