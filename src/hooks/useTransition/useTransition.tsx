import { InterfaceIsImplemented } from "localboast/internal/assertTypes"
import { CSSProperties, useRef } from "react"
import { merge } from "localboast/utils/objectHelpers"
import { useEffect, useMemo, useState } from "react"
import useMemoizedArray from "localboast/hooks/useMemoizedArray"
import useInterval from "localboast/hooks/useInterval"
import useUpdatingRef from "localboast/hooks/useUpdatingRef"

export const UseTransitionType = {
  scaleUp: "scaleUp",
  scaleDown: "scaleDown",
  /** alias for scaleUp */
  scale: "scale",
  rotateRight: "rotateRight",
  rotateLeft: "rotateLeft",
  /** alias for rotate right */
  rotate: "rotate",
  panLeft: "panLeft",
  panRight: "panRight",
  panUp: "panUp",
  panDown: "panDown",
  /** alias for pan right */
  pan: "pan",
} as const
export type UseTransitionType = keyof typeof UseTransitionType
export const UseTransitionBehavior = {
  normal: "normal",
  mirror: "mirror",
  loop: "loop",
  "ping-pong": "ping-pong",
} as const
export type UseTransitionBehavior = keyof typeof UseTransitionBehavior
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
export const PAN_TYPES: UseTransitionType[] = [
  UseTransitionType.panLeft,
  UseTransitionType.panRight,
  UseTransitionType.panUp,
  UseTransitionType.panDown,
  UseTransitionType.pan,
]
export type Vector = [number, number, number]
const ROTATE_RIGHT_VECTOR = [0, 0, 1] as Vector
const ROTATE_LEFT_VECTOR = [0, 0, -1] as Vector
const DEFAULT_SCALE_UP_AMOUNT = 1.5
const DEFAULT_SCALE_DOWN_AMOUNT = 0.67

const panToTranslateValue = (pan: number | string, negate?: boolean) => {
  let valueString = typeof pan === "string" ? pan : (pan || 0) + "px"
  if (negate) {
    if (valueString.charAt(0) === "-") {
      valueString = valueString.slice(1)
    } else {
      valueString = `-${valueString}`
    }
  }
  return valueString
}

const getTransform = ({
  types,
  scale,
  rotation,
  panX,
  panY,
  rotationVector,
}: {
  types: UseTransitionType[]
  scale: number
  rotation: number
  panX: number | string
  panY: number | string
  rotationVector?: Vector
}) => {
  const transforms = []
  if (types.some((type) => SCALE_TYPES.includes(type))) {
    transforms.push(`scale(${scale})`)
  }
  if (types.some((type) => ROTATE_TYPES.includes(type))) {
    let vectorToUse = rotationVector
    if (!rotationVector) {
      // No custom vector provided, use default depending on type
      vectorToUse = types.includes(UseTransitionType.rotateLeft)
        ? ROTATE_LEFT_VECTOR
        : ROTATE_RIGHT_VECTOR // "rotate" equal to "rotateRight" if no value provided
    }
    transforms.push(`rotate3d(${vectorToUse}, ${rotation}deg)`)
  }
  if (types.some((type) => PAN_TYPES.includes(type))) {
    let transformX: number | string = 0
    let transformY: number | string = 0
    if (types.includes(UseTransitionType.panUp)) {
      transformY = panToTranslateValue(panY, true)
    }
    if (types.includes(UseTransitionType.panDown)) {
      transformY = panToTranslateValue(panY)
    }
    if (types.includes(UseTransitionType.panLeft)) {
      transformX = panToTranslateValue(panX, true)
    }
    if (
      types.includes(UseTransitionType.panRight) ||
      types.includes(UseTransitionType.pan)
    ) {
      transformX = panToTranslateValue(panX)
    }

    transforms.push(`translate(${transformX}, ${transformY})`)
  }
  return transforms.join(" ")
}

export interface UseTransitionOptions {
  shouldTransition?: boolean
  ms?: number
  delayMs?: number
  animationTimingFunction?: CSSProperties["animationTimingFunction"]
  rotationVector?: Vector
  initialScale?: number
  initialRotation?: number
  initialPanX?: number | string
  initialPanY?: number | string
  scale?: number
  rotation?: number
  panX?: number | string
  panY?: number | string
  behavior?: UseTransitionBehavior
  loopInterval?: number
}
const ENDLESS_BEHAVIORS = [
  UseTransitionBehavior.loop,
  UseTransitionBehavior["ping-pong"],
]
const SYMMETRIC_BEHAVIORS = [
  UseTransitionBehavior.mirror,
  UseTransitionBehavior["ping-pong"],
]

export enum UseTransitionOptionsKeys {
  shouldTransition,
  ms,
  delayMs,
  loopInterval,
  animationTimingFunction,
  rotationVector,
  initialScale,
  initialRotation,
  initialPanX,
  initialPanY,
  scale,
  rotation,
  panX,
  panY,
  behavior,
}

type _verifyOptions = InterfaceIsImplemented<
  UseTransitionOptions,
  typeof UseTransitionOptionsKeys
>

export const USE_TRANSITION_DEFAULT_OPTIONS = {
  shouldTransition: true,
  ms: 300,
  delayMs: 0,
  loopInterval: 500,
  animationTimingFunction: "ease",
  initialScale: 1,
  initialRotation: 0,
  initialPanX: 0,
  initialPanY: 0,
  rotation: 360,
  panX: "100%",
  panY: "100%",
  behavior: UseTransitionBehavior.normal as UseTransitionBehavior,
}

