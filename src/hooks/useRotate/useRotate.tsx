import useUpdatingRef from "localboast/hooks/useUpdatingRef"
import useMove from "localboast/hooks/useMove"
import { svgToDataUri } from "localboast/utils/svgHelpers"
import { merge } from "localboast/utils/objectHelpers"
import { useCallback, useEffect, useRef, useState } from "react"
import RotateIcon from "../../icons/RotateIcon/RotateIcon.svg?raw"

type Coordinates = { x: number; y: number }

export interface UseRotateOptions {
  handleVisible?: boolean
  outerSelectionRadius?: number
}

export const USE_ROTATE_DEFAULT_OPTIONS = {
  handleVisible: true,
  outerSelectionRadius: 15,
}

const NO_OFFSET: Coordinates = { x: 0, y: 0 }
// https://stackoverflow.com/a/15994225
const RAD_TO_DEG = 180 / Math.PI
const getAngleFromOffset = (offset: Coordinates) =>
  Math.atan2(offset.y, offset.x) * RAD_TO_DEG

export const useRotate = (options?: UseRotateOptions) => {
  const mergedOptions = merge(USE_ROTATE_DEFAULT_OPTIONS, options)
  const optionsRef = useUpdatingRef(mergedOptions)
  const objectCenterCoordsRef = useRef(NO_OFFSET)
  const initialVectorAngleRef = useRef(0)
  const [rotation, setRotation] = useState(0)
  const rotationRef = useUpdatingRef(rotation)
  const persistedRotationRef = useRef(rotation)
  const onGrabHandle = useCallback((e: MouseEvent) => {
    if (!handleRef.current) {
      return
    }
    const handleBounds = handleRef.current.getBoundingClientRect()
    objectCenterCoordsRef.current = {
      x: handleBounds.x + handleBounds.width / 2,
      y: handleBounds.y + handleBounds.height / 2,
    }
    initialVectorAngleRef.current = getAngleFromOffset({
      x: e.x - objectCenterCoordsRef.current.x,
      y: e.y - objectCenterCoordsRef.current.y,
    })
  }, [])
  const onMoveHandle = useCallback((e: MouseEvent) => {
    setRotation(
      (getAngleFromOffset({
        x: e.x - objectCenterCoordsRef.current.x,
        y: e.y - objectCenterCoordsRef.current.y,
      }) -
        initialVectorAngleRef.current +
        persistedRotationRef.current) %
        360,
    )
  }, [])
  const onReleaseHandle = useCallback(() => {
    persistedRotationRef.current = rotationRef.current
  }, [rotationRef])

  const [setUseMoveHandle] = useMove({
    noPersistence: true,
    onMoveStart: onGrabHandle,
    onMove: onMoveHandle,
    onMoveEnd: onReleaseHandle,
  })
  const rotatableRef = useRef<HTMLElement | null>(null)
  const handleRef = useRef<HTMLElement | null>(null)

  const cleanUp = useCallback(() => {
    persistedRotationRef.current = 0
  }, [])

  // If visibility setting changes while we have a handle, toggle it
  useEffect(() => {
    if (options?.handleVisible !== undefined && handleRef.current) {
      handleRef.current.style.visibility = options.handleVisible
        ? "visible"
        : "hidden"
    }
  }, [options?.handleVisible])

  const setRotatable = useCallback(
    (ref: HTMLElement) => {
      if (rotatableRef.current) {
        if (rotatableRef.current === ref) {
          return
        }
        cleanUp()
      }
      rotatableRef.current = ref

      handleRef.current = document.createElement("div")
      rotatableRef.current.appendChild(handleRef.current)
      handleRef.current.style.position = "absolute"
      handleRef.current.style.zIndex = "99999"
      const { outerSelectionRadius } = optionsRef.current
      handleRef.current.style.inset = `-${outerSelectionRadius}px`
      handleRef.current.style.pointerEvents = "none"
      handleRef.current.style.borderRadius = `${outerSelectionRadius}px`
      handleRef.current.style.overflow = "hidden"
      const topPadding = document.createElement("div")
      const bottomPadding = document.createElement("div")
      const leftPadding = document.createElement("div")
      const rightPadding = document.createElement("div")
      handleRef.current.appendChild(topPadding)
      handleRef.current.appendChild(bottomPadding)
      handleRef.current.appendChild(leftPadding)
      handleRef.current.appendChild(rightPadding)
      ;(handleRef.current.style.cursor = svgToDataUri(RotateIcon)),
        (topPadding.style.position = "absolute")
      topPadding.style.top = "0"
      topPadding.style.left = "0"
      topPadding.style.right = "0"
      topPadding.style.height = `${outerSelectionRadius}px`
      topPadding.style.pointerEvents = "all"
      bottomPadding.style.position = "absolute"
      bottomPadding.style.bottom = "0"
      bottomPadding.style.left = "0"
      bottomPadding.style.right = "0"
      bottomPadding.style.height = `${outerSelectionRadius}px`
      bottomPadding.style.pointerEvents = "all"
      leftPadding.style.position = "absolute"
      leftPadding.style.top = "0"
      leftPadding.style.left = "0"
      leftPadding.style.bottom = "0"
      leftPadding.style.width = `${outerSelectionRadius}px`
      leftPadding.style.pointerEvents = "all"
      rightPadding.style.position = "absolute"
      rightPadding.style.top = "0"
      rightPadding.style.bottom = "0"
      rightPadding.style.right = "0"
      rightPadding.style.width = `${outerSelectionRadius}px`
      rightPadding.style.pointerEvents = "all"
      setUseMoveHandle(handleRef.current)
    },
    [cleanUp, setUseMoveHandle, optionsRef],
  )

  return [setRotatable, rotation] as const
}

export default useRotate
