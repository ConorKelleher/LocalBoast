import { useEffect, useMemo } from "react"
import useUpdatingRef from "localboast/hooks/useUpdatingRef"

export const useMutationObserver = (
  el: Node,
  func: MutationCallback,
  options?: MutationObserverInit,
) => {
  const funcRef = useUpdatingRef(func)
  const optionKeysAndValues: unknown[] = []
  if (options) {
    optionKeysAndValues.push(Object.keys(options))
    optionKeysAndValues.push(Object.values(options))
  }
  // Generating list of keys and values of options object - then memoizing it using itself as a deps array
  const memoizedOptionKeysAndValues = useMemo(
    () => optionKeysAndValues,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    optionKeysAndValues,
  )

  useEffect(() => {
    const newObserver = new MutationObserver((mutations, observer) => {
      funcRef.current(mutations, observer)
    })

    newObserver.observe(el, options)

    return () => {
      newObserver.disconnect()
    }
    // Disable linter since we're using options object, but deps array has our custom keys/values array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [funcRef, el, memoizedOptionKeysAndValues])
}

export default useMutationObserver
