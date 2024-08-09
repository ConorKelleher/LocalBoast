import { useEffect } from "react"
import { merge } from "localboast/utils/objectHelpers"
import useUpdatingRef from "localboast/hooks/useUpdatingRef"

export interface UseEventOptions {
  el?: HTMLElement | Window | Document
  listenerOptions?: boolean | AddEventListenerOptions
}

// DO NOT include el as a default option here - merge will create copies of html elements and break intrinsic properties and references
export const USE_EVENT_DEFAULT_OPTIONS = {}

export const useEventListener = (
  listenerType: keyof HTMLElementEventMap,
  onEvent: EventListener,
  options?: UseEventOptions,
) => {
  const onEventRef = useUpdatingRef(onEvent)
  const listenerOptionsRef = useUpdatingRef(options?.listenerOptions)
  const mergedOptions = merge(USE_EVENT_DEFAULT_OPTIONS, options)

  useEffect(() => {
    const listenerOptions = listenerOptionsRef.current
    const targetEl = mergedOptions.el || document
    const listenerCallback: EventListenerOrEventListenerObject = (
      ...callbackArgs
    ) => {
      onEventRef.current(...callbackArgs)
    }
    targetEl.addEventListener(listenerType, listenerCallback, listenerOptions)

    return () => {
      targetEl.removeEventListener(
        listenerType,
        listenerCallback,
        listenerOptions,
      )
    }
  }, [listenerType, onEventRef, mergedOptions.el, listenerOptionsRef])
}

export default useEventListener
