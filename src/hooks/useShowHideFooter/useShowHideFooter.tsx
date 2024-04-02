import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import useDelayedValue from "localboast/hooks/useDelayedValue"
import useTimeout from "localboast/hooks/useTimeout"
import useWindowResize from "localboast/hooks/useWindowResize"
import useScrollTop from "localboast/hooks/useScrollTop"
import useUpdatingRef from "localboast/hooks/useUpdatingRef"
import { merge } from "localboast/utils/objectHelpers"

export interface UseShowHideFooterOptions {
  revealDelay?: number
  initialRevealDelay?: number
  tolerance?: number
}

export const USE_SHOW_HIDE_FOOTER_DEFAULT_OPTIONS = {
  revealDelay: 200,
  initialRevealDelay: 1000,
  tolerance: 10,
}

export const useShowHideFooter = (
  customScrollTop?: number,
  options?: UseShowHideFooterOptions,
) => {
  const mergedOptions = merge(USE_SHOW_HIDE_FOOTER_DEFAULT_OPTIONS, options)
  const mergedOptionsRef = useUpdatingRef(mergedOptions)
  const [footerRevealDelay, setFooterRevealDelay] = useState(
    mergedOptions.initialRevealDelay,
  )
  const defaultScrollTop = useScrollTop(document.querySelector("html")!)
  const scrollTop =
    customScrollTop === undefined ? defaultScrollTop : customScrollTop
  const [footerLoaded, setFooterLoaded] = useState(false)
  const footerRef = useRef<HTMLElement | null>(null)
  const footerLoadedTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Re-render when window resizes
  const { height: windowHeight } = useWindowResize()

  // Kinda messed up but single variable that references the condition and changeable var that trigger a footerTopPixels value recalculation.
  // Using the individual values leads to linter error of unused dependencies
  const footerLoadedAndWindowHeight = footerLoaded && windowHeight

  // We only want to mount the footer after a second to allow docs auto-scrolling to occur first. After that, the delay should be much shorter
  const revealDelayUpdateTimeoutRef = useTimeout(() => {
    setFooterRevealDelay(mergedOptionsRef.current.revealDelay)
  }, mergedOptions.initialRevealDelay)

  // Effect to keep local reveal delay in sync with options ONLY if
  useEffect(() => {
    if (!revealDelayUpdateTimeoutRef.current) {
      setFooterRevealDelay(mergedOptions.revealDelay)
    }
  }, [revealDelayUpdateTimeoutRef, mergedOptions.revealDelay])

  // Effect to clear up lingering timeout
  useEffect(() => {
    return () => {
      if (footerLoadedTimeoutRef.current) {
        clearTimeout(footerLoadedTimeoutRef.current)
      }
    }
  }, [])

  // Memoized getter for how far down the page the footer wrapper is. 0 if not yet mounted
  const footerTopPixels = useMemo(() => {
    let topPixels = 0
    if (footerLoadedAndWindowHeight && scrollTop !== undefined) {
      const rect = footerRef.current!.getBoundingClientRect()
      topPixels = rect.top
    }
    return topPixels
  }, [scrollTop, footerLoadedAndWindowHeight])

  // footer top pixels at runtime is wrong - less than screen height for some reason even if off screen?
  // using console gives correct value - it's just being dumb

  // Memoized getter for how much of the footer is actually on screen
  const visibleFooterPixels = useMemo(() => {
    let visiblePixels = 0
    if (footerLoaded) {
      visiblePixels = windowHeight - footerTopPixels
    }
    return visiblePixels
  }, [footerTopPixels, windowHeight, footerLoaded])
  const footerWithinRange =
    footerLoaded &&
    footerTopPixels > 0 &&
    visibleFooterPixels + mergedOptions.tolerance > 0
  const [delayedFooterWithinRange] = useDelayedValue(footerWithinRange, {
    delay: footerRevealDelay,
  })
  const footerVisible = visibleFooterPixels > mergedOptions.tolerance
  const [delayedFooterVisible] = useDelayedValue(footerVisible, { delay: 100 })
  const setFooterEl = useCallback((el: HTMLElement) => {
    footerRef.current = el
    footerLoadedTimeoutRef.current = setTimeout(() => {
      footerLoadedTimeoutRef.current = null
      setFooterLoaded(true)
    }, 100)
  }, [])

  return {
    footerWithinRange,
    delayedFooterWithinRange,
    footerVisible,
    delayedFooterVisible,
    setFooterEl,
    visibleFooterPixels,
  }
}

export default useShowHideFooter