// Required delay between resetting to no transition and re-enabling the transition
const RESET_TIMEOUT_MS = 50

export const useTransition = (
  type: UseTransitionType | UseTransitionType[], // I have no memory why I made this optionally an array. Will leave for now in case it's needed
  options?: UseTransitionOptions,
) => {
  const mergedOptions = merge(USE_TRANSITION_DEFAULT_OPTIONS, options)
  const {
    ms: transitionMs,
    shouldTransition,
    delayMs,
    loopInterval,
    initialRotation,
    initialPanX,
    initialPanY,
    initialScale,
  } = mergedOptions
  const [isMirrored, setIsMirrored] = useState(false)
  const isMirroredRef = useUpdatingRef(isMirrored)
  const isFirstIterationRef = useRef(true)
  const [isReset, setIsReset] = useState(false)
  const [scale, setScale] = useState(initialScale)
  const [panX, setPanX] = useState<number | string>(initialPanX)
  const [panY, setPanY] = useState<number | string>(initialPanY)
  const [rotation, setRotation] = useState(initialRotation)
  const memoizedRotationVector = useMemoizedArray(
    mergedOptions.rotationVector || [],
  )
  const rotationVectorToUse = mergedOptions.rotationVector
    ? (memoizedRotationVector as Vector)
    : undefined
  const memoizedTypes = useMemoizedArray(Array.isArray(type) ? type : [type])
  let scaleToUse = mergedOptions.scale
  if (scaleToUse === undefined) {
    // No custom vector provided, use default depending on type
    scaleToUse = memoizedTypes.includes(UseTransitionType.scaleDown)
      ? DEFAULT_SCALE_DOWN_AMOUNT
      : DEFAULT_SCALE_UP_AMOUNT // "scale" equal to "scaleUp" if no value provided
  }

  // On mount if shouldTransition on mount, or whenever shouldTransition becomes true, or values change
  useEffect(() => {
    if (shouldTransition) {
      setScale(scaleToUse!) // not optional but build compiler thinks it is?
      setRotation(mergedOptions.rotation)
      setPanX(mergedOptions.panX)
      setPanY(mergedOptions.panY)
    } else {
      setScale(mergedOptions.initialScale)
      setRotation(mergedOptions.initialRotation)
      setPanX(mergedOptions.initialPanX)
      setPanY(mergedOptions.initialPanY)
    }
  }, [
    shouldTransition,
    scaleToUse,
    mergedOptions.rotation,
    mergedOptions.panX,
    mergedOptions.panY,
    mergedOptions.initialScale,
    mergedOptions.initialRotation,
    mergedOptions.initialPanX,
    mergedOptions.initialPanY,
  ])

  const shouldLoopEndlessly = (
    ENDLESS_BEHAVIORS as UseTransitionBehavior[]
  ).includes(mergedOptions.behavior)
  const shouldUpdateOnFinish =
    shouldLoopEndlessly ||
    (mergedOptions.behavior === UseTransitionBehavior.mirror && !isMirrored)

  const transitionMsToUse = isReset ? 0 : transitionMs
  const transitionSeconds = transitionMsToUse / 1000
  const transitionDelayMsToUse = isFirstIterationRef.current
    ? delayMs
    : isReset || mergedOptions.behavior === "normal"
    ? 0
    : loopInterval
  const transitionDelaySeconds = transitionDelayMsToUse / 1000

  const { cancel: clearInterval, reset: resetInterval } = useInterval(
    () => {
      if (
        (SYMMETRIC_BEHAVIORS as UseTransitionBehavior[]).includes(
          mergedOptions.behavior,
        )
      ) {
        if (shouldLoopEndlessly || !isMirrored) {
          setIsMirrored((oldIsMirrored) => !oldIsMirrored)
        }
      } else {
        setIsReset(true)
      }
      isFirstIterationRef.current = false
    },
    transitionMsToUse + transitionDelayMsToUse,
    { active: shouldUpdateOnFinish && !isReset },
  )

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null
    if (isReset) {
      clearInterval()
      timeout = setTimeout(() => {
        setIsReset(false)
        resetInterval()
      }, RESET_TIMEOUT_MS)
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [isReset, clearInterval, resetInterval])

  // When changing any of the transition props, clear mirrored state if set
  useEffect(() => {
    isFirstIterationRef.current = true
    if (isMirroredRef.current) {
      setIsMirrored(false)
    }
  }, [
    memoizedTypes,
    isMirroredRef,
    options?.shouldTransition,
    options?.ms,
    options?.delayMs,
    options?.animationTimingFunction,
    options?.rotationVector,
    options?.initialScale,
    options?.initialRotation,
    options?.scale,
    options?.rotation,
    options?.behavior,
  ])

  return useMemo(() => {
    const returning = isMirrored || isReset
    return shouldTransition
      ? {
          transform: getTransform({
            types: memoizedTypes,
            scale: returning ? initialScale : scale,
            panX: returning ? initialPanX : panX,
            panY: returning ? initialPanY : panY,
            rotation: returning ? initialRotation : rotation,
            rotationVector: rotationVectorToUse,
          }),
          transition: `transform ${transitionSeconds}s ease ${transitionDelaySeconds}s`,
        }
      : {}
  }, [
    shouldTransition,
    transitionSeconds,
    transitionDelaySeconds,
    scale,
    rotation,
    panX,
    panY,
    memoizedTypes,
    rotationVectorToUse,
    isMirrored,
    isReset,
    initialPanX,
    initialPanY,
    initialRotation,
    initialScale,
  ])
}

export default useTransition
