import useUpdatingRef from "localboast/hooks/useUpdatingRef"
import { useCallback, useEffect, useRef, useState } from "react"

type OnScroll = (e: Event) => void

export const useScrollDetection = (onScroll: OnScroll) => {
  const scrollListenedRef = useRef<HTMLElement | null>(null)
  const [listenerIndex, setListenerIndex] = useState(0)
  const onScrollRef = useUpdatingRef(onScroll)

  const handleScroll = useCallback(
    (e: Event) => {
      onScrollRef.current(e)
    },
    [onScrollRef],
  )

  useEffect(() => {
    const listenedElement = scrollListenedRef.current
    if (listenedElement) {
      listenedElement.addEventListener("scroll", handleScroll)

      return () => {
        listenedElement.removeEventListener("scroll", handleScroll)
      }
    }
  }, [listenerIndex, handleScroll])

  return useCallback((newRef: HTMLElement | null) => {
    if (newRef) {
      scrollListenedRef.current = newRef
      // Update index to trigger new effect run
      setListenerIndex((oldIndex) => oldIndex + 1)
    }
  }, [])
}

export default useScrollDetection
