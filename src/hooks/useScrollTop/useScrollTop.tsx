import { useState } from "react"
import useScrollDetection from "localboast/hooks/useScrollDetection"

export const useScrollTop = (el: HTMLElement) => {
  const [scrollTop, setScrollTop] = useState(el.scrollTop)
  useScrollDetection((e) => {
    setScrollTop((e.target as HTMLElement).scrollTop)
  })
  return scrollTop
}

export default useScrollTop
