import { merge } from "localboast"
import { useEffect, useLayoutEffect, useRef, useState } from "react"

export type UseImageLoaderOptions = { src: string; load?: boolean }

export const USE_IMAGE_LOADER_DEFAULT_OPTIONS = {
  load: true,
}

export const useImageLoader = (options: UseImageLoaderOptions) => {
  const { src, load } = merge(USE_IMAGE_LOADER_DEFAULT_OPTIONS, options)
  const [loading, setLoading] = useState(load)
  const loadingRef = useRef(loading)
  const [loaded, setLoaded] = useState(false)
  const loadedRef = useRef(loaded)
  const [failedToLoad, setFailedToLoad] = useState(false)
  const failedToLoadRef = useRef(failedToLoad)
  const prevEffectedArgsRef = useRef({ src, load })

  const invalidateState =
    prevEffectedArgsRef.current.src !== src ||
    prevEffectedArgsRef.current.load !== load

  useEffect(() => {
    loadingRef.current = loading
    loadedRef.current = loaded
    failedToLoadRef.current = failedToLoad
  }, [loading, loaded, failedToLoad])

  // Layout effect to commit load state immediately on first render we have it
  useLayoutEffect(() => {
    prevEffectedArgsRef.current = { src, load }
    // Negate current load state if props change
    if (load) {
      if (!loadingRef.current) {
        setLoading(true)
        setFailedToLoad(false)
        setLoaded(false)
      }
    } else {
      if (loadingRef.current) {
        setLoading(false)
        setFailedToLoad(false)
      }
    }
    const newLoading = load
    const newFailedToLoad = false
    const newLoaded = false
    if (newLoading !== loadingRef.current) {
      setLoading(newLoading)
    }
    if (newFailedToLoad !== failedToLoadRef.current) {
      setFailedToLoad(newFailedToLoad)
    }
    if (newLoaded !== loadedRef.current) {
      setLoaded(newLoaded)
    }
  }, [src, load])

  useEffect(() => {
    if (!load) {
      return
    }
    const img = new Image()
    let cancelled = false

    img.onload = () => {
      if (!cancelled) {
        setFailedToLoad(false)
        setLoading(false)
        setLoaded(true)
      }
    }
    img.onerror = () => {
      if (!cancelled) {
        setFailedToLoad(true)
        setLoading(false)
      }
    }
    img.src = src
    return () => {
      cancelled = true
    }
  }, [load, src])

  return {
    loading: invalidateState ? load : loading,
    loaded: invalidateState ? false : loaded,
    failedToLoad: invalidateState ? false : failedToLoad,
  }
}
export default useImageLoader
