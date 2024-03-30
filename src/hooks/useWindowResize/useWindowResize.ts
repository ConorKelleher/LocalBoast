import { useEffect, useState } from "react"

export const useWindowResize = () => {
  const [size, setSize] = useState(() => ({
    height: window.innerHeight,
    width: window.innerWidth,
  }))
  useEffect(() => {
    const onResize = () => {
      setSize({
        height: window.innerHeight,
        width: window.innerHeight,
      })
    }
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return size
}

export default useWindowResize
