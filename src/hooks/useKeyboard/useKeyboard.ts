import useEventListener from "localboast/hooks/useEventListener"
import { merge } from "localboast/utils/objectHelpers"

export interface UseKeyboardOptions {
  el?: HTMLElement
  type?: "keydown" | "keyup"
  listenerOptions?: boolean | AddEventListenerOptions
  ignoreRepeat?: boolean
}

export type OnKey = (key: KeyboardEvent["key"], e: KeyboardEvent) => void

export const USE_KEYBOARD_DEFAULT_OPTIONS = {
  type: "keydown",
  ignoreRepeat: true,
}

export const useKeyboard = (onKey: OnKey, options?: UseKeyboardOptions) => {
  const { type, ignoreRepeat, ...eventListenerOptions } = merge(
    USE_KEYBOARD_DEFAULT_OPTIONS,
    options,
  )
  useEventListener(
    type,
    (e: Event) => {
      const evt = e as KeyboardEvent
      if (!(ignoreRepeat && evt.repeat)) {
        // Only call onKey if it's not a repeat event or if we're allowing repeat events
        onKey(evt.key, evt)
      }
    },
    eventListenerOptions,
  )
}

export default useKeyboard
