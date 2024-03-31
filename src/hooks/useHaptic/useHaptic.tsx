import useUpdatingRef from "localboast/hooks/useUpdatingRef"
import { useCallback, useMemo, useRef, useState } from "react"

export type InteractionEvent = React.MouseEvent | React.KeyboardEvent
export interface UseHapticOptions {
  /**
   * Optional click handler callback. Clicks are detected automatically when using the provided onClick function.
   * Providing a value here allows the built-in click-handler to perform some delayed action in sync with animation
   * (e.g. if haptic is on a navigation button, you may want to have the navigation happen here to allow the scale transition to occur before navigating).
   */
  onClick?: (e?: InteractionEvent) => void
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
}
export const BASE_FOCUS_SCALE = 0.07
export const BASE_CLICK_SCALE = 0.05

export const USE_HAPTIC_DEFAULT_OPTIONS: UseHapticOptions = {
  focusMs: 300,
  blurMs: 300,
  clickMs: 50,
  returnMs: 50,
  focusScaleMultiplier: 1,
  clickScaleMultiplier: 1,
  events: {
    focus: true,
    click: true,
  },
}

export const useHaptic = (options?: UseHapticOptions) => {
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [returning, setReturning] = useState(false)
  const unclickTimeoutRef = useRef<NodeJS.Timeout>()
  const mergedOptions = {
    ...USE_HAPTIC_DEFAULT_OPTIONS,
    ...options,
  }
  const mergedOptionsRef = useUpdatingRef(mergedOptions)
  let scale = 1
  let transitionMs = mergedOptions.focusMs!
  const isFocused = focused || hovered

  if (clicked) {
    scale = 1 - mergedOptions.clickScaleMultiplier! * BASE_CLICK_SCALE
    transitionMs = mergedOptions.clickMs!
  } else if (returning) {
    transitionMs = mergedOptions.returnMs!
  } else if (isFocused) {
    scale = 1 + mergedOptions.focusScaleMultiplier! * BASE_FOCUS_SCALE
    transitionMs = mergedOptions.focusMs!
  }

  const hapticOnClick = useCallback(
    (e?: InteractionEvent) => {
      if (!mergedOptionsRef.current.events?.click) {
        ;(document.activeElement as HTMLElement)?.blur()
        return
      }
      const onClick = mergedOptionsRef.current.onClick

      setClicked(true)
      setReturning(false)
      if (unclickTimeoutRef.current) {
        clearTimeout(unclickTimeoutRef.current)
      }

      unclickTimeoutRef.current = setTimeout(() => {
        if (onClick) {
          onClick(e)
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
      style: useMemo(
        () => ({
          transform: `scale(${scale})`,
          transition: `all ${transitionMs / 1000}s ease`,
        }),
        [scale, transitionMs],
      ),
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
