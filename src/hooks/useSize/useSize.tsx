import debounce from "localboast/utils/debounce"
import generateRandomId from "localboast/utils/generateRandomId"
import useUpdatingRef from "localboast/hooks/useUpdatingRef"
import { useCallback, useEffect, useRef, useState } from "react"

export type Size = {
  height: number
  width: number
}

export interface UseSizeOptions {
  debounceMs?: number
  maxDebounceMs?: number
  onResize?: (newSize: Size) => void
}

export const useSize = (options?: UseSizeOptions) => {
  const [size, setSize] = useState<Size | null>(null)
  const resizeListenedRef = useRef<HTMLElement>()
  const elementRef = useRef<HTMLElement | null>(null)
  const optionsRef = useUpdatingRef(options)
  const [hasOnResizeHandlerReady, setHasOnResizeHandlerReady] = useState(false)
  const onResizeHandlerRef = useRef<() => void>()
  const resizeObserverRef =
    useRef<
      ReturnType<
        typeof import("localboast/internal/detectElementResize").createDetectElementResize
      >
    >()
  const [resizeObserverLoaded, setResizeObserverLoaded] = useState(false)
  const sizeRef = useUpdatingRef(size)

  // Dynamically import detectElementResize file on mount
  useEffect(() => {
    const importResizeObserver = async () => {
      const { createDetectElementResize } = await import(
        "localboast/internal/detectElementResize"
      )
      resizeObserverRef.current = createDetectElementResize(generateRandomId())
      setResizeObserverLoaded(true)
    }
    importResizeObserver()
  }, [])

  // Effect to attach resize handler to observer once both are in place
  useEffect(() => {
    if (resizeObserverLoaded && hasOnResizeHandlerReady) {
      resizeObserverRef.current!.addResizeListener(
        resizeListenedRef.current!,
        onResizeHandlerRef.current!,
      )
      setHasOnResizeHandlerReady(false)
    }
  }, [resizeObserverLoaded, hasOnResizeHandlerReady])

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

  const disconnectObserver = useCallback(() => {
    if (
      resizeListenedRef.current &&
      resizeObserverLoaded &&
      // @ts-ignore
      resizeListenedRef.current.__resizeListeners__
    ) {
      resizeObserverRef.current!.removeResizeListener(
        resizeListenedRef.current,
        onResize,
      )
    }
  }, [resizeObserverLoaded, onResize])

  const onChangeRef = useCallback(
    (newEl: HTMLElement) => {
      if (!newEl || newEl === elementRef.current) {
        return
      }
      if (resizeListenedRef.current) {
        disconnectObserver()
        resizeListenedRef.current = undefined
      }

      elementRef.current = newEl
      onResize()

      resizeListenedRef.current = newEl.parentElement || document.body

      // Observer might not be loaded yet so store handler in state until it's ready to observe
      const newOnResizeHandler = optionsRef.current?.debounceMs
        ? debounce(onResize, {
            ms: optionsRef.current?.debounceMs,
            maxDebounceMs: optionsRef.current?.maxDebounceMs,
          })
        : onResize
      onResizeHandlerRef.current = newOnResizeHandler
      setHasOnResizeHandlerReady(true)
    },
    [onResize, disconnectObserver, optionsRef],
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
