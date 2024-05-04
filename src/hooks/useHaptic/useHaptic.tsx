import useUpdatingRef from "localboast/hooks/useUpdatingRef"
import useTransition, {
  Vector,
  UseTransitionType,
} from "localboast/hooks/useTransition"
import { useCallback, useRef, useState } from "react"
import { merge } from "localboast/utils/objectHelpers"
import { VerifyOptions } from "localboast/internal/assertTypes"

export type InteractionEvent = React.MouseEvent | React.KeyboardEvent

export const HapticType = {
  pop: "pop",
  spin: "spin",
} as const
export type HapticType = keyof typeof HapticType
export interface UseHapticOptions {
  /**
   * Which Haptic behaviour preset to use
   */
  type?: HapticType
  /**
   * Time in milliseconds for the focus scale event
   */
  focusMs?: number
  /**
   * Time in milliseconds for the scale to return to normal after focusing
   */
  blurMs?: number
  /**
   * Time in milliseconds for the click scale event
   */
  clickMs?: number
  /**
   * Time in milliseconds for the scale to return to normal after clicking
   */
  returnMs?: number
  /**
   * Vector3 to apply to any rotations. Defaults to forward vector to allow rotations to behave as 2D. Provide a custom value to rotate in 3D space
   */
  rotationVector?: Vector
  /**
   * How many degrees of rotation to apply on hover (only affects "spin" type haptics)
   */
  focusRotation?: number
  /**
   * How many degrees of rotation to apply on click (only affects "spin" type haptics)
   */
  clickRotation?: number
  /**
   * Whether or not the "return" part of the animation should play. Recommended true for anything other than 360 rotations (leaving return animations on in this case leads to flip flopping, instead of a single spin)
   */
  animateReturn?: boolean
  /**
   * Multiplier for scaling build-in focus scale factor.
   * (e.g. 1 performs default scale, 0.5 halves the default scale, -2 will invert the scale direction and double it)
   */
  focusScaleMultiplier?: number
  /**
   * Multiplier for scaling build-in click scale factor.
   * (e.g. 1 performs default scale, 0.5 halves the default scale, -2 will invert the scale direction and double it)
   */
  clickScaleMultiplier?: number
  /**
   * Default scale (only affects "pop" type haptics)
   */
  initialScale?: number
  /**
   * Default rotation (only affects "spin" type haptics)
   */
  initialRotation?: number
  /**
   * Events to which to add haptic scaling.
   * `focus: true` allows scaling in response to hover/focus events
   * `click: true` allows scaling in response to click/tap events
   */
  events?: {
    focus?: boolean
    click?: boolean
  }
  /**
   * Optional click handler callback. Haptic clicks are received through the built-in onClick handler.
   * Providing a value here allows the built-in click-handler to perform some delayed action in sync with animation
   * (e.g. if haptic is on a navigation button, you may want to have the navigation happen here to allow the scale transition to occur before navigating).
   */
  delayedOnClick?: (e?: InteractionEvent) => void
}

export enum UseHapticOptionsKeys {
  type,
  focusMs,
  blurMs,
  clickMs,
  returnMs,
  rotationVector,
  focusRotation,
  clickRotation,
  animateReturn,
  focusScaleMultiplier,
  clickScaleMultiplier,
  initialScale,
  initialRotation,
  events,
  delayedOnClick,
}

type _optionsVerified = VerifyOptions<
  UseHapticOptions,
  typeof UseHapticOptionsKeys
>

export const BASE_FOCUS_SCALE = 0.07
export const BASE_CLICK_SCALE = 0.05
export const FORWARD_VECTOR: Vector = [0, 0, 1]

export const USE_HAPTIC_DEFAULT_OPTIONS = {
  focusMs: 300,
  blurMs: 350,
  clickMs: 50,
  returnMs: 50,
  initialScale: 1,
  initialRotation: 0,
  focusScaleMultiplier: 1,
  clickScaleMultiplier: 1,
  animateReturn: true,
  focusRotation: 20,
  clickRotation: 360,
  type: HapticType.pop,
  rotationVector: FORWARD_VECTOR,
  events: {
    focus: true,
    click: true,
  },
}

type TransitionState = {
  focused: boolean
  returning: boolean
  clicked: boolean
}

