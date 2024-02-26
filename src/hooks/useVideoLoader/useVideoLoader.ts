import { merge } from "localboast"
import { useEffect, useLayoutEffect, useRef, useState } from "react"

export interface UseVideoLoaderOptions {
  src: string
  load?: boolean
}

export const USE_VIDEO_LOADER_DEFAULT_OPTIONS = {
  load: true,
}

export const useVideoLoader = (options: UseVideoLoaderOptions) => {
  const { src, load } = merge(USE_VIDEO_LOADER_DEFAULT_OPTIONS, options)
  const [loading, setLoading] = useState(load)
  const loadingRef = useRef(loading)
  const [metaData, setMetaData] = useState<{
    height: number
    width: number
  }>()
  const metaDataRef = useRef(metaData)
  const [failedToLoad, setFailedToLoad] = useState(false)
  const failedToLoadRef = useRef(failedToLoad)
  const prevEffectedArgsRef = useRef({ src, load })

  const invalidateState =
    prevEffectedArgsRef.current.src !== src ||
    prevEffectedArgsRef.current.load !== load

  useEffect(() => {
    loadingRef.current = loading
    metaDataRef.current = metaData
    failedToLoadRef.current = failedToLoad
  }, [loading, metaData, failedToLoad])

  // Layout effect to commit load state immediately on first render we have it
  useLayoutEffect(() => {
    prevEffectedArgsRef.current = { src, load }
    const newLoading = load
    const newFailedToLoad = false
    const newMetaData = undefined
    if (newLoading !== loadingRef.current) {
      setLoading(newLoading)
    }
    if (newFailedToLoad !== failedToLoadRef.current) {
      setFailedToLoad(newFailedToLoad)
    }
    if (newMetaData !== metaDataRef.current) {
      setMetaData(newMetaData)
    }
  }, [src, load])

  useEffect(() => {
    if (!load) {
      return
    }
    const video = document.createElement("video")
    const videoSrc = document.createElement("source")
    let cancelled = false

    video.onloadedmetadata = () => {
      if (!cancelled) {
        setFailedToLoad(false)
        setLoading(false)
        setMetaData({ height: video.videoHeight, width: video.videoWidth })
      }
    }
    video.onerror = () => {
      if (!cancelled) {
        setFailedToLoad(true)
        setLoading(false)
      }
    }
    video.appendChild(videoSrc)
    videoSrc.type = "video/mp4"
    videoSrc.src = src

    return () => {
      cancelled = true
    }
  }, [load, src])

  return {
    loading: invalidateState ? load : loading,
    failedToLoad: invalidateState ? false : failedToLoad,
    metaData: invalidateState ? undefined : metaData,
  }
}

export default useVideoLoader
