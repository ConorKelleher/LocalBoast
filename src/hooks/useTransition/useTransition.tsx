import { merge } from "localboast/utils/objectHelpers"
import { useEffect, useMemo, useState } from "react"

export const UseTransitionType = {
  scaleUp: "scaleUp",
  scaleDown: "scaleDown",
  /** alias for scaleUp */
  scale: "scale",
  rotateRight: "rotateRight",
  rotateLeft: "rotateLeft",
  /** alias for rotate right */
  rotate: "rotate",
} as const
export type UseTransitionType = keyof typeof UseTransitionType
export const SCALE_TYPES: UseTransitionType[] = [
  UseTransitionType.scale,
  UseTransitionType.scaleUp,
  UseTransitionType.scaleDown,
]
export const ROTATE_TYPES: UseTransitionType[] = [
  UseTransitionType.rotateLeft,
  UseTransitionType.rotateRight,
  UseTransitionType.rotate,
]
export type Vector = [number, number, number]
const ROTATE_RIGHT_VECTOR = [0, 0, 1] as Vector
const ROTATE_LEFT_VECTOR = [0, 0, -1] as Vector
const DEFAULT_SCALE_UP_AMOUNT = 1.5
const DEFAULT_SCALE_DOWN_AMOUNT = 0.67

const getTransform = ({
  type,
  scale,
  rotation,
  rotationVector,
}: {
  type: keyof typeof UseTransitionType
  scale: number
  rotation: number
  rotationVector?: Vector
}) => {
  const transforms = []
  if (SCALE_TYPES.includes(type)) {
    transforms.push(`scale(${scale})`)
  }
  if (ROTATE_TYPES.includes(type)) {
    let vectorToUse = rotationVector
    if (!rotationVector) {
      // No custom vector provided, use default depending on type
      vectorToUse =
        type === UseTransitionType.rotateLeft
          ? ROTATE_LEFT_VECTOR
          : ROTATE_RIGHT_VECTOR // "rotate" equal to "rotateRight" if no value provided
    }
    transforms.push(`rotate3d(${vectorToUse}, ${rotation}deg)`)
  }
  return transforms.join(" ")
}

export interface UseTransitionOptions {
  shouldTransition?: boolean
  ms?: number
  rotationVector?: Vector
  initialScale?: number
  initialRotation?: number
  scale?: number
  rotation?: number
}

export const USE_TRANSITION_DEFAULT_OPTIONS = {
  shouldTransition: true,
  ms: 300,
  initialScale: 1,
  initialRotation: 0,
  rotation: 360,
}

export const useTransition = (
  type: keyof typeof UseTransitionType,
  options?: UseTransitionOptions,
) => {
  const mergedOptions = merge(USE_TRANSITION_DEFAULT_OPTIONS, options)
  const { ms: transitionMs, shouldTransition } = mergedOptions
  const [scale, setScale] = useState(mergedOptions.initialScale)
  const [rotation, setRotation] = useState(mergedOptions.initialRotation)
  const [vectorX, vectorY, vectorZ] = mergedOptions.rotationVector || []
  let scaleToUse = mergedOptions.scale
  if (!scaleToUse) {
    // No custom vector provided, use default depending on type
    scaleToUse =
      type === UseTransitionType.scaleDown
        ? DEFAULT_SCALE_DOWN_AMOUNT
        : DEFAULT_SCALE_UP_AMOUNT // "scale" equal to "scaleUp" if no value provided
  }

  // On mount if shouldTransition on mount, or whenever shouldTransition becomes true, or values change
  useEffect(() => {
    if (shouldTransition) {
      setScale(scaleToUse as number) // ts is incorrectly complaining this is optional
      setRotation(mergedOptions.rotation)
    }
  }, [shouldTransition, scaleToUse, mergedOptions.rotation])

  const rotationVector = useMemo(
    () =>
      vectorX === undefined
        ? undefined
        : ([vectorX, vectorY, vectorZ] as Vector),
    [vectorX, vectorY, vectorZ],
  )

  return useMemo(
    () => ({
      transform: getTransform({
        type,
        scale,
        rotation,
        rotationVector,
      }),
      transition: `transform ${transitionMs / 1000}s ease`,
    }),
    [scale, transitionMs, rotation, type, rotationVector],
  )
}

export default useTransition
