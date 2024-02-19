import { debounce, generateRandomId } from "utils"
import { createDetectElementResize } from "./helpers/detectElementResize"
import { useUpdatingRef } from "hooks"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

export type Size = {
  height: number
  width: number
}

interface UseSizeOptions {
  debounceMs?: number
  maxDebounceMs?: number
  onResize?: (newSize: Size) => void
}

const useSize = (options?: UseSizeOptions) => {
  const [size, setSize] = useState<Size | null>(null)
  const resizeListenedRef = useRef<HTMLElement>()
  const elementRef = useRef<HTMLElement | null>(null)
  const optionsRef = useUpdatingRef(options)
  const sizeRef = useUpdatingRef(size)

  const getSize = useRef(() => {
    if (elementRef.current) {
      const { width, height } = elementRef.current.getBoundingClientRect()
      const newSize = { width, height }
      if (
        newSize.height !== sizeRef.current?.height ||
        newSize.width !== sizeRef.current?.width
      ) {
        setSize(newSize)
      }
      return newSize
    }
    return null
  })

  const onResize = useCallback(() => {
    const newSize = getSize.current()
    newSize &&
      optionsRef.current?.onResize &&
      optionsRef.current?.onResize(newSize)
  }, [optionsRef])

  const resizeObserver = useMemo(
    () => createDetectElementResize(generateRandomId()),
    [],
  )

  const disconnectObserver = useCallback(() => {
    if (resizeListenedRef.current && resizeObserver) {
      resizeObserver.removeResizeListener(resizeListenedRef.current, onResize)
    }
  }, [resizeObserver, onResize])

  const onChangeRef = useCallback(
    (newEl: HTMLElement) => {
      if (!newEl) {
        return
      }
      if (resizeListenedRef.current) {
        disconnectObserver()
        resizeListenedRef.current = undefined
      }

      elementRef.current = newEl
      onResize()

      resizeListenedRef.current = newEl.parentElement || document.body
      resizeObserver.addResizeListener(
        resizeListenedRef.current,
        optionsRef.current?.debounceMs
          ? debounce(onResize, {
              ms: optionsRef.current?.debounceMs,
              maxDebounceMs: optionsRef.current?.maxDebounceMs,
            })
          : onResize,
      )
    },
    [onResize, resizeObserver, disconnectObserver, optionsRef],
  )

  // Disconnect on unmount
  useEffect(() => {
    return () => {
      disconnectObserver()
    }
  }, [disconnectObserver])

  return {
    setRef: onChangeRef,
    size,
  }
}

export default useSize