const getTransitionType = (
  type: HapticType,
  transitionState: TransitionState,
) => {
  let transitionType: UseTransitionType = UseTransitionType.scale
  if (type === HapticType.pop) {
    if (transitionState.returning) {
      transitionType = UseTransitionType.scaleUp
    } else if (transitionState.clicked) {
      transitionType = UseTransitionType.scaleDown
    } else if (transitionState.focused) {
      transitionType = UseTransitionType.scaleUp
    } else {
      transitionType = UseTransitionType.scale
    }
  } else if (type === HapticType.spin) {
    // When using type spin, we always provide a vector, so no need to specify direction
    transitionType = UseTransitionType.rotate
  }
  return transitionType
}

export const useHaptic = (options?: UseHapticOptions) => {
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [returning, setReturning] = useState(false)
  const unclickTimeoutRef = useRef<NodeJS.Timeout>()
  const mergedOptions = merge(USE_HAPTIC_DEFAULT_OPTIONS, options)
  const mergedOptionsRef = useUpdatingRef(mergedOptions)
  const { initialScale, initialRotation } = mergedOptions
  const isFocused = focused || hovered
  let transitionMs = mergedOptions.blurMs
  let scale = initialScale
  let rotation = initialRotation

  if (returning) {
    transitionMs = mergedOptions.animateReturn ? mergedOptions.returnMs : 0
  } else if (clicked) {
    if (mergedOptions.type === HapticType.pop) {
      scale = 1 - mergedOptions.clickScaleMultiplier! * BASE_CLICK_SCALE
    } else if (mergedOptions.type === HapticType.spin) {
      rotation = mergedOptions.clickRotation
    }
    transitionMs = mergedOptions.clickMs
  } else if (isFocused) {
    if (mergedOptions.type === HapticType.pop) {
      scale = 1 + mergedOptions.focusScaleMultiplier * BASE_FOCUS_SCALE
    } else if (mergedOptions.type === HapticType.spin) {
      rotation = mergedOptions.focusRotation
    }
    transitionMs = mergedOptions.focusMs
  }

  const transitionStyle = useTransition(
    getTransitionType(mergedOptions.type, {
      focused,
      clicked,
      returning,
    }),
    {
      initialRotation,
      initialScale,
      scale,
      rotation,
      ms: transitionMs,
    },
  )

  const hapticOnClick = useCallback(
    (e?: InteractionEvent) => {
      if (!mergedOptionsRef.current.events?.click) {
        ;(document.activeElement as HTMLElement)?.blur()
        return
      }
      const { delayedOnClick } = mergedOptionsRef.current

      setClicked(true)
      setReturning(false)
      if (unclickTimeoutRef.current) {
        clearTimeout(unclickTimeoutRef.current)
      }

      unclickTimeoutRef.current = setTimeout(() => {
        if (delayedOnClick) {
          delayedOnClick(e)
        }
        if (e?.type === "click") {
          ;(document.activeElement as HTMLElement)?.blur()
        }
        setClicked(false)
        setReturning(true)
        unclickTimeoutRef.current = setTimeout(() => {
          setReturning(false)
          unclickTimeoutRef.current = undefined
        }, mergedOptionsRef.current.returnMs)
      }, mergedOptionsRef.current.clickMs)
    },
    [mergedOptionsRef],
  )

  return [
    {
      style: transitionStyle,
      onClick: hapticOnClick,
      onKeyDown: useCallback(
        (e: React.KeyboardEvent) => {
          if (e.key === "Enter") {
            hapticOnClick(e)
          }
        },
        [hapticOnClick],
      ),
      onMouseEnter: useCallback(
        () => mergedOptionsRef.current.events?.focus && setHovered(true),
        [mergedOptionsRef],
      ),
      onMouseLeave: useCallback(
        () => mergedOptionsRef.current.events?.focus && setHovered(false),
        [mergedOptionsRef],
      ),
      onFocus: useCallback(
        () => mergedOptionsRef.current.events?.focus && setFocused(true),
        [mergedOptionsRef],
      ),
      onBlur: useCallback(
        () => mergedOptionsRef.current.events?.focus && setFocused(false),
        [mergedOptionsRef],
      ),
    },
    {
      focused,
      hovered,
      clicked,
      returning,
    },
  ] as const
}

export default useHaptic
