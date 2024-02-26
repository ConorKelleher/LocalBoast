import { useCallback, useEffect, useRef, useState } from "react"

export type ProgressUpdate = (progress: number) => void

export const useAnimationFrames = () => {
  const animationStartRef = useRef<number>()
  const previousTimeStampRef = useRef<number>()
  const [animating, setAnimating] = useState(false)
  const animationMsRef = useRef<number>(0)
  const progressCallbackRef = useRef<ProgressUpdate>()
  const animationRequestRef = useRef<number>()

  const cleanupRef = useRef(() => {
    if (animationRequestRef.current) {
      window.cancelAnimationFrame(animationRequestRef.current)
    }
    animationStartRef.current = undefined
    previousTimeStampRef.current = undefined
    animationMsRef.current = 0
    progressCallbackRef.current = undefined
    setAnimating(false)
    animationRequestRef.current = undefined
  })

  useEffect(() => {
    const cleanup = cleanupRef.current
    return () => {
      cleanup()
    }
  }, [])

  const animationStepRef = useRef((timeStamp: number) => {
    animationRequestRef.current = undefined
    if (animationStartRef.current === undefined) {
      animationStartRef.current = timeStamp
    }
    const elapsed = timeStamp - animationStartRef.current
    let done = false
    if (previousTimeStampRef.current !== timeStamp) {
      const unclampedProgress = elapsed / animationMsRef.current
      const clampedProgress = Math.min(1, unclampedProgress)
      if (unclampedProgress >= 1) {
        done = true
      }
      progressCallbackRef.current!(clampedProgress)
    }
    if (!done) {
      previousTimeStampRef.current = timeStamp
      animationRequestRef.current = window.requestAnimationFrame(
        animationStepRef.current,
      )
    } else {
      cleanupRef.current()
    }
  })

  const start = useCallback(
    (progressUpdate: ProgressUpdate, animationMs: number) => {
      // Cleanup any lingering anims + reset default states
      cleanupRef.current()
      animationMsRef.current = animationMs
      progressCallbackRef.current = progressUpdate
      setAnimating(true)
      animationRequestRef.current = window.requestAnimationFrame(
        animationStepRef.current,
      )
    },
    [],
  )

  const stop = useCallback(() => {
    cleanupRef.current()
  }, [])

  return {
    animating,
    start,
    stop,
  }
}

export default useAnimationFrames
