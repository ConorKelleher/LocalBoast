import useUpdatingRef from "localboast/hooks/useUpdatingRef"
import { useCallback, useMemo, useRef, useState } from "react"

export type InteractionEvent = React.MouseEvent | React.KeyboardEvent
export interface UseHapticOptions {
  focusMs?: number
  blurMs?: number
  clickMs?: number
  returnMs?: number
  focusScale?: number
  clickScale?: number
  onClick?: (e?: InteractionEvent) => void
  events?: {
    focus?: boolean
    click?: boolean
  }
}
export const USE_HAPTIC_DEFAULT_OPTIONS: UseHapticOptions = {
  focusMs: 300,
  blurMs: 300,
  clickMs: 50,
  returnMs: 50,
  focusScale: 1.07,
  clickScale: 0.95,
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
    scale = mergedOptions.clickScale!
    transitionMs = mergedOptions.clickMs!
  } else if (returning) {
    transitionMs = mergedOptions.returnMs!
  } else if (isFocused) {
    scale = mergedOptions.focusScale!
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
