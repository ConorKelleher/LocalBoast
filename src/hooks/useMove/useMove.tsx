import { merge, useUpdatingRef } from "localboast"
import { useCallback, useEffect, useRef, useState } from "react"

type Coordinates = { x: number; y: number }

export interface UseMoveOptions {
  noPersistence?: boolean
  onMoveStart?: (e: MouseEvent) => void
  onMove?: (e: MouseEvent, offset: Coordinates) => void
  onMoveEnd?: (e: MouseEvent) => void
}

export const USE_MOVE_DEFAULT_OPTIONS = {
  noPersistence: false,
  onMoveStart: () => {},
  onMove: () => {},
  onMoveEnd: () => {},
}

const NO_OFFSET: Coordinates = { x: 0, y: 0 }

export const useMove = (options?: UseMoveOptions) => {
  const handleRef = useRef<HTMLElement | null>(null)
  const startCoordinatesRef = useRef<Coordinates | null>(null)
  const [offset, setOffset] = useState<Coordinates>(NO_OFFSET)
  const offsetRef = useUpdatingRef(offset)
  // When we've moved the element, track how much we've offset it, so next time (even if it's moved on the page), we have a record of how much initial offset is required
  const persistedOffsetRef = useRef<Coordinates>(offset)
  const movingRef = useRef(false)
  const mergedOptions = merge(USE_MOVE_DEFAULT_OPTIONS, options)
  const optionsRef = useUpdatingRef(mergedOptions)

  const onMouseDown = useCallback(
    (e: MouseEvent) => {
      const { x, y }: Coordinates = e
      optionsRef.current.onMoveStart(e)
      e.preventDefault() // needed to stop text selection on drag
      movingRef.current = true

      startCoordinatesRef.current = optionsRef.current.noPersistence
        ? { x, y }
        : {
            x: x - persistedOffsetRef.current.x,
            y: y - persistedOffsetRef.current.y,
          }
    },
    [movingRef, optionsRef],
  )
  const onMouseUp = useCallback(
    (e: MouseEvent) => {
      if (movingRef.current) {
        movingRef.current = false
        persistedOffsetRef.current = offsetRef.current
        optionsRef.current.onMoveEnd(e)
      }
    },
    [movingRef, offsetRef, optionsRef],
  )
  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (movingRef.current && startCoordinatesRef.current) {
        const { x, y }: Coordinates = e
        const newOffset = {
          x: x - startCoordinatesRef.current.x,
          y: y - startCoordinatesRef.current.y,
        }
        optionsRef.current.onMove(e, newOffset)
        setOffset(newOffset)
      }
    },
    [movingRef, optionsRef],
  )

  const cleanUp = useCallback(() => {
    if (handleRef.current) {
      handleRef.current.removeEventListener("mousedown", onMouseDown)
      handleRef.current = null
    }
    document.removeEventListener("mouseup", onMouseUp)
    document.removeEventListener("mousemove", onMouseMove)

    setOffset(NO_OFFSET)
    persistedOffsetRef.current = NO_OFFSET
  }, [onMouseDown, onMouseMove, onMouseUp])

  const setHandle = useCallback(
    (ref: HTMLElement) => {
      if (handleRef.current) {
        if (handleRef.current === ref) {
          return
        }
        cleanUp()
      }
      handleRef.current = ref
      handleRef.current.addEventListener("mousedown", onMouseDown)
    },
    [cleanUp, onMouseDown],
  )

  useEffect(() => {
    document.addEventListener("mouseup", onMouseUp)
    document.addEventListener("mousemove", onMouseMove)
    return cleanUp
  }, [cleanUp, onMouseMove, onMouseUp])

  return [setHandle, offset] as const
}

export default useMove
