import { useState } from "react"
import useEventListener from "localboast/hooks/useEventListener"

export const useWindowResize = () => {
  const [size, setSize] = useState(() => ({
    height: window.innerHeight,
    width: window.innerWidth,
  }))

  useEventListener(
    "resize",
    () => {
      setSize({
        height: window.innerHeight,
        width: window.innerWidth,
      })
    },
    { el: window },
  )

  return size
}

export default useWindowResize
